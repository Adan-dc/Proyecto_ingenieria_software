package com.talleres.admin_talleres.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class TallerConArticulosRequest {

    private String nombre;
    private String etiqueta;
    private String descripcion;
    private String profesor;

    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private String lugar;
    private String direccion;

    private Integer cuposTotales;
    private String imagenUrl;
    private String imagenClase;
    private String estado;

    private List<ArticuloRequeridoRequest> articulos;

    public TallerConArticulosRequest() {
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

    public String getImagenUrl() {
        return imagenUrl;
    }

    public String getImagenClase() {
        return imagenClase;
    }

    public String getEstado() {
        return estado;
    }

    public List<ArticuloRequeridoRequest> getArticulos() {
        return articulos;
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

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public void setImagenClase(String imagenClase) {
        this.imagenClase = imagenClase;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setArticulos(List<ArticuloRequeridoRequest> articulos) {
        this.articulos = articulos;
    }
}
