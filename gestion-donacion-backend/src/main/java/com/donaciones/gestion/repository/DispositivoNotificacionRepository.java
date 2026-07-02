package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.DispositivoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DispositivoNotificacionRepository extends JpaRepository<DispositivoNotificacion, Long> {

    Optional<DispositivoNotificacion> findByTokenFcm(String tokenFcm);

    List<DispositivoNotificacion> findByRutDonanteAndActivoTrue(String rutDonante);
}
