package com.juntavecinal.controller;

import com.juntavecinal.dto.ActualizarVecinoDTO;
import com.juntavecinal.service.SincronizacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sincronizacion")
@CrossOrigin(origins = "*")
public class SincronizacionController {

    private final SincronizacionService sincronizacionService;

    public SincronizacionController(SincronizacionService sincronizacionService) {
        this.sincronizacionService = sincronizacionService;
    }

    @PostMapping("/vecinos")
    public ResponseEntity<String> sincronizarVecinos() {
        return ResponseEntity.ok(sincronizacionService.sincronizarVoluntariosYDonantes());
    }

    @PutMapping("/vecinos/id/{id}")
    public ResponseEntity<String> actualizarVecinoSeparado(
            @PathVariable Long id,
            @RequestBody ActualizarVecinoDTO dto
    ) {
        return ResponseEntity.ok(sincronizacionService.actualizarVecinoSeparado(id, dto));
    }
}