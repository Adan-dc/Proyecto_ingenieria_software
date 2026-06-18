package com.talleres.admin_talleres.repository;

import com.talleres.admin_talleres.model.ComentarioTaller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComentarioTallerRepository extends JpaRepository<ComentarioTaller, Long> {

    List<ComentarioTaller> findByTaller_Id(Long tallerId);

    Optional<ComentarioTaller> findByVoluntarioIdAndTaller_Id(Long voluntarioId, Long tallerId);
}