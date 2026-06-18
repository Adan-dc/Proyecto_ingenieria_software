package com.juntavecinal.repository;

import com.juntavecinal.model.Vecino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VecinoRepository extends JpaRepository<Vecino, Long> {

    Optional<Vecino> findByRut(String rut);

    Optional<Vecino> findByTipoOrigenAndIdOrigen(String tipoOrigen, Long idOrigen);
}