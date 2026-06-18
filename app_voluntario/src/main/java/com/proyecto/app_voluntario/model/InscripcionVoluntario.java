package com.proyecto.app_voluntario.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "inscripcion_voluntario",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"rutVoluntario", "idTaller"})
    }
)
public class InscripcionVoluntario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rutVoluntario;

    private Long idTaller;

    private String nombreTaller;

    private LocalDateTime fechaInscripcion;

    public InscripcionVoluntario() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaInscripcion = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getRutVoluntario() {
        return rutVoluntario;
    }

    public Long getIdTaller() {
        return idTaller;
    }

    public String getNombreTaller() {
        return nombreTaller;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRutVoluntario(String rutVoluntario) {
        this.rutVoluntario = rutVoluntario;
    }

    public void setIdTaller(Long idTaller) {
        this.idTaller = idTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }
}