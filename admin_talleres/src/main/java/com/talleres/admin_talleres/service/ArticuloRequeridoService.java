package com.talleres.admin_talleres.service;

import com.talleres.admin_talleres.dto.RecepcionArticuloRequest;
import com.talleres.admin_talleres.model.ArticuloRequerido;
import com.talleres.admin_talleres.model.Taller;
import com.talleres.admin_talleres.repository.ArticuloRequeridoRepository;
import com.talleres.admin_talleres.repository.TallerRepository;
import com.talleres.admin_talleres.dto.AjusteArticuloRequest;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ArticuloRequeridoService {

    private final ArticuloRequeridoRepository articuloRequeridoRepository;
    private final TallerRepository tallerRepository;

    public ArticuloRequeridoService(
            ArticuloRequeridoRepository articuloRequeridoRepository,
            TallerRepository tallerRepository
    ) {
        this.articuloRequeridoRepository = articuloRequeridoRepository;
        this.tallerRepository = tallerRepository;
    }

    public List<ArticuloRequerido> listarArticulos() {
        return articuloRequeridoRepository.findAll();
    }

    public List<ArticuloRequerido> listarPorTaller(Long tallerId) {
        return articuloRequeridoRepository.findByTallerId(tallerId);
    }

    public ArticuloRequerido buscarPorId(Long id) {
        return articuloRequeridoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Artículo requerido no encontrado"
                ));
    }

    @Transactional
    public ArticuloRequerido crearArticulo(Long tallerId, ArticuloRequerido articulo) {
        Taller taller = tallerRepository.findById(tallerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Taller no encontrado"
                ));

        articulo.setTaller(taller);

        if (articulo.getCantidadNecesaria() == null || articulo.getCantidadNecesaria() < 0) {
            articulo.setCantidadNecesaria(0);
        }

        if (articulo.getCantidadRecibida() == null || articulo.getCantidadRecibida() < 0) {
            articulo.setCantidadRecibida(0);
        }

        articulo.setEstado(calcularEstado(
                articulo.getCantidadRecibida(),
                articulo.getCantidadNecesaria()
        ));

        return articuloRequeridoRepository.save(articulo);
    }

    @Transactional
    public ArticuloRequerido actualizarArticulo(Long id, ArticuloRequerido articuloActualizado) {
        ArticuloRequerido articulo = articuloRequeridoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Artículo requerido no encontrado"
                ));

        articulo.setNombre(articuloActualizado.getNombre());
        articulo.setDescripcion(articuloActualizado.getDescripcion());
        articulo.setCantidadNecesaria(
                articuloActualizado.getCantidadNecesaria() != null
                        ? articuloActualizado.getCantidadNecesaria()
                        : 0
        );

        /*
         * Importante:
         * Si el admin edita manualmente cantidadRecibida, se respeta.
         * Pero normalmente ya no tendrá que tocarla porque se actualizará automáticamente
         * cuando se acepte una donación desde gestión.
         */
        articulo.setCantidadRecibida(
                articuloActualizado.getCantidadRecibida() != null
                        ? articuloActualizado.getCantidadRecibida()
                        : 0
        );

        articulo.setIcono(articuloActualizado.getIcono());

        articulo.setEstado(calcularEstado(
                articulo.getCantidadRecibida(),
                articulo.getCantidadNecesaria()
        ));

        return articuloRequeridoRepository.save(articulo);
    }

    @Transactional
    public ArticuloRequerido registrarRecepcionDesdeDonacion(Long tallerId, RecepcionArticuloRequest request) {
        if (tallerId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El ID del taller es obligatorio"
            );
        }

        if (request == null || request.getNombreArticulo() == null || request.getNombreArticulo().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del artículo es obligatorio"
            );
        }

        Integer cantidadNueva = request.getCantidad();

        if (cantidadNueva == null || cantidadNueva <= 0) {
            cantidadNueva = 1;
        }

        ArticuloRequerido articulo = articuloRequeridoRepository
                .findByTallerIdAndNombreIgnoreCase(tallerId, request.getNombreArticulo().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró el artículo requerido en este taller"
                ));

        Integer recibidaActual = articulo.getCantidadRecibida();

        if (recibidaActual == null) {
            recibidaActual = 0;
        }

        Integer necesaria = articulo.getCantidadNecesaria();

        if (necesaria == null) {
            necesaria = 0;
        }

        int totalRecibido = recibidaActual + cantidadNueva;

        /*
         * Si no quieres que sobrepase la cantidad necesaria,
         * dejamos el máximo en cantidadNecesaria.
         */
        if (necesaria > 0 && totalRecibido > necesaria) {
            totalRecibido = necesaria;
        }

        articulo.setCantidadRecibida(totalRecibido);
        articulo.setEstado(calcularEstado(totalRecibido, necesaria));

        return articuloRequeridoRepository.save(articulo);
    }

    @Transactional
    public void eliminarArticulo(Long id) {
        if (!articuloRequeridoRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Artículo requerido no encontrado"
            );
        }

        articuloRequeridoRepository.deleteById(id);
    }

    private String calcularEstado(Integer cantidadRecibida, Integer cantidadNecesaria) {
        int recibida = cantidadRecibida != null ? cantidadRecibida : 0;
        int necesaria = cantidadNecesaria != null ? cantidadNecesaria : 0;

        if (necesaria <= 0) {
            return "PENDIENTE";
        }

        if (recibida <= 0) {
            return "PENDIENTE";
        }

        if (recibida >= necesaria) {
            return "COMPLETO";
        }

        return "PARCIAL";
    }
    @Transactional
    public ArticuloRequerido descontarRecepcionDesdeEliminacion(Long tallerId, AjusteArticuloRequest request) {
    if (tallerId == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del taller es obligatorio"
        );
    }

    if (request == null || request.getNombreArticulo() == null || request.getNombreArticulo().isBlank()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El nombre del artículo es obligatorio"
        );
    }

    Integer cantidadARestar = request.getCantidad();

    if (cantidadARestar == null || cantidadARestar <= 0) {
        cantidadARestar = 1;
    }

    ArticuloRequerido articulo = articuloRequeridoRepository
            .findByTallerIdAndNombreIgnoreCase(tallerId, request.getNombreArticulo().trim())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el artículo requerido en este taller"
            ));

    Integer recibidaActual = articulo.getCantidadRecibida();

    if (recibidaActual == null) {
        recibidaActual = 0;
    }

    Integer necesaria = articulo.getCantidadNecesaria();

    if (necesaria == null) {
        necesaria = 0;
    }

    int nuevaCantidad = recibidaActual - cantidadARestar;

    if (nuevaCantidad < 0) {
        nuevaCantidad = 0;
    }

    articulo.setCantidadRecibida(nuevaCantidad);
    articulo.setEstado(calcularEstado(nuevaCantidad, necesaria));

    return articuloRequeridoRepository.save(articulo);
}
}