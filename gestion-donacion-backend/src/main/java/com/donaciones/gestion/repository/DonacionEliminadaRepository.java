package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.DonacionEliminada;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonacionEliminadaRepository extends JpaRepository<DonacionEliminada, Long> {
    List<DonacionEliminada> findAllByOrderByFechaEliminacionDesc();
}
