package com.donaciones.gestion.dto;

public class DonacionRequestDTO {

    private String rutDonante;
    private String nombreDonante;
    private String telefonoDonante;
    private String objetoADonar;
    private Integer cantidad;
    private String descripcion;

    public DonacionRequestDTO() {
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public String getNombreDonante() {
        return nombreDonante;
    }

    public String getTelefonoDonante() {
        return telefonoDonante;
    }

    public String getObjetoADonar() {
        return objetoADonar;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public void setNombreDonante(String nombreDonante) {
        this.nombreDonante = nombreDonante;
    }

    public void setTelefonoDonante(String telefonoDonante) {
        this.telefonoDonante = telefonoDonante;
    }

    public void setObjetoADonar(String objetoADonar) {
        this.objetoADonar = objetoADonar;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}