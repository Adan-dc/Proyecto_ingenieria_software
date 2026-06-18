package com.juntavecinal.dto;

public class LoginRequest {

    private String correo;
    private String password;

    public LoginRequest() {
    }

    public String getCorreo() {
        return correo;
    }

    public String getPassword() {
        return password;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}