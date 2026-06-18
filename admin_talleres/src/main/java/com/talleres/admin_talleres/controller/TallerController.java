package com.talleres.admin_talleres.controller;

import com.talleres.admin_talleres.dto.TallerConArticulosRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.talleres.admin_talleres.model.Taller;
import com.talleres.admin_talleres.service.TallerService;
import java.util.List;

@RestController
@RequestMapping("/api/talleres")
@CrossOrigin(origins = "*")
public class TallerController {

    private final TallerService tallerService;

    public TallerController(TallerService tallerService) {
        this.tallerService = tallerService;
    }

    @GetMapping
    public List<Taller> listarTalleres() {
        return tallerService.listarTalleres();
    }

    @GetMapping("/{id}")
    public Taller buscarPorId(@PathVariable Long id) {
        return tallerService.buscarPorId(id);
    }

    @PostMapping("/con-articulos")
    public Taller crearTallerConArticulos(@RequestBody TallerConArticulosRequest request) {
        return tallerService.crearTallerConArticulos(request);
    }

    @PostMapping
    public Taller crearTaller(@RequestBody Taller taller) {
        return tallerService.crearTaller(taller);
    }

    @PutMapping("/{id}")
    public Taller actualizarTaller(@PathVariable Long id, @RequestBody Taller taller) {
        return tallerService.actualizarTaller(id, taller);
    }

    @DeleteMapping("/{id}")
    public void eliminarTaller(@PathVariable Long id) {
        tallerService.eliminarTaller(id);
    }

    @PostMapping("/{id}/inscribirse")
    public ResponseEntity<Taller> inscribirse(@PathVariable Long id) {
        return ResponseEntity.ok(tallerService.inscribirVoluntario(id));
    }
}
