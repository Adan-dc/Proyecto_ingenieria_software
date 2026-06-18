package com.talleres.admin_talleres.service;

import com.talleres.admin_talleres.dto.ComentarioRequest;
import com.talleres.admin_talleres.model.ComentarioTaller;
import com.talleres.admin_talleres.model.Taller;
import com.talleres.admin_talleres.repository.ComentarioTallerRepository;
import com.talleres.admin_talleres.repository.TallerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ComentarioTallerService {

    private final ComentarioTallerRepository comentarioTallerRepository;
    private final TallerRepository tallerRepository;

    public ComentarioTallerService(
            ComentarioTallerRepository comentarioTallerRepository,
            TallerRepository tallerRepository
    ) {
        this.comentarioTallerRepository = comentarioTallerRepository;
        this.tallerRepository = tallerRepository;
    }

    public List<ComentarioTaller> listarComentarios() {
        return comentarioTallerRepository.findAll();
    }

    public List<ComentarioTaller> listarPorTaller(Long tallerId) {
        return comentarioTallerRepository.findByTaller_Id(tallerId);
    }

    public ComentarioTaller buscarPorId(Long id) {
        return comentarioTallerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Comentario no encontrado"
                ));
    }

    public ComentarioTaller buscarPorVoluntarioYTaller(Long voluntarioId, Long tallerId) {
        return comentarioTallerRepository.findByVoluntarioIdAndTaller_Id(voluntarioId, tallerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Comentario no encontrado"
                ));
    }

    public ComentarioTaller crearComentario(ComentarioRequest request) {

        if (request.getTallerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tallerId es obligatorio");
        }

        if (request.getVoluntarioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El voluntarioId es obligatorio");
        }

        if (request.getComentario() == null || request.getComentario().trim().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El comentario es obligatorio");
        }

        boolean yaExiste = comentarioTallerRepository
                .findByVoluntarioIdAndTaller_Id(request.getVoluntarioId(), request.getTallerId())
                .isPresent();

        if (yaExiste) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este voluntario ya comentó este taller"
            );
        }

        Taller taller = tallerRepository.findById(request.getTallerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Taller no encontrado"
                ));

        ComentarioTaller comentarioTaller = new ComentarioTaller();

        comentarioTaller.setTaller(taller);
        comentarioTaller.setVoluntarioId(request.getVoluntarioId());
        comentarioTaller.setNombreVoluntario(request.getNombreVoluntario());
        comentarioTaller.setEmailVoluntario(request.getEmailVoluntario());
        comentarioTaller.setComentario(request.getComentario().trim());
        comentarioTaller.setEstado("VISIBLE");

        return comentarioTallerRepository.save(comentarioTaller);
    }

    public ComentarioTaller cambiarEstado(Long id, String estado) {
        ComentarioTaller comentario = buscarPorId(id);
        comentario.setEstado(estado);
        return comentarioTallerRepository.save(comentario);
    }

    public ComentarioTaller marcarRevisado(Long id) {
        ComentarioTaller comentario = buscarPorId(id);
        comentario.setEstado("REVISADO");
        return comentarioTallerRepository.save(comentario);
    }

    public ComentarioTaller cambiarVisibilidad(Long id, Boolean visible) {
        ComentarioTaller comentario = buscarPorId(id);
        comentario.setEstado(Boolean.TRUE.equals(visible) ? "VISIBLE" : "OCULTO");
        return comentarioTallerRepository.save(comentario);
    }

    public void eliminarComentario(Long id) {
        comentarioTallerRepository.deleteById(id);
    }
}