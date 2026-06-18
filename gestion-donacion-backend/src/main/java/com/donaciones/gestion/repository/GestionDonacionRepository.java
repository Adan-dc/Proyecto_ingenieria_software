package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.EstadoRevision;
import com.donaciones.gestion.model.GestionDonacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GestionDonacionRepository extends JpaRepository<GestionDonacion, Long> {
    List<GestionDonacion> findByEstadoRevision(EstadoRevision estadoRevision);
}
