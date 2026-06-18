package com.donaciones.gestion.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gestion_donacion")
public class GestionDonacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String objetoADonar;

    private Integer cantidad;

    @Column(length = 1000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private EstadoRevision estadoRevision;

    @Enumerated(EnumType.STRING)
    private EstadoEnvio estadoEnvio;

    @Enumerated(EnumType.STRING)
    private DestinoDonacion destino;

    private Long codigoTaller;

    private String nombreTaller;

    private String rutDonante;

    private String nombreDonante;

    private String telefonoDonante;

    private String correoDonante;

    private String direccionDonante;

    private String sectorDonante;

    private LocalDateTime fechaCreacion;

    public GestionDonacion() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();

        if (this.estadoRevision == null) {
            this.estadoRevision = EstadoRevision.PENDIENTE_REVISION;
        }

        if (this.estadoEnvio == null) {
            this.estadoEnvio = EstadoEnvio.EN_CAMINO;
        }

        if (this.destino == null) {
            this.destino = DestinoDonacion.TALLER;
        }
    }

    public Long getId() {
        return id;
    }

    public String getObjetoADonar() {
        return objetoADonar;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public EstadoRevision getEstadoRevision() {
        return estadoRevision;
    }

    public EstadoEnvio getEstadoEnvio() {
        return estadoEnvio;
    }

    public DestinoDonacion getDestino() {
        return destino;
    }

    public Long getCodigoTaller() {
        return codigoTaller;
    }

    public String getNombreTaller() {
        return nombreTaller;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setObjetoADonar(String objetoADonar) {
        this.objetoADonar = objetoADonar;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setEstadoRevision(EstadoRevision estadoRevision) {
        this.estadoRevision = estadoRevision;
    }

    public void setEstadoEnvio(EstadoEnvio estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }

    public void setDestino(DestinoDonacion destino) {
        this.destino = destino;
    }

    public void setCodigoTaller(Long codigoTaller) {
        this.codigoTaller = codigoTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
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

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}