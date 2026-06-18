package com.donaciones.gestion.controller;

import com.donaciones.gestion.dto.*;
import com.donaciones.gestion.model.DestinoDonacion;
import com.donaciones.gestion.model.DonacionEliminada;
import com.donaciones.gestion.model.EstadoEnvio;
import com.donaciones.gestion.model.GestionDonacion;
import com.donaciones.gestion.model.Talleres;
import com.donaciones.gestion.service.DonacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gestion")
public class DonacionController {

    @Autowired
    private DonacionService donacionService;

    // ----- SOLICITUDES -----

    @PostMapping("/solicitudes")
    public ResponseEntity<GestionDonacion> crearSolicitud(@Valid @RequestBody DonacionRequestDTO dto) {
        return ResponseEntity.ok(donacionService.crearSolicitudDonacion(dto));
    }

    @PostMapping("/apk")
    public ResponseEntity<GestionDonacion> recibirApk(@Valid @RequestBody ApkRequestDTO dto) {
        return ResponseEntity.ok(donacionService.recibirDonacionApk(dto));
    }

    @GetMapping("/solicitudes")
    public ResponseEntity<List<GestionDonacion>> listarSolicitudes() {
        return ResponseEntity.ok(donacionService.listarSolicitudesPendientes());
    }

    @PostMapping("/{id}/revision")
    public ResponseEntity<GestionDonacion> procesarRevision(@PathVariable Long id, @Valid @RequestBody RevisionDTO dto) {
        return ResponseEntity.ok(donacionService.procesarRevision(id, dto));
    }

    // ----- INVENTARIO / ACEPTADAS -----

    @GetMapping("/inventario")
    public ResponseEntity<List<GestionDonacion>> listarInventario() {
        return ResponseEntity.ok(donacionService.listarDonacionesAceptadas());
    }

    @PostMapping("/inventario")
    public ResponseEntity<GestionDonacion> ingresoManual(
            @Valid @RequestBody DonacionRequestDTO dto,
            @RequestParam DestinoDonacion destino,
            @RequestParam EstadoEnvio estadoEnvio,
            @RequestParam(required = false) Long codigoTaller) {
        return ResponseEntity.ok(donacionService.ingresoManualInventario(dto, destino, estadoEnvio, codigoTaller));
    }

    @PutMapping("/{id}/inventario")
    public ResponseEntity<GestionDonacion> editarInventario(@PathVariable Long id, @Valid @RequestBody EdicionInventarioDTO dto) {
        return ResponseEntity.ok(donacionService.editarInventario(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDonacion(@PathVariable Long id, @Valid @RequestBody EliminacionDTO dto) {
        donacionService.eliminarDonacion(id, dto);
        return ResponseEntity.noContent().build();
    }

    // ----- HISTORIAL -----

    @GetMapping("/historial")
    public ResponseEntity<List<DonacionEliminada>> listarHistorial() {
        return ResponseEntity.ok(donacionService.listarHistorialEliminadas());
    }

    // ----- TALLERES -----

    @GetMapping("/talleres")
    public ResponseEntity<List<Talleres>> listarTalleres() {
        return ResponseEntity.ok(donacionService.listarTalleres());
    }
}
