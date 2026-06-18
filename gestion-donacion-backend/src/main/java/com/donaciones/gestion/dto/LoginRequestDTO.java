package com.donaciones.gestion.dto;

public class LoginRequestDTO {

    private String nombreUsuario;
    private String clave;

    public LoginRequestDTO() {
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getClave() {
        return clave;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }
}