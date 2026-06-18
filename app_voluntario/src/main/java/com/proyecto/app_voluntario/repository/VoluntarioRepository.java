package com.proyecto.app_voluntario.repository;

import com.proyecto.app_voluntario.model.Voluntario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoluntarioRepository extends JpaRepository<Voluntario, Long> {

    Optional<Voluntario> findByEmail(String email);

    Optional<Voluntario> findByRut(String rut);
}