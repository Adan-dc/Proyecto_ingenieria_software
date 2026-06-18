package com.talleres.admin_talleres.controller;

import com.talleres.admin_talleres.dto.AjusteArticuloRequest;
import com.talleres.admin_talleres.dto.RecepcionArticuloRequest;
import com.talleres.admin_talleres.model.ArticuloRequerido;
import com.talleres.admin_talleres.service.ArticuloRequeridoService;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos-requeridos")
@CrossOrigin(origins = "*")
public class ArticuloRequeridoController {

    private final ArticuloRequeridoService articuloRequeridoService;

    public ArticuloRequeridoController(ArticuloRequeridoService articuloRequeridoService) {
        this.articuloRequeridoService = articuloRequeridoService;
    }

    @GetMapping
    public List<ArticuloRequerido> listarArticulos() {
        return articuloRequeridoService.listarArticulos();
    }

    @GetMapping("/{id}")
    public ArticuloRequerido buscarPorId(@PathVariable Long id) {
        return articuloRequeridoService.buscarPorId(id);
    }

    @GetMapping("/taller/{tallerId}")
    public List<ArticuloRequerido> listarPorTaller(@PathVariable Long tallerId) {
        return articuloRequeridoService.listarPorTaller(tallerId);
    }

    @PostMapping("/taller/{tallerId}")
    public ArticuloRequerido crearArticulo(
            @PathVariable Long tallerId,
            @RequestBody ArticuloRequerido articulo
    ) {
        return articuloRequeridoService.crearArticulo(tallerId, articulo);
    }

    @PutMapping("/{id}")
    public ArticuloRequerido actualizarArticulo(
            @PathVariable Long id,
            @RequestBody ArticuloRequerido articulo
    ) {
        return articuloRequeridoService.actualizarArticulo(id, articulo);
    }

    /*
     * Endpoint nuevo:
     * Este lo llamará el backend de gestión de donaciones
     * cuando una solicitud sea aceptada.
     *
     * POST /api/articulos-requeridos/taller/1/recibir
     */
    @PostMapping("/taller/{tallerId}/recibir")
    public ArticuloRequerido registrarRecepcionDesdeDonacion(
            @PathVariable Long tallerId,
            @RequestBody RecepcionArticuloRequest request
    ) {
        return articuloRequeridoService.registrarRecepcionDesdeDonacion(tallerId, request);
    }

    @DeleteMapping("/{id}")
    public void eliminarArticulo(@PathVariable Long id) {
        articuloRequeridoService.eliminarArticulo(id);
    }

    @PostMapping("/taller/{tallerId}/descontar")
    public ArticuloRequerido descontarRecepcionDesdeEliminacion(
            @PathVariable Long tallerId,
            @RequestBody AjusteArticuloRequest request
    ) {
        return articuloRequeridoService.descontarRecepcionDesdeEliminacion(tallerId, request);
    }
}