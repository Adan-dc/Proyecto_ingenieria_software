package com.donaciones.gestion.dto;

public class NotificacionTokenDTO {

    private String rutDonante;
    private String tokenFcm;

    public NotificacionTokenDTO() {
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public String getTokenFcm() {
        return tokenFcm;
    }

    public void setTokenFcm(String tokenFcm) {
        this.tokenFcm = tokenFcm;
    }
}
