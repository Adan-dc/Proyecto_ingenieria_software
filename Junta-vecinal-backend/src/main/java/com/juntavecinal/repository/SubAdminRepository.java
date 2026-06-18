package com.juntavecinal.repository;

import com.juntavecinal.model.SubAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubAdminRepository extends JpaRepository<SubAdmin, Long> {
    Optional<SubAdmin> findByCorreo(String correo);
}
