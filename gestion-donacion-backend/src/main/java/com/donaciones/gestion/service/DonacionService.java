package com.donaciones.gestion.service;

import com.donaciones.gestion.dto.ApkRequestDTO;
import com.donaciones.gestion.dto.DonacionRequestDTO;
import com.donaciones.gestion.dto.EdicionInventarioDTO;
import com.donaciones.gestion.dto.EliminacionDTO;
import com.donaciones.gestion.dto.RevisionDTO;
import com.donaciones.gestion.model.*;
import com.donaciones.gestion.repository.DonacionEliminadaRepository;
import com.donaciones.gestion.repository.DonanteRepository;
import com.donaciones.gestion.repository.GestionDonacionRepository;
import com.donaciones.gestion.repository.InventarioRepository;
import com.donaciones.gestion.repository.TalleresRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DonacionService {

    @Autowired
    private GestionDonacionRepository donacionRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private DonacionEliminadaRepository eliminadaRepository;

    @Autowired
    private DonanteRepository donanteRepository;

    @Autowired
    private TalleresRepository talleresRepository;

    // ----------------------------------------------------------------
    // MÉTODO PRIVADO: Upsert del Donante
    // Busca el donante por RUT; si no existe lo crea.
    // Si ya existe, actualiza su teléfono si llega uno nuevo.
    // ----------------------------------------------------------------
    private Donante resolverDonante(String rut, String nombre, String telefono) {
        Optional<Donante> optDonante = donanteRepository.findById(rut);

        if (optDonante.isPresent()) {
            Donante existente = optDonante.get();
            // Actualiza el teléfono si viene uno nuevo y no está vacío
            if (telefono != null && !telefono.isBlank()) {
                existente.setTelefono(telefono);
            }
            return donanteRepository.save(existente);
        } else {
            Donante nuevo = Donante.builder()
                    .rut(rut)
                    .nombre(nombre != null ? nombre : "Sin nombre")
                    .telefono(telefono)
                    .build();
            return donanteRepository.save(nuevo);
        }
    }

    // ----------------------------------------------------------------
    // LISTADOS
    // ----------------------------------------------------------------

    public List<GestionDonacion> listarSolicitudesPendientes() {
        return donacionRepository.findByEstadoRevision(EstadoRevision.PENDIENTE_REVISION);
    }

    public List<GestionDonacion> listarDonacionesAceptadas() {
        return donacionRepository.findByEstadoRevision(EstadoRevision.ACEPTADA);
    }

    public List<DonacionEliminada> listarHistorialEliminadas() {
        return eliminadaRepository.findAllByOrderByFechaEliminacionDesc();
    }

    public List<Talleres> listarTalleres() {
        return talleresRepository.findAll();
    }

    // ----------------------------------------------------------------
    // CREAR SOLICITUD (flujo normal desde el frontend / APK)
    // ----------------------------------------------------------------

    @Transactional
    public GestionDonacion crearSolicitudDonacion(DonacionRequestDTO dto) {
        Donante donante = resolverDonante(
                dto.getRutDonante(),
                dto.getNombreDonante(),
                dto.getTelefonoDonante()
        );

        GestionDonacion donacion = GestionDonacion.builder()
                .donante(donante)
                .objetoADonar(dto.getObjetoADonar())
                .cantidad(dto.getCantidad())
                .descripcion(dto.getDescripcion())
                .estadoRevision(EstadoRevision.PENDIENTE_REVISION)
                .build();

        return donacionRepository.save(donacion);
    }

    @Transactional
    public GestionDonacion recibirDonacionApk(ApkRequestDTO dto) {
        // La APK solo envía RUT, sin nombre ni teléfono
        Donante donante = resolverDonante(dto.getRutDonante(), null, null);

        // REGLA DE NEGOCIO: toda donación desde APK llega EN_CAMINO
        GestionDonacion donacion = GestionDonacion.builder()
                .donante(donante)
                .objetoADonar(dto.getArticulo())
                .cantidad(1)
                .descripcion("Enviado desde APK Móvil")
                .estadoRevision(EstadoRevision.PENDIENTE_REVISION)
                .estadoEnvio(EstadoEnvio.EN_CAMINO)
                .build();

        return donacionRepository.save(donacion);
    }

    // ----------------------------------------------------------------
    // REVISIÓN (Aceptar / Rechazar solicitud)
    // ----------------------------------------------------------------

    @Transactional
    public GestionDonacion procesarRevision(Long id, RevisionDTO dto) {
        GestionDonacion donacion = donacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donación no encontrada"));

        if (!donacion.getEstadoRevision().equals(EstadoRevision.PENDIENTE_REVISION)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La donación ya fue revisada");
        }

        if (dto.getAceptar()) {
            donacion.setEstadoRevision(EstadoRevision.ACEPTADA);
            donacion.setDestino(dto.getDestino());
            donacion.setEstadoEnvio(dto.getEstadoEnvio());

            GestionDonacion guardada = donacionRepository.save(donacion);

            if (dto.getDestino() == DestinoDonacion.INVENTARIO) {
                Inventario inv = Inventario.builder()
                        .gestionDonacion(guardada)
                        .cantidad(guardada.getCantidad())
                        .objeto(guardada.getObjetoADonar())
                        .descripcion(guardada.getDescripcion())
                        .build();
                inventarioRepository.save(inv);
            }
            return guardada;
        } else {
            donacion.setEstadoRevision(EstadoRevision.RECHAZADA);
            donacion.setMotivoRechazo(dto.getMotivoRechazo());
            return donacionRepository.save(donacion);
        }
    }

    // ----------------------------------------------------------------
    // INGRESO MANUAL (desde el modal "Agregar Donación Manual")
    // ----------------------------------------------------------------

    @Transactional
    public GestionDonacion ingresoManualInventario(DonacionRequestDTO dto, DestinoDonacion destino, EstadoEnvio estadoEnvio, Long codigoTaller) {
        Donante donante = resolverDonante(
                dto.getRutDonante(),
                dto.getNombreDonante(),
                dto.getTelefonoDonante()
        );

        // Buscar el taller si se proporcionó un código
        Talleres taller = null;
        if (codigoTaller != null) {
            taller = talleresRepository.findById(codigoTaller)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Taller no encontrado con código: " + codigoTaller));
        }

        GestionDonacion donacion = GestionDonacion.builder()
                .donante(donante)
                .objetoADonar(dto.getObjetoADonar())
                .cantidad(dto.getCantidad())
                .descripcion(dto.getDescripcion())
                .estadoRevision(EstadoRevision.ACEPTADA)
                .destino(destino)
                .estadoEnvio(estadoEnvio)
                .taller(taller)
                .build();

        GestionDonacion guardada = donacionRepository.save(donacion);

        if (destino == DestinoDonacion.INVENTARIO) {
            Inventario inv = Inventario.builder()
                    .gestionDonacion(guardada)
                    .cantidad(guardada.getCantidad())
                    .objeto(guardada.getObjetoADonar())
                    .descripcion(guardada.getDescripcion())
                    .build();
            inventarioRepository.save(inv);
        }

        return guardada;
    }

    // ----------------------------------------------------------------
    // EDITAR INVENTARIO
    // ----------------------------------------------------------------

    @Transactional
    public GestionDonacion editarInventario(Long id, EdicionInventarioDTO dto) {
        GestionDonacion donacion = donacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donación no encontrada"));

        donacion.setCantidad(dto.getCantidad());
        donacion.setEstadoEnvio(dto.getEstadoEnvio());

        if (donacion.getDestino() == DestinoDonacion.INVENTARIO) {
            Optional<Inventario> optInv = inventarioRepository.findById(id);
            if (optInv.isPresent()) {
                Inventario inv = optInv.get();
                inv.setCantidad(dto.getCantidad());
                inventarioRepository.save(inv);
            }
        }
        return donacionRepository.save(donacion);
    }

    // ----------------------------------------------------------------
    // ELIMINAR DONACIÓN
    // ----------------------------------------------------------------

    @Transactional
    public void eliminarDonacion(Long id, EliminacionDTO dto) {
        GestionDonacion donacion = donacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donación no encontrada"));

        DonacionEliminada eliminada = DonacionEliminada.builder()
                .idDonacionOriginal(donacion.getId())
                .articulo(donacion.getObjetoADonar())
                .cantidad(donacion.getCantidad())
                .motivoEliminacion(dto.getJustificacion())
                .fechaEliminacion(LocalDateTime.now())
                .build();
        eliminadaRepository.save(eliminada);

        // Borramos el inventario asociado manualmente antes de la donación (shared PK)
        if (donacion.getDestino() == DestinoDonacion.INVENTARIO) {
            inventarioRepository.deleteById(id);
        }
        donacionRepository.delete(donacion);
    }
}
