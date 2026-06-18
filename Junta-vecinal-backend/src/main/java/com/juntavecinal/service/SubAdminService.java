package com.juntavecinal.service;

import com.juntavecinal.dto.LoginRequest;
import com.juntavecinal.dto.LoginResponse;
import com.juntavecinal.exception.ResourceNotFoundException;
import com.juntavecinal.model.SubAdmin;
import com.juntavecinal.repository.SubAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubAdminService {

    private final SubAdminRepository subAdminRepository;

    public SubAdmin crearSubAdmin(SubAdmin subAdmin) {

        if (subAdmin.getEstado() == null || subAdmin.getEstado().isBlank()) {
            subAdmin.setEstado("ACTIVO");
        }

        if (subAdmin.getPassword() == null || subAdmin.getPassword().isBlank()) {
            subAdmin.setPassword("123456");
        }

        return subAdminRepository.save(subAdmin);
    }

    public List<SubAdmin> listarSubAdmins() {
        return subAdminRepository.findAll();
    }

    public void eliminarSubAdmin(Long id) {
        SubAdmin subAdmin = subAdminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-Admin no encontrado con ID: " + id));

        subAdminRepository.delete(subAdmin);
    }

    public SubAdmin cambiarEstado(Long id, String estado) {
        SubAdmin subAdmin = subAdminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-Admin no encontrado con ID: " + id));

        subAdmin.setEstado(estado);

        return subAdminRepository.save(subAdmin);
    }

    public LoginResponse login(LoginRequest request) {

        if (request.getCorreo() == null || request.getCorreo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }

        String correo = request.getCorreo().trim();
        String password = request.getPassword().trim();

        /*
         * ADMIN PRINCIPAL FIJO
         * Esto te permite entrar aunque todavía no tengas sub-admins creados.
         */
        if (correo.equalsIgnoreCase("admin@juntavecinal.com") && password.equals("admin")) {
            return new LoginResponse(
                    0L,
                    "Administrador Principal",
                    "admin@juntavecinal.com",
                    "ADMIN",
                    "ACTIVO",
                    "ADMIN_PRINCIPAL"
            );
        }

        SubAdmin subAdmin = subAdminRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Correo o contraseña incorrectos"
                ));

        if (subAdmin.getEstado() != null && !subAdmin.getEstado().equalsIgnoreCase("ACTIVO")) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "La cuenta está inactiva"
            );
        }

        if (!subAdmin.getPassword().equals(password)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Correo o contraseña incorrectos"
            );
        }

        return new LoginResponse(
                subAdmin.getId(),
                subAdmin.getNombre(),
                subAdmin.getCorreo(),
                subAdmin.getRol(),
                subAdmin.getEstado(),
                "SUB_ADMIN"
        );
    }
    public SubAdmin actualizarSubAdmin(Long id, SubAdmin datos) {
        SubAdmin subAdmin = subAdminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sub-Admin no encontrado con ID: " + id));
    
        subAdmin.setNombre(datos.getNombre());
        subAdmin.setRut(datos.getRut());
        subAdmin.setCorreo(datos.getCorreo());
        subAdmin.setRol(datos.getRol());
        subAdmin.setEstado(datos.getEstado());
    
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            subAdmin.setPassword(datos.getPassword());
        }
    
        return subAdminRepository.save(subAdmin);
    }
}