package com.donaciones.gestion.dto;

public class EdicionInventarioDTO {

    private Integer cantidad;
    private String estadoEnvio;

    public EdicionInventarioDTO() {
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getEstadoEnvio() {
        return estadoEnvio;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setEstadoEnvio(String estadoEnvio) {
        this.estadoEnvio = estadoEnvio;
    }
}
