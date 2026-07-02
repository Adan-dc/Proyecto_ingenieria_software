package com.donaciones.gestion.controller;

import com.donaciones.gestion.dto.AcopioDTO;
import com.donaciones.gestion.dto.ApkRequestDTO;
import com.donaciones.gestion.dto.EliminacionInventarioDTO;
import com.donaciones.gestion.dto.NotificacionTokenDTO;
import com.donaciones.gestion.dto.RevisionDTO;
import com.donaciones.gestion.dto.RetiroInventarioDTO;
import com.donaciones.gestion.dto.VecinoRegistroDTO;

import com.donaciones.gestion.model.DispositivoNotificacion;
import com.donaciones.gestion.model.DonacionEliminada;
import com.donaciones.gestion.model.Donante;
import com.donaciones.gestion.model.GestionDonacion;
import com.donaciones.gestion.model.Inventario;
import com.donaciones.gestion.model.RetiroInventario;

import com.donaciones.gestion.service.DonacionService;
import com.donaciones.gestion.service.NotificacionPushService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gestion")
@CrossOrigin(origins = "*")
public class DonacionController {

    private final DonacionService donacionService;
    private final NotificacionPushService notificacionPushService;

    public DonacionController(
            DonacionService donacionService,
            NotificacionPushService notificacionPushService
    ) {
        this.donacionService = donacionService;
        this.notificacionPushService = notificacionPushService;
    }

    @PostMapping("/vecinos/registro")
    public ResponseEntity<Donante> registrarVecino(@RequestBody VecinoRegistroDTO dto) {
        return ResponseEntity.ok(donacionService.registrarVecino(dto));
    }

    @GetMapping("/vecinos/{rut}")
    public ResponseEntity<Donante> buscarVecinoPorRut(@PathVariable String rut) {
        return ResponseEntity.ok(donacionService.buscarVecinoPorRut(rut));
    }

    @PostMapping("/notificaciones/token")
    public ResponseEntity<DispositivoNotificacion> registrarTokenNotificacion(
            @RequestBody NotificacionTokenDTO dto
    ) {
        return ResponseEntity.ok(notificacionPushService.registrarToken(dto));
    }

    @PostMapping("/apk/donacion")
    public ResponseEntity<GestionDonacion> recibirDonacionDesdeApk(@RequestBody ApkRequestDTO dto) {
        return ResponseEntity.ok(donacionService.recibirDonacionApk(dto));
    }

    @PostMapping("/apk")
    public ResponseEntity<GestionDonacion> recibirApkAntiguo(@RequestBody ApkRequestDTO dto) {
        return ResponseEntity.ok(donacionService.recibirDonacionApk(dto));
    }

    @GetMapping("/apk/mis-solicitudes/{rut}")
    public ResponseEntity<List<GestionDonacion>> listarMisSolicitudes(@PathVariable String rut) {
        return ResponseEntity.ok(donacionService.listarMisSolicitudes(rut));
    }

    @GetMapping("/solicitudes")
    public ResponseEntity<List<GestionDonacion>> listarSolicitudesPendientes() {
        return ResponseEntity.ok(donacionService.listarSolicitudesPendientes());
    }

    @PostMapping("/{id}/revision")
    public ResponseEntity<GestionDonacion> procesarRevision(
            @PathVariable Long id,
            @RequestBody RevisionDTO dto
    ) {
        return ResponseEntity.ok(donacionService.procesarRevision(id, dto));
    }

    @GetMapping("/acopio/pendientes")
    public ResponseEntity<List<GestionDonacion>> listarPendientesAcopio() {
        return ResponseEntity.ok(donacionService.listarPendientesAcopio());
    }

    @PostMapping("/{id}/acopio")
    public ResponseEntity<GestionDonacion> confirmarAcopio(
            @PathVariable Long id,
            @RequestBody AcopioDTO dto
    ) {
        return ResponseEntity.ok(donacionService.confirmarAcopio(id, dto));
    }

    @PostMapping("/inventario")
    public ResponseEntity<Inventario> crearDonacionManualInventario(@RequestBody ApkRequestDTO dto) {
        return ResponseEntity.ok(donacionService.crearDonacionManualInventario(dto));
    }

    @GetMapping("/inventario")
    public ResponseEntity<List<Inventario>> listarInventario() {
        return ResponseEntity.ok(donacionService.listarInventario());
    }


    @PostMapping("/inventario/{id}/retiro")
    public ResponseEntity<RetiroInventario> retirarInventario(
            @PathVariable Long id,
            @RequestBody RetiroInventarioDTO dto
    ) {
        return ResponseEntity.ok(donacionService.retirarInventario(id, dto));
    }

    @GetMapping("/inventario/retiros")
    public ResponseEntity<List<RetiroInventario>> listarRetirosInventario() {
        return ResponseEntity.ok(donacionService.listarRetirosInventario());
    }

    @DeleteMapping("/inventario/{id}")
    public ResponseEntity<Void> eliminarInventario(
            @PathVariable Long id,
            @RequestBody EliminacionInventarioDTO dto
    ) {
        donacionService.eliminarInventario(id, dto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/historial")
    public ResponseEntity<List<DonacionEliminada>> listarHistorialEliminadas() {
        return ResponseEntity.ok(donacionService.listarHistorialEliminadas());
    }
}