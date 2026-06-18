package com.donaciones.gestion.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.donaciones.gestion.model.Donante;

import java.util.Optional;

public interface DonanteRepository extends JpaRepository<Donante, String> {

    Optional<Donante> findByRut(String rut);
}
