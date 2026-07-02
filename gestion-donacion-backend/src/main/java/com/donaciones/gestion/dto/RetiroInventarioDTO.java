package com.donaciones.gestion.dto;

public class RetiroInventarioDTO {

    private String retiradoPor;
    private String destinoRetiro;
    private String justificacionRetiro;

    public RetiroInventarioDTO() {
    }

    public String getRetiradoPor() {
        return retiradoPor;
    }

    public void setRetiradoPor(String retiradoPor) {
        this.retiradoPor = retiradoPor;
    }

    public String getDestinoRetiro() {
        return destinoRetiro;
    }

    public void setDestinoRetiro(String destinoRetiro) {
        this.destinoRetiro = destinoRetiro;
    }

    public String getJustificacionRetiro() {
        return justificacionRetiro;
    }

    public void setJustificacionRetiro(String justificacionRetiro) {
        this.justificacionRetiro = justificacionRetiro;
    }
}
