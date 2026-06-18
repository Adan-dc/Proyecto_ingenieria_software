package com.donaciones.gestion.dto;

public class ApkRequestDTO {

    private String rutDonante;
    private String nombreDonante;
    private String telefonoDonante;
    private String correoDonante;
    private String direccionDonante;
    private String sectorDonante;

    private String articulo;
    private String objeto;

    private Integer cantidad;
    private String descripcion;

    private Long codigoTaller;
    private String nombreTaller;

    public ApkRequestDTO() {
    }

    public String getRutDonante() {
        return rutDonante;
    }

    public void setRutDonante(String rutDonante) {
        this.rutDonante = rutDonante;
    }

    public String getNombreDonante() {
        return nombreDonante;
    }

    public void setNombreDonante(String nombreDonante) {
        this.nombreDonante = nombreDonante;
    }

    public String getTelefonoDonante() {
        return telefonoDonante;
    }

    public void setTelefonoDonante(String telefonoDonante) {
        this.telefonoDonante = telefonoDonante;
    }

    public String getCorreoDonante() {
        return correoDonante;
    }

    public void setCorreoDonante(String correoDonante) {
        this.correoDonante = correoDonante;
    }

    public String getDireccionDonante() {
        return direccionDonante;
    }

    public void setDireccionDonante(String direccionDonante) {
        this.direccionDonante = direccionDonante;
    }

    public String getSectorDonante() {
        return sectorDonante;
    }

    public void setSectorDonante(String sectorDonante) {
        this.sectorDonante = sectorDonante;
    }

    public String getArticulo() {
        return articulo;
    }

    public void setArticulo(String articulo) {
        this.articulo = articulo;
    }

    public String getObjeto() {
        return objeto;
    }

    public void setObjeto(String objeto) {
        this.objeto = objeto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getCodigoTaller() {
        return codigoTaller;
    }

    public void setCodigoTaller(Long codigoTaller) {
        this.codigoTaller = codigoTaller;
    }

    public String getNombreTaller() {
        return nombreTaller;
    }

    public void setNombreTaller(String nombreTaller) {
        this.nombreTaller = nombreTaller;
    }
}