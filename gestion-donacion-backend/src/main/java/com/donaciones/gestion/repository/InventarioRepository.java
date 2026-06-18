package com.donaciones.gestion.repository;

import com.donaciones.gestion.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
}
