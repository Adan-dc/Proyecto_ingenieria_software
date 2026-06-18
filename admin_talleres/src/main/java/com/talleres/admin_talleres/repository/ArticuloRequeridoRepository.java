package com.talleres.admin_talleres.repository;

import com.talleres.admin_talleres.model.ArticuloRequerido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticuloRequeridoRepository extends JpaRepository<ArticuloRequerido, Long> {

    List<ArticuloRequerido> findByTallerId(Long tallerId);

    void deleteByTaller_Id(Long tallerId);

    Optional<ArticuloRequerido> findByTallerIdAndNombreIgnoreCase(Long tallerId, String nombre);
}