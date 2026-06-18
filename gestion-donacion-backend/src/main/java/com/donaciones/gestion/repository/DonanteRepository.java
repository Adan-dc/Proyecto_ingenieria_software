package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.Donante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonanteRepository extends JpaRepository<Donante, String> {
    // La PK es el RUT (String), por lo que findById(rut) es suficiente.
}
