package com.talleres.admin_talleres.dto;

public class ComentarioRequest {

    private Long tallerId;
    private Long voluntarioId;
    private String nombreVoluntario;
    private String emailVoluntario;
    private String comentario;

    public ComentarioRequest() {
    }

    public Long getTallerId() {
        return tallerId;
    }

    public void setTallerId(Long tallerId) {
        this.tallerId = tallerId;
    }

    public Long getVoluntarioId() {
        return voluntarioId;
    }

    public void setVoluntarioId(Long voluntarioId) {
        this.voluntarioId = voluntarioId;
    }

    public String getNombreVoluntario() {
        return nombreVoluntario;
    }

    public void setNombreVoluntario(String nombreVoluntario) {
        this.nombreVoluntario = nombreVoluntario;
    }

    public String getEmailVoluntario() {
        return emailVoluntario;
    }

    public void setEmailVoluntario(String emailVoluntario) {
        this.emailVoluntario = emailVoluntario;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}