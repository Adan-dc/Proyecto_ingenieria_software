package com.talleres.admin_talleres.controller;

import com.talleres.admin_talleres.dto.ComentarioRequest;
import com.talleres.admin_talleres.model.ComentarioTaller;
import com.talleres.admin_talleres.service.ComentarioTallerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*")
public class ComentarioTallerController {

    private final ComentarioTallerService comentarioTallerService;

    public ComentarioTallerController(ComentarioTallerService comentarioTallerService) {
        this.comentarioTallerService = comentarioTallerService;
    }

    @GetMapping
    public List<ComentarioTaller> listarComentarios() {
        return comentarioTallerService.listarComentarios();
    }

    @GetMapping("/{id}")
    public ComentarioTaller buscarPorId(@PathVariable Long id) {
        return comentarioTallerService.buscarPorId(id);
    }

    @GetMapping("/taller/{tallerId}")
    public List<ComentarioTaller> listarPorTaller(@PathVariable Long tallerId) {
        return comentarioTallerService.listarPorTaller(tallerId);
    }

    @GetMapping("/voluntario/{voluntarioId}/taller/{tallerId}")
    public ComentarioTaller buscarPorVoluntarioYTaller(
            @PathVariable Long voluntarioId,
            @PathVariable Long tallerId
    ) {
        return comentarioTallerService.buscarPorVoluntarioYTaller(voluntarioId, tallerId);
    }

    @PostMapping
    public ComentarioTaller crearComentario(@RequestBody ComentarioRequest request) {
        return comentarioTallerService.crearComentario(request);
    }

    @PutMapping("/{id}/estado")
    public ComentarioTaller cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        return comentarioTallerService.cambiarEstado(id, estado);
    }

    @PutMapping("/{id}/revisado")
    public ComentarioTaller marcarRevisado(@PathVariable Long id) {
        return comentarioTallerService.marcarRevisado(id);
    }

    @PutMapping("/{id}/visible")
    public ComentarioTaller cambiarVisibilidad(
            @PathVariable Long id,
            @RequestParam Boolean visible
    ) {
        return comentarioTallerService.cambiarVisibilidad(id, visible);
    }

    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioTallerService.eliminarComentario(id);
    }
}