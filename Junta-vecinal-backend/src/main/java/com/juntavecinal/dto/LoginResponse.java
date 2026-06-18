package com.juntavecinal.dto;

public class LoginResponse {

    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private String estado;
    private String tipo;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String nombre, String correo, String rol, String estado, String tipo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.estado = estado;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRol() {
        return rol;
    }

    public String getEstado() {
        return estado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}