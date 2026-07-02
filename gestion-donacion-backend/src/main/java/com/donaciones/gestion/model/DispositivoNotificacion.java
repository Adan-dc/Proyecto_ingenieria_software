package com.donaciones.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dispositivo_notificacion")
public class DispositivoNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rutDonante;

    @Column(length = 1000, unique = true)
    private String tokenFcm;

    private Boolean activo;

    private LocalDateTime fechaRegistro;

    private LocalDateTime fechaActualizacion;

    public DispositivoNotificacion() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();

        if (this.activo == null) {
            this.activo = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public String getTokenFcm() {
        return tokenFcm;
    }

    public Boolean getActivo() {
        return activo;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public void setTokenFcm(String tokenFcm) {
        this.tokenFcm = tokenFcm;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}
