package com.talleres.admin_talleres.dto;

public class RecepcionArticuloRequest {

    private String nombreArticulo;
    private Integer cantidad;

    public RecepcionArticuloRequest() {
    }

    public String getNombreArticulo() {
        return nombreArticulo;
    }

    public void setNombreArticulo(String nombreArticulo) {
        this.nombreArticulo = nombreArticulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}