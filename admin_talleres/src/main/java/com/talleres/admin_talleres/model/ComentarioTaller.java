package com.talleres.admin_talleres.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ComentarioTaller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String comentario;

    private LocalDateTime fechaComentario;

    private LocalDateTime fechaActualizacion;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "taller_id")
    private Taller taller;

    private Long voluntarioId;

    private String nombreVoluntario;

    private String emailVoluntario;

    public ComentarioTaller() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaComentario = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();

        if (this.estado == null) {
            this.estado = "VISIBLE";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getComentario() {
        return comentario;
    }

    public LocalDateTime getFechaComentario() {
        return fechaComentario;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public String getEstado() {
        return estado;
    }

    public Taller getTaller() {
        return taller;
    }

    public Long getVoluntarioId() {
        return voluntarioId;
    }

    public String getNombreVoluntario() {
        return nombreVoluntario;
    }

    public String getEmailVoluntario() {
        return emailVoluntario;
    }

    public Long getTallerId() {
        return taller != null ? taller.getId() : null;
    }

    public String getTallerNombre() {
        return taller != null ? taller.getNombre() : null;
    }

    public Boolean getVisible() {
        return !"OCULTO".equalsIgnoreCase(estado);
    }

    public Boolean getRevisado() {
        return "REVISADO".equalsIgnoreCase(estado);
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public void setFechaComentario(LocalDateTime fechaComentario) {
        this.fechaComentario = fechaComentario;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public void setVoluntarioId(Long voluntarioId) {
        this.voluntarioId = voluntarioId;
    }

    public void setNombreVoluntario(String nombreVoluntario) {
        this.nombreVoluntario = nombreVoluntario;
    }

    public void setEmailVoluntario(String emailVoluntario) {
        this.emailVoluntario = emailVoluntario;
    }
}