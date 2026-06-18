package com.donaciones.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donacion_eliminada")
public class DonacionEliminada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String articulo;

    private Integer cantidad;

    private Long idDonacionOriginal;

    @Column(length = 1000)
    private String motivoEliminacion;

    private LocalDateTime fechaEliminacion;

    public DonacionEliminada() {
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaEliminacion == null) {
            this.fechaEliminacion = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getArticulo() {
        return articulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Long getIdDonacionOriginal() {
        return idDonacionOriginal;
    }

    public String getMotivoEliminacion() {
        return motivoEliminacion;
    }

    public LocalDateTime getFechaEliminacion() {
        return fechaEliminacion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setArticulo(String articulo) {
        this.articulo = articulo;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setIdDonacionOriginal(Long idDonacionOriginal) {
        this.idDonacionOriginal = idDonacionOriginal;
    }

    public void setMotivoEliminacion(String motivoEliminacion) {
        this.motivoEliminacion = motivoEliminacion;
    }

    public void setFechaEliminacion(LocalDateTime fechaEliminacion) {
        this.fechaEliminacion = fechaEliminacion;
    }
}