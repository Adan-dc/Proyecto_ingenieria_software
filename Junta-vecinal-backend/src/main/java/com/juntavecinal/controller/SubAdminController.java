package com.juntavecinal.controller;

import com.juntavecinal.dto.LoginRequest;
import com.juntavecinal.dto.LoginResponse;
import com.juntavecinal.model.SubAdmin;
import com.juntavecinal.service.SubAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subadmins")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubAdminController {

    private final SubAdminService subAdminService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(subAdminService.login(request));
    }

    @PostMapping("/crear")
    public ResponseEntity<SubAdmin> crearSubAdmin(@RequestBody SubAdmin subAdmin) {
        SubAdmin nuevoSubAdmin = subAdminService.crearSubAdmin(subAdmin);
        return new ResponseEntity<>(nuevoSubAdmin, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubAdmin>> listarSubAdmins() {
        return ResponseEntity.ok(subAdminService.listarSubAdmins());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSubAdmin(@PathVariable Long id) {
        subAdminService.eliminarSubAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<SubAdmin> cambiarEstadoSubAdmin(
            @PathVariable Long id,
            @RequestParam String estado
    ) {
        return ResponseEntity.ok(subAdminService.cambiarEstado(id, estado));
    }
    @PutMapping("/{id}")
    public ResponseEntity<SubAdmin> actualizarSubAdmin(
            @PathVariable Long id,
            @RequestBody SubAdmin subAdmin
    ) {
        return ResponseEntity.ok(subAdminService.actualizarSubAdmin(id, subAdmin));
    }
}