package com.proyecto.app_voluntario.controller;

import com.proyecto.app_voluntario.dto.InscripcionRequestDTO;
import com.proyecto.app_voluntario.dto.InscripcionResponseDTO;
import com.proyecto.app_voluntario.dto.LoginRequest;
import com.proyecto.app_voluntario.model.InscripcionVoluntario;
import com.proyecto.app_voluntario.model.Voluntario;
import com.proyecto.app_voluntario.service.VoluntarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voluntarios")
@CrossOrigin(origins = "*")
public class VoluntarioController {

    private final VoluntarioService voluntarioService;

    public VoluntarioController(VoluntarioService voluntarioService) {
        this.voluntarioService = voluntarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<Voluntario> registrar(@RequestBody Voluntario voluntario) {
        return ResponseEntity.ok(voluntarioService.registrar(voluntario));
    }

    @PostMapping("/login")
    public ResponseEntity<Voluntario> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(
                voluntarioService.login(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
    }

    @PostMapping("/inscripciones/taller/{tallerId}")
    public ResponseEntity<InscripcionResponseDTO> inscribirseEnTaller(
            @PathVariable Long tallerId,
            @RequestBody InscripcionRequestDTO dto
    ) {
        return ResponseEntity.ok(voluntarioService.inscribirseEnTaller(tallerId, dto));
    }

    @GetMapping("/inscripciones/{rutVoluntario}")
    public ResponseEntity<List<InscripcionVoluntario>> listarMisInscripciones(
            @PathVariable String rutVoluntario
    ) {
        return ResponseEntity.ok(voluntarioService.listarMisInscripciones(rutVoluntario));
    }
}