package com.donaciones.gestion.controller;

import com.donaciones.gestion.dto.LoginRequestDTO;
import com.donaciones.gestion.model.Usuario;
import com.donaciones.gestion.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/gestion")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Optional<Usuario> usuario = usuarioRepository.findByNombreUsuarioAndClave(
            loginRequest.getNombreUsuario(), 
            loginRequest.getClave()
        );

        if (usuario.isPresent()) {
            return ResponseEntity.ok().body("{\"message\": \"Login exitoso\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("{\"message\": \"Usuario o contraseña incorrectos\"}");
        }
    }
}
