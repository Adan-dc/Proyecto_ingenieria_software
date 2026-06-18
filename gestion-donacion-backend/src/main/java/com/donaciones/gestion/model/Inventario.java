package com.donaciones.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rutDonante;

    private String nombreDonante;

    private String telefonoDonante;

    private String correoDonante;

    private String direccionDonante;

    private String sectorDonante;

    @Column(name = "objeto")
    private String articulo;

    private Integer cantidad;

    @Column(length = 1000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private EstadoEnvio estadoEnvio;

    private Long codigoTaller;

    private String nombreTaller;

    private LocalDateTime fechaIngreso;

    public Inventario() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaIngreso = LocalDateTime.now();

        if (this.estadoEnvio == null) {
            this.estadoEnvio = EstadoEnvio.LLEGO;
        }
    }

    public Long getId() {
        return id;
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public String getNombreDonante() {
        return nombreDonante;
    }

    public String getTelefonoDonante() {
        return telefonoDonante;
    }

    public String getCorreoDonante() {
        return correoDonante;
    }

    public String getDireccionDonante() {
        return direccionDonante;
    }

    public String getSectorDonante() {
        return sectorDonante;
    }

    public String getArticulo() {
        return articulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public EstadoEnvio getEstadoEnvio() {
        return estadoEnvio;
    }

    public Long getCodigoTaller() {
        return codigoTaller;
    }

    public String getNombreTaller() {
        return nombreTaller;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public void setNombreDonante(String nombreDonante) {
        this.nombreDonante = nombreDonante;
    }

    public void setTelefonoDonante(String telefonoDonante) {
        this.telefonoDonante = telefonoDonante;
    }

    public void setCorreoDonante(String correoDonante) {
        this.correoDonante = correoDonante;
    }

    public void setDireccionDonante(String direccionDonante) {
        this.direccionDonante = direccionDonante;
    }

    public void setSectorDonante(String sectorDonante) {
        this.sectorDonante = sectorDonante;
    }

    public void setArticulo(String articulo) {
        this.articulo = articulo;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setEstadoEnvio(EstadoEnvio estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }

    public void setCodigoTaller(Long codigoTaller) {
        this.codigoTaller = codigoTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}