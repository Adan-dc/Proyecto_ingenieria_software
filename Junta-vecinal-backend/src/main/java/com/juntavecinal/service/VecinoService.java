package com.juntavecinal.service;

import com.juntavecinal.exception.ResourceNotFoundException;
import com.juntavecinal.model.Usuario;
import com.juntavecinal.model.Vecino;
import com.juntavecinal.repository.UsuarioRepository;
import com.juntavecinal.repository.VecinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VecinoService {

    private final VecinoRepository vecinoRepository;
    private final UsuarioRepository usuarioRepository;

    public Vecino registrarVecino(Vecino vecino) {
        if (vecino.getUsuario() != null && vecino.getUsuario().getId() != null) {
            Usuario usuario = usuarioRepository.findById(vecino.getUsuario().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + vecino.getUsuario().getId()));
            vecino.setUsuario(usuario);
        } else if (vecino.getUsuario() != null) {
            // Si el usuario no tiene ID, se crea uno nuevo (Cascade)
            vecino.getUsuario().setRol("VECINO");
            vecino.getUsuario().setActivo(true);
            vecino.getUsuario().setEstado("ACTIVO");
        }
        return vecinoRepository.save(vecino);
    }

    public List<Vecino> listarVecinos() {
        return vecinoRepository.findAll();
    }

    public void eliminarVecino(Long id) {
        Vecino vecino = vecinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vecino no encontrado con ID: " + id));
        vecinoRepository.delete(vecino);
    }

    public Vecino cambiarEstado(Long id, String estado) {
        Vecino vecino = vecinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vecino no encontrado con ID: " + id));
        if (vecino.getUsuario() != null) {
            vecino.getUsuario().setEstado(estado);
        }
        return vecinoRepository.save(vecino);
    }
}
