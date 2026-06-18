package com.donaciones.gestion.service;

import com.donaciones.gestion.dto.ApkRequestDTO;
import com.donaciones.gestion.dto.EliminacionInventarioDTO;
import com.donaciones.gestion.dto.RevisionDTO;
import com.donaciones.gestion.dto.VecinoRegistroDTO;

import com.donaciones.gestion.model.DestinoDonacion;
import com.donaciones.gestion.model.DonacionEliminada;
import com.donaciones.gestion.model.Donante;
import com.donaciones.gestion.model.EstadoEnvio;
import com.donaciones.gestion.model.EstadoRevision;
import com.donaciones.gestion.model.GestionDonacion;
import com.donaciones.gestion.model.Inventario;

import com.donaciones.gestion.repository.DonacionEliminadaRepository;
import com.donaciones.gestion.repository.DonanteRepository;
import com.donaciones.gestion.repository.GestionDonacionRepository;
import com.donaciones.gestion.repository.InventarioRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.donaciones.gestion.dto.AcopioDTO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DonacionService {

    private final DonanteRepository donanteRepository;
    private final GestionDonacionRepository gestionDonacionRepository;
    private final InventarioRepository inventarioRepository;
    private final DonacionEliminadaRepository donacionEliminadaRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${admin.talleres.articulos.url:http://localhost:8081/api/articulos-requeridos}")
    private String adminTalleresArticulosUrl;

    public DonacionService(
            DonanteRepository donanteRepository,
            GestionDonacionRepository gestionDonacionRepository,
            InventarioRepository inventarioRepository,
            DonacionEliminadaRepository donacionEliminadaRepository
    ) {
        this.donanteRepository = donanteRepository;
        this.gestionDonacionRepository = gestionDonacionRepository;
        this.inventarioRepository = inventarioRepository;
        this.donacionEliminadaRepository = donacionEliminadaRepository;
    }

    // =========================================================
    // VECINOS / DONANTES
    // =========================================================

    @Transactional
    public Donante registrarVecino(VecinoRegistroDTO dto) {
    String rutNormalizado = normalizarRut(dto.getRut());

    if (rutNormalizado == null || rutNormalizado.isBlank()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El RUT es obligatorio"
        );
    }

    Donante donante = donanteRepository.findByRut(rutNormalizado)
            .orElseGet(() -> donanteRepository.findByRut(dto.getRut()).orElse(new Donante()));

    donante.setRut(rutNormalizado);

    String nombreCompleto = obtenerNombreCompletoRegistro(dto);

    if (!nombreCompleto.isBlank()) {
        String[] partes = nombreCompleto.split(" ", 2);

        donante.setNombre(partes[0]);

        if (partes.length > 1) {
            donante.setApellido(partes[1]);
        } else if (dto.getApellido() != null && !dto.getApellido().isBlank()) {
            donante.setApellido(dto.getApellido().trim());
        }
    } else if (donante.getNombre() == null || donante.getNombre().isBlank()) {
        donante.setNombre("Vecino");
    }

    donante.setCorreo(primerTexto(dto.getCorreo(), dto.getEmail(), donante.getCorreo()));
    donante.setTelefono(primerTexto(dto.getTelefono(), donante.getTelefono()));
    donante.setDireccion(primerTexto(dto.getDireccion(), donante.getDireccion()));

    // Sector eliminado del registro.
    donante.setSector(null);

    return donanteRepository.save(donante);
}

    @Transactional
    public Donante registrarVecino(ApkRequestDTO dto) {
        return resolverDonanteApk(dto);
    }

    public Donante buscarVecinoPorRut(String rut) {
        String rutNormalizado = normalizarRut(rut);
    
        return donanteRepository.findByRut(rutNormalizado)
                .orElseGet(() -> donanteRepository.findByRut(rut).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Vecino no encontrado"
                )));
    }

    private Donante resolverDonanteApk(ApkRequestDTO dto) {
        String rutNormalizado = normalizarRut(dto.getRutDonante());
    
        if (rutNormalizado == null || rutNormalizado.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El RUT del donante es obligatorio"
            );
        }
    
        Donante donante = donanteRepository.findByRut(rutNormalizado)
                .orElseGet(() -> donanteRepository.findByRut(dto.getRutDonante()).orElse(new Donante()));
    
        donante.setRut(rutNormalizado);
    
        String nombreCompleto = dto.getNombreDonante() == null
                ? ""
                : dto.getNombreDonante().trim();
    
        if (!nombreCompleto.isBlank()) {
            String[] partes = nombreCompleto.split(" ", 2);
    
            donante.setNombre(partes[0]);
    
            if (partes.length > 1) {
                donante.setApellido(partes[1]);
            }
        } else if (donante.getNombre() == null || donante.getNombre().isBlank()) {
            donante.setNombre("Vecino");
        }
    
        if (dto.getTelefonoDonante() != null) {
            donante.setTelefono(dto.getTelefonoDonante());
        }
    
        if (dto.getCorreoDonante() != null) {
            donante.setCorreo(dto.getCorreoDonante());
        }
    
        if (dto.getDireccionDonante() != null) {
            donante.setDireccion(dto.getDireccionDonante());
        }
    
        // Sector eliminado del flujo de donante.
        donante.setSector(null);
    
        return donanteRepository.save(donante);
    }

    // =========================================================
    // SOLICITUDES DESDE APK DONANTE
    // =========================================================

    @Transactional
    public GestionDonacion recibirDonacionApk(ApkRequestDTO dto) {
        resolverDonanteApk(dto);

        String articulo = obtenerArticuloDesdeDto(dto);

        if (articulo == null || articulo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El artículo u objeto a donar es obligatorio"
            );
        }

        GestionDonacion donacion = new GestionDonacion();

        donacion.setRutDonante(normalizarRut(dto.getRutDonante()));
        donacion.setNombreDonante(dto.getNombreDonante());
        donacion.setTelefonoDonante(dto.getTelefonoDonante());
        donacion.setCorreoDonante(dto.getCorreoDonante());
        donacion.setDireccionDonante(dto.getDireccionDonante());
        donacion.setSectorDonante(null);

        donacion.setObjetoADonar(articulo);
        donacion.setCantidad(dto.getCantidad() != null ? dto.getCantidad() : 1);
        donacion.setDescripcion(dto.getDescripcion());

        donacion.setCodigoTaller(dto.getCodigoTaller());
        donacion.setNombreTaller(dto.getNombreTaller());

        donacion.setEstadoRevision(EstadoRevision.PENDIENTE_REVISION);
        donacion.setEstadoEnvio(EstadoEnvio.EN_CAMINO);
        donacion.setDestino(DestinoDonacion.TALLER);

        return gestionDonacionRepository.save(donacion);
    }

    public List<GestionDonacion> listarSolicitudesPendientes() {
        return gestionDonacionRepository.findByEstadoRevision(
                EstadoRevision.PENDIENTE_REVISION
        );
    }

    public List<GestionDonacion> listarMisSolicitudes(String rut) {
        return gestionDonacionRepository.findByRutDonanteOrderByIdDesc(normalizarRut(rut));
    }

    // =========================================================
    // ACEPTAR / RECHAZAR SOLICITUDES
    // =========================================================

    @Transactional
    public GestionDonacion procesarRevision(Long id, RevisionDTO dto) {
        GestionDonacion donacion = gestionDonacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitud no encontrada"
                ));

        if (donacion.getEstadoRevision() == EstadoRevision.ACEPTADA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Esta solicitud ya fue aceptada"
            );
        }

        if (donacion.getEstadoRevision() == EstadoRevision.RECHAZADA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Esta solicitud ya fue rechazada"
            );
        }

        if (Boolean.TRUE.equals(dto.getAceptar())) {

            // Ahora aceptar NO manda al inventario.
            // Solo deja la donación lista para confirmar llegada al punto de acopio.
            donacion.setEstadoRevision(EstadoRevision.ACEPTADA);
            donacion.setEstadoEnvio(EstadoEnvio.EN_CAMINO);

        } else {

            // Si se rechaza desde solicitudes, no pasa al punto de acopio.
            donacion.setEstadoRevision(EstadoRevision.RECHAZADA);
            donacion.setEstadoEnvio(EstadoEnvio.NO_LLEGO);
        }

        return gestionDonacionRepository.save(donacion);
    }

    public List<GestionDonacion> listarPendientesAcopio() {
        return gestionDonacionRepository.findByEstadoRevisionAndEstadoEnvio(
                EstadoRevision.ACEPTADA,
                EstadoEnvio.EN_CAMINO
        );
    }
    
    @Transactional
    public GestionDonacion confirmarAcopio(Long id, AcopioDTO dto) {
        GestionDonacion donacion = gestionDonacionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Solicitud no encontrada"
                ));
    
        if (donacion.getEstadoRevision() != EstadoRevision.ACEPTADA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo se puede confirmar una solicitud aceptada"
            );
        }
    
        if (donacion.getEstadoEnvio() != EstadoEnvio.EN_CAMINO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Esta solicitud ya fue procesada en el punto de acopio"
            );
        }
    
        if (Boolean.TRUE.equals(dto.getLlego())) {
    
            donacion.setEstadoEnvio(EstadoEnvio.LLEGO);
    
            // Recién aquí pasa al inventario.
            guardarSolicitudAceptadaEnInventario(donacion);
    
            // Recién aquí se actualiza lo recibido para el taller.
            avisarRecepcionArticuloATaller(donacion);
    
        } else {
    
            // No llegó al punto de acopio, por tanto NO pasa al inventario.
            donacion.setEstadoEnvio(EstadoEnvio.NO_LLEGO);
        }
    
        return gestionDonacionRepository.save(donacion);
    }

    private void guardarSolicitudAceptadaEnInventario(GestionDonacion donacion) {
        Inventario inventario = new Inventario();

        inventario.setRutDonante(normalizarRut(donacion.getRutDonante()));
        inventario.setNombreDonante(donacion.getNombreDonante());
        inventario.setTelefonoDonante(donacion.getTelefonoDonante());
        inventario.setCorreoDonante(donacion.getCorreoDonante());
        inventario.setDireccionDonante(donacion.getDireccionDonante());
        inventario.setSectorDonante(null);

        inventario.setArticulo(donacion.getObjetoADonar());
        inventario.setCantidad(donacion.getCantidad() != null ? donacion.getCantidad() : 1);
        inventario.setDescripcion(donacion.getDescripcion());

        inventario.setEstadoEnvio(EstadoEnvio.LLEGO);

        inventario.setCodigoTaller(donacion.getCodigoTaller());
        inventario.setNombreTaller(donacion.getNombreTaller());

        inventarioRepository.save(inventario);
    }

    // =========================================================
    // INVENTARIO
    // =========================================================

    public List<Inventario> listarInventario() {
        return inventarioRepository.findAllByOrderByFechaIngresoDesc();
    }

    @Transactional
    public Inventario crearDonacionManualInventario(ApkRequestDTO dto) {
        resolverDonanteApk(dto);

        String articulo = obtenerArticuloDesdeDto(dto);

        if (articulo == null || articulo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El artículo u objeto es obligatorio"
            );
        }

        Inventario inventario = new Inventario();

        inventario.setRutDonante(normalizarRut(dto.getRutDonante()));
        inventario.setNombreDonante(dto.getNombreDonante());
        inventario.setTelefonoDonante(dto.getTelefonoDonante());
        inventario.setCorreoDonante(dto.getCorreoDonante());
        inventario.setDireccionDonante(dto.getDireccionDonante());
        inventario.setSectorDonante(null);

        inventario.setArticulo(articulo);
        inventario.setCantidad(dto.getCantidad() != null ? dto.getCantidad() : 1);
        inventario.setDescripcion(dto.getDescripcion());
        inventario.setEstadoEnvio(EstadoEnvio.LLEGO);

        inventario.setCodigoTaller(dto.getCodigoTaller());
        inventario.setNombreTaller(dto.getNombreTaller());

        Inventario inventarioGuardado = inventarioRepository.save(inventario);

        avisarRecepcionArticuloATaller(dto);

        return inventarioGuardado;
    }

    @Transactional
    public void eliminarInventario(Long id, EliminacionInventarioDTO dto) {
        Inventario inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Donación de inventario no encontrada"
                ));

        String motivo = dto != null ? dto.getMotivoEliminacion() : null;

        if (motivo == null || motivo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe ingresar un motivo de eliminación"
            );
        }

        DonacionEliminada eliminada = new DonacionEliminada();

        eliminada.setIdDonacionOriginal(inventario.getId());
        eliminada.setArticulo(inventario.getArticulo());
        eliminada.setCantidad(inventario.getCantidad());
        eliminada.setMotivoEliminacion(motivo);

        donacionEliminadaRepository.save(eliminada);

        avisarDescuentoArticuloATaller(inventario);

        inventarioRepository.delete(inventario);
    }

    // =========================================================
    // HISTORIAL
    // =========================================================

    public List<DonacionEliminada> listarHistorialEliminadas() {
        return donacionEliminadaRepository.findAllByOrderByFechaEliminacionDesc();
    }

    // =========================================================
    // COMUNICACIÓN CON ADMIN_TALLERES
    // =========================================================

    private void avisarRecepcionArticuloATaller(GestionDonacion donacion) {
        if (donacion.getCodigoTaller() == null) {
            return;
        }

        if (donacion.getObjetoADonar() == null || donacion.getObjetoADonar().isBlank()) {
            return;
        }

        Integer cantidad = donacion.getCantidad();

        if (cantidad == null || cantidad <= 0) {
            cantidad = 1;
        }

        String url = adminTalleresArticulosUrl
                + "/taller/"
                + donacion.getCodigoTaller()
                + "/recibir";

        Map<String, Object> body = new HashMap<>();
        body.put("nombreArticulo", donacion.getObjetoADonar());
        body.put("cantidad", cantidad);

        try {
            restTemplate.postForObject(url, body, Object.class);
        } catch (Exception error) {
            System.out.println("No se pudo actualizar artículo requerido en admin_talleres: " + error.getMessage());
        }
    }

    private void avisarRecepcionArticuloATaller(ApkRequestDTO dto) {
        if (dto.getCodigoTaller() == null) {
            return;
        }

        String nombreArticulo = obtenerArticuloDesdeDto(dto);

        if (nombreArticulo == null || nombreArticulo.isBlank()) {
            return;
        }

        Integer cantidad = dto.getCantidad();

        if (cantidad == null || cantidad <= 0) {
            cantidad = 1;
        }

        String url = adminTalleresArticulosUrl
                + "/taller/"
                + dto.getCodigoTaller()
                + "/recibir";

        Map<String, Object> body = new HashMap<>();
        body.put("nombreArticulo", nombreArticulo);
        body.put("cantidad", cantidad);

        try {
            restTemplate.postForObject(url, body, Object.class);
        } catch (Exception error) {
            System.out.println("No se pudo actualizar artículo requerido en admin_talleres: " + error.getMessage());
        }
    }

    private void avisarDescuentoArticuloATaller(Inventario inventario) {
        if (inventario.getCodigoTaller() == null) {
            return;
        }

        if (inventario.getArticulo() == null || inventario.getArticulo().isBlank()) {
            return;
        }

        Integer cantidad = inventario.getCantidad();

        if (cantidad == null || cantidad <= 0) {
            cantidad = 1;
        }

        String url = adminTalleresArticulosUrl
                + "/taller/"
                + inventario.getCodigoTaller()
                + "/descontar";

        Map<String, Object> body = new HashMap<>();
        body.put("nombreArticulo", inventario.getArticulo());
        body.put("cantidad", cantidad);

        try {
            restTemplate.postForObject(url, body, Object.class);
        } catch (Exception error) {
            System.out.println("No se pudo descontar artículo en admin_talleres: " + error.getMessage());
        }
    }

    // =========================================================
    // UTILIDADES
    // =========================================================

    private String obtenerArticuloDesdeDto(ApkRequestDTO dto) {
        String articulo = dto.getArticulo();

        if (articulo == null || articulo.isBlank()) {
            articulo = dto.getObjeto();
        }

        return articulo;
    }
    private String normalizarRut(String rut) {
        if (rut == null) {
            return null;
        }
    
        String limpio = rut.trim()
                .replace(".", "")
                .replace(" ", "")
                .toUpperCase();
    
        if (limpio.isBlank()) {
            return null;
        }
    
        if (limpio.contains("-")) {
            String[] partes = limpio.split("-");
            if (partes.length >= 2) {
                String cuerpo = partes[0].replace("-", "");
                String dv = partes[1];
                return cuerpo + "-" + dv;
            }
        }
    
        if (limpio.length() > 1) {
            String cuerpo = limpio.substring(0, limpio.length() - 1);
            String dv = limpio.substring(limpio.length() - 1);
            return cuerpo + "-" + dv;
        }
    
        return limpio;
    }
    
    private String primerTexto(String... valores) {
        if (valores == null) {
            return null;
        }
    
        for (String valor : valores) {
            if (valor != null && !valor.trim().isBlank()) {
                return valor.trim();
            }
        }
    
        return null;
    }
    
    private String obtenerNombreCompletoRegistro(VecinoRegistroDTO dto) {
        String nombreCompleto = primerTexto(dto.getNombreCompleto());
    
        if (nombreCompleto != null) {
            return nombreCompleto;
        }
    
        String nombre = primerTexto(dto.getNombre());
        String apellido = primerTexto(dto.getApellido());
    
        if (nombre == null && apellido == null) {
            return "";
        }
    
        if (apellido == null) {
            return nombre;
        }
    
        if (nombre == null) {
            return apellido;
        }
    
        return nombre + " " + apellido;
    }
}