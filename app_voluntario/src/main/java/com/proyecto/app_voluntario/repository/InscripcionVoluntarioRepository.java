package com.proyecto.app_voluntario.repository;

import com.proyecto.app_voluntario.model.InscripcionVoluntario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InscripcionVoluntarioRepository extends JpaRepository<InscripcionVoluntario, Long> {

    boolean existsByRutVoluntarioAndIdTaller(String rutVoluntario, Long idTaller);

    List<InscripcionVoluntario> findByRutVoluntarioOrderByFechaInscripcionDesc(String rutVoluntario);
}