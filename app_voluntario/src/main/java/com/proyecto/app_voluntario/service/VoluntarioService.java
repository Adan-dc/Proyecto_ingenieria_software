package com.proyecto.app_voluntario.service;

import com.proyecto.app_voluntario.dto.InscripcionRequestDTO;
import com.proyecto.app_voluntario.dto.InscripcionResponseDTO;
import com.proyecto.app_voluntario.model.InscripcionVoluntario;
import com.proyecto.app_voluntario.model.Voluntario;
import com.proyecto.app_voluntario.repository.InscripcionVoluntarioRepository;
import com.proyecto.app_voluntario.repository.VoluntarioRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class VoluntarioService {

    private final VoluntarioRepository voluntarioRepository;
    private final InscripcionVoluntarioRepository inscripcionVoluntarioRepository;
    private final RestTemplate restTemplate;

    @Value("${admin.talleres.url}")
    private String adminTalleresUrl;

    public VoluntarioService(
            VoluntarioRepository voluntarioRepository,
            InscripcionVoluntarioRepository inscripcionVoluntarioRepository
    ) {
        this.voluntarioRepository = voluntarioRepository;
        this.inscripcionVoluntarioRepository = inscripcionVoluntarioRepository;
        this.restTemplate = new RestTemplate();
    }

    public Voluntario registrar(Voluntario voluntario) {

        if (voluntario.getEmail() == null || voluntario.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email es obligatorio");
        }

        if (voluntario.getPassword() == null || voluntario.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }

        if (voluntarioRepository.findByEmail(voluntario.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo ya está registrado");
        }

        if (voluntario.getRut() != null && !voluntario.getRut().isBlank()) {
            if (voluntarioRepository.findByRut(voluntario.getRut()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El RUT ya está registrado");
            }
        }

        return voluntarioRepository.save(voluntario);
    }

    public Voluntario login(String email, String password) {

        Voluntario voluntario = voluntarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Correo o contraseña incorrectos"
                ));

        if (!voluntario.getPassword().equals(password)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Correo o contraseña incorrectos"
            );
        }

        return voluntario;
    }

    @Transactional
    public InscripcionResponseDTO inscribirseEnTaller(Long tallerId, InscripcionRequestDTO dto) {

        if (tallerId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del taller es obligatorio");
        }

        if (dto == null || dto.getRutVoluntario() == null || dto.getRutVoluntario().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El RUT del voluntario es obligatorio");
        }

        String rutVoluntario = dto.getRutVoluntario().trim();

        voluntarioRepository.findByRut(rutVoluntario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Voluntario no encontrado"
                ));

        boolean yaInscritoEnEsteTaller =
                inscripcionVoluntarioRepository.existsByRutVoluntarioAndIdTaller(rutVoluntario, tallerId);

        if (yaInscritoEnEsteTaller) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya estás inscrito en este taller"
            );
        }

        Object tallerActualizado;

        try {
            String url = adminTalleresUrl + "/" + tallerId + "/inscribirse";

            tallerActualizado = restTemplate.postForObject(url, null, Object.class);

        } catch (HttpStatusCodeException error) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se pudo realizar la inscripción. Puede que no queden cupos disponibles."
            );
        } catch (Exception error) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se pudo conectar con el backend administrador de talleres."
            );
        }

        InscripcionVoluntario inscripcion = new InscripcionVoluntario();
        inscripcion.setRutVoluntario(rutVoluntario);
        inscripcion.setIdTaller(tallerId);
        inscripcion.setNombreTaller(dto.getNombreTaller());

        inscripcionVoluntarioRepository.save(inscripcion);

        return new InscripcionResponseDTO(
                "Inscripción confirmada",
                tallerActualizado
        );
    }

    public List<InscripcionVoluntario> listarMisInscripciones(String rutVoluntario) {
        return inscripcionVoluntarioRepository.findByRutVoluntarioOrderByFechaInscripcionDesc(rutVoluntario);
    }
}