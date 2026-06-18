package com.proyecto.app_voluntario.dto;

public class InscripcionRequestDTO {

    private String rutVoluntario;
    private String nombreTaller;

    public InscripcionRequestDTO() {
    }

    public String getRutVoluntario() {
        return rutVoluntario;
    }

    public void setRutVoluntario(String rutVoluntario) {
        this.rutVoluntario = rutVoluntario;
    }

    public String getNombreTaller() {
        return nombreTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
    }
}