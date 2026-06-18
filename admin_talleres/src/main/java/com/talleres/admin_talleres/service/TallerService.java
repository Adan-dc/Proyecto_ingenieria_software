package com.talleres.admin_talleres.service;

import com.talleres.admin_talleres.dto.ArticuloRequeridoRequest;
import com.talleres.admin_talleres.dto.TallerConArticulosRequest;
import com.talleres.admin_talleres.model.ArticuloRequerido;
import com.talleres.admin_talleres.model.Taller;
import com.talleres.admin_talleres.repository.ArticuloRequeridoRepository;
import com.talleres.admin_talleres.repository.TallerRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TallerService {

    private final TallerRepository tallerRepository;
    private final ArticuloRequeridoRepository articuloRequeridoRepository;

    public TallerService(
            TallerRepository tallerRepository,
            ArticuloRequeridoRepository articuloRequeridoRepository
    ) {
        this.tallerRepository = tallerRepository;
        this.articuloRequeridoRepository = articuloRequeridoRepository;
    }

    public List<Taller> listarTalleres() {
        return tallerRepository.findAll();
    }

    public Taller buscarPorId(Long id) {
        return tallerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Taller no encontrado"
                ));
    }

    public Taller crearTaller(Taller taller) {
        if (taller.getCuposTotales() == null || taller.getCuposTotales() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos totales deben ser mayores a 0"
            );
        }

        if (taller.getCuposOcupados() == null) {
            taller.setCuposOcupados(0);
        }

        validarCupos(taller.getCuposTotales(), taller.getCuposOcupados());

        if (taller.getEstado() == null || taller.getEstado().isBlank()) {
            taller.setEstado("ACTIVO");
        }

        return tallerRepository.save(taller);
    }

    public Taller actualizarTaller(Long id, Taller tallerActualizado) {
        Taller taller = tallerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Taller no encontrado"
                ));

        Integer cuposTotales = tallerActualizado.getCuposTotales();
        Integer cuposOcupados = tallerActualizado.getCuposOcupados();

        if (cuposTotales == null || cuposTotales <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos totales deben ser mayores a 0"
            );
        }

        if (cuposOcupados == null) {
            cuposOcupados = taller.getCuposOcupados() == null ? 0 : taller.getCuposOcupados();
        }

        validarCupos(cuposTotales, cuposOcupados);

        taller.setNombre(tallerActualizado.getNombre());
        taller.setEtiqueta(tallerActualizado.getEtiqueta());
        taller.setDescripcion(tallerActualizado.getDescripcion());
        taller.setProfesor(tallerActualizado.getProfesor());

        taller.setFecha(tallerActualizado.getFecha());
        taller.setHoraInicio(tallerActualizado.getHoraInicio());
        taller.setHoraFin(tallerActualizado.getHoraFin());

        taller.setLugar(tallerActualizado.getLugar());
        taller.setDireccion(tallerActualizado.getDireccion());

        taller.setCuposTotales(cuposTotales);
        taller.setCuposOcupados(cuposOcupados);

        taller.setImagenUrl(tallerActualizado.getImagenUrl());
        taller.setImagenClase(tallerActualizado.getImagenClase());

        if (tallerActualizado.getEstado() == null || tallerActualizado.getEstado().isBlank()) {
            taller.setEstado("ACTIVO");
        } else {
            taller.setEstado(tallerActualizado.getEstado());
        }

        return tallerRepository.save(taller);
    }

    @Transactional
    public void eliminarTaller(Long id) {
        if (!tallerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Taller no encontrado");
        }

        articuloRequeridoRepository.deleteByTaller_Id(id);
        tallerRepository.deleteById(id);
    }

    public Taller crearTallerConArticulos(TallerConArticulosRequest request) {
        if (request.getCuposTotales() == null || request.getCuposTotales() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos totales deben ser mayores a 0"
            );
        }

        Taller taller = new Taller();

        taller.setNombre(request.getNombre());
        taller.setEtiqueta(request.getEtiqueta());
        taller.setDescripcion(request.getDescripcion());
        taller.setProfesor(request.getProfesor());

        taller.setFecha(request.getFecha());
        taller.setHoraInicio(request.getHoraInicio());
        taller.setHoraFin(request.getHoraFin());

        taller.setLugar(request.getLugar());
        taller.setDireccion(request.getDireccion());

        taller.setCuposTotales(request.getCuposTotales());
        taller.setCuposOcupados(0);

        taller.setImagenUrl(request.getImagenUrl());
        taller.setImagenClase(request.getImagenClase());

        if (request.getEstado() == null || request.getEstado().isBlank()) {
            taller.setEstado("ACTIVO");
        } else {
            taller.setEstado(request.getEstado());
        }

        Taller tallerGuardado = tallerRepository.save(taller);

        if (request.getArticulos() != null) {
            for (ArticuloRequeridoRequest articuloRequest : request.getArticulos()) {
                ArticuloRequerido articulo = new ArticuloRequerido();

                articulo.setNombre(articuloRequest.getNombre());
                articulo.setDescripcion(articuloRequest.getDescripcion());
                articulo.setCantidadNecesaria(articuloRequest.getCantidadNecesaria());
                articulo.setCantidadRecibida(0);
                articulo.setEstado("PENDIENTE");
                articulo.setIcono(articuloRequest.getIcono());
                articulo.setTaller(tallerGuardado);

                articuloRequeridoRepository.save(articulo);
            }
        }

        return tallerGuardado;
    }

    @Transactional
    public Taller inscribirVoluntario(Long id) {
        Taller taller = tallerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Taller no encontrado"
                ));

        Integer ocupados = taller.getCuposOcupados();
        Integer totales = taller.getCuposTotales();

        if (ocupados == null) {
            ocupados = 0;
        }

        if (totales == null || totales <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El taller no tiene cupos configurados"
            );
        }

        if (ocupados >= totales) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No quedan cupos disponibles"
            );
        }

        taller.setCuposOcupados(ocupados + 1);

        return tallerRepository.save(taller);
    }

    private void validarCupos(Integer cuposTotales, Integer cuposOcupados) {
        if (cuposTotales == null || cuposTotales <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos totales deben ser mayores a 0"
            );
        }

        if (cuposOcupados == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos ocupados no pueden ser nulos"
            );
        }

        if (cuposOcupados < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos ocupados no pueden ser negativos"
            );
        }

        if (cuposOcupados > cuposTotales) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los cupos ocupados no pueden superar los cupos totales"
            );
        }
    }
}