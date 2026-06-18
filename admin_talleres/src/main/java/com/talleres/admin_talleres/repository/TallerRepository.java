package com.talleres.admin_talleres.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.talleres.admin_talleres.model.Taller;

public interface TallerRepository extends JpaRepository<Taller, Long> {
}
