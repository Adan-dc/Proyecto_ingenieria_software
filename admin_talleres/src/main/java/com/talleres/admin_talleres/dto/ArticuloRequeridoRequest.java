package com.talleres.admin_talleres.dto;

public class ArticuloRequeridoRequest {

    private String nombre;
    private String descripcion;
    private Integer cantidadNecesaria;
    private String icono;

    public ArticuloRequeridoRequest() {
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getCantidadNecesaria() {
        return cantidadNecesaria;
    }

    public String getIcono() {
        return icono;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCantidadNecesaria(Integer cantidadNecesaria) {
        this.cantidadNecesaria = cantidadNecesaria;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }
}
