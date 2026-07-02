package com.donaciones.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "retiro_inventario")
public class RetiroInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idInventarioOriginal;

    private String articulo;

    private Integer cantidad;

    private String rutDonante;

    private String nombreDonante;

    private Long codigoTaller;

    private String nombreTaller;

    private String retiradoPor;

    private String destinoRetiro;

    @Column(length = 1000)
    private String justificacionRetiro;

    private LocalDateTime fechaRetiro;

    public RetiroInventario() {
    }

    @PrePersist
    public void prePersist() {
        if (this.fechaRetiro == null) {
            this.fechaRetiro = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Long getIdInventarioOriginal() {
        return idInventarioOriginal;
    }

    public String getArticulo() {
        return articulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public String getNombreDonante() {
        return nombreDonante;
    }

    public Long getCodigoTaller() {
        return codigoTaller;
    }

    public String getNombreTaller() {
        return nombreTaller;
    }

    public String getRetiradoPor() {
        return retiradoPor;
    }

    public String getDestinoRetiro() {
        return destinoRetiro;
    }

    public String getJustificacionRetiro() {
        return justificacionRetiro;
    }

    public LocalDateTime getFechaRetiro() {
        return fechaRetiro;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setIdInventarioOriginal(Long idInventarioOriginal) {
        this.idInventarioOriginal = idInventarioOriginal;
    }

    public void setArticulo(String articulo) {
        this.articulo = articulo;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public void setNombreDonante(String nombreDonante) {
        this.nombreDonante = nombreDonante;
    }

    public void setCodigoTaller(Long codigoTaller) {
        this.codigoTaller = codigoTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
    }

    public void setRetiradoPor(String retiradoPor) {
        this.retiradoPor = retiradoPor;
    }

    public void setDestinoRetiro(String destinoRetiro) {
        this.destinoRetiro = destinoRetiro;
    }

    public void setJustificacionRetiro(String justificacionRetiro) {
        this.justificacionRetiro = justificacionRetiro;
    }

    public void setFechaRetiro(LocalDateTime fechaRetiro) {
        this.fechaRetiro = fechaRetiro;
    }
}
