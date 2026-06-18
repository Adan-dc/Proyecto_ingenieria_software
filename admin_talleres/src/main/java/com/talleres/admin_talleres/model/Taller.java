package com.talleres.admin_talleres.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Taller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String etiqueta;

    @Column(length = 1000)
    private String descripcion;

    private String profesor;

    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private String lugar;
    private String direccion;

    private Integer cuposTotales;
    private Integer cuposOcupados;

    private String imagenUrl;
    private String imagenClase;

    private String estado;

    public Taller() {
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEtiqueta() {
        return etiqueta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getProfesor() {
        return profesor;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public String getLugar() {
        return lugar;
    }

    public String getDireccion() {
        return direccion;
    }

    public Integer getCuposTotales() {
        return cuposTotales;
    }

    public Integer getCuposOcupados() {
        return cuposOcupados;
    }

    @Transient
    public Integer getCuposDisponibles() {
        int totales = cuposTotales == null ? 0 : cuposTotales;
        int ocupados = cuposOcupados == null ? 0 : cuposOcupados;

        int disponibles = totales - ocupados;

        return Math.max(disponibles, 0);
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public String getImagenClase() {
        return imagenClase;
    }

    public String getEstado() {
        return estado;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEtiqueta(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setProfesor(String profesor) {
        this.profesor = profesor;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public void setCuposTotales(Integer cuposTotales) {
        this.cuposTotales = cuposTotales;
    }

    public void setCuposOcupados(Integer cuposOcupados) {
        this.cuposOcupados = cuposOcupados;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public void setImagenClase(String imagenClase) {
        this.imagenClase = imagenClase;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}