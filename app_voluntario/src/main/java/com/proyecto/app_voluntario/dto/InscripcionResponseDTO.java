package com.proyecto.app_voluntario.dto;

public class InscripcionResponseDTO {

    private String mensaje;
    private Object tallerActualizado;

    public InscripcionResponseDTO() {
    }

    public InscripcionResponseDTO(String mensaje, Object tallerActualizado) {
        this.mensaje = mensaje;
        this.tallerActualizado = tallerActualizado;
    }

    public String getMensaje() {
        return mensaje;
    }

    public Object getTallerActualizado() {
        return tallerActualizado;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public void setTallerActualizado(Object tallerActualizado) {
        this.tallerActualizado = tallerActualizado;
    }
}