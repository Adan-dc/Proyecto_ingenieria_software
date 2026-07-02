package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.RetiroInventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RetiroInventarioRepository extends JpaRepository<RetiroInventario, Long> {

    List<RetiroInventario> findAllByOrderByFechaRetiroDesc();
}
