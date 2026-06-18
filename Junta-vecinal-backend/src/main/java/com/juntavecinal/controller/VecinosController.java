package com.juntavecinal.controller;

import com.juntavecinal.model.Vecino;
import com.juntavecinal.service.VecinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vecinos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VecinosController {

    private final VecinoService vecinoService;

    @PostMapping("/registrar")
    public ResponseEntity<Vecino> registrarVecino(@RequestBody Vecino vecino) {
        Vecino nuevoVecino = vecinoService.registrarVecino(vecino);
        return new ResponseEntity<>(nuevoVecino, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Vecino>> listarVecinos() {
        return ResponseEntity.ok(vecinoService.listarVecinos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVecino(@PathVariable Long id) {
        vecinoService.eliminarVecino(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Vecino> cambiarEstadoVecino(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(vecinoService.cambiarEstado(id, estado));
    }
}
