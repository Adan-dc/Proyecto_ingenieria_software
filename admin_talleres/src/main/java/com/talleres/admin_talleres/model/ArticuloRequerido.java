package com.talleres.admin_talleres.model;

import jakarta.persistence.*;

@Entity
public class ArticuloRequerido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(length = 500)
    private String descripcion;

    private Integer cantidadNecesaria;
    private Integer cantidadRecibida;

    private String estado;
    private String icono;

    @ManyToOne
    @JoinColumn(name = "taller_id")
    private Taller taller;

    public ArticuloRequerido() {
    }

    public ArticuloRequerido(Long id, String nombre, String descripcion, Integer cantidadNecesaria,
                             Integer cantidadRecibida, String estado, String icono, Taller taller) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidadNecesaria = cantidadNecesaria;
        this.cantidadRecibida = cantidadRecibida;
        this.estado = estado;
        this.icono = icono;
        this.taller = taller;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getCantidadNecesaria() {
        return cantidadNecesaria;
    }

    public Integer getCantidadRecibida() {
        return cantidadRecibida;
    }

    public String getEstado() {
        return estado;
    }

    public String getIcono() {
        return icono;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCantidadNecesaria(Integer cantidadNecesaria) {
        this.cantidadNecesaria = cantidadNecesaria;
    }

    public void setCantidadRecibida(Integer cantidadRecibida) {
        this.cantidadRecibida = cantidadRecibida;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }
}
