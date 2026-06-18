package com.proyecto.app_voluntario.model;

import jakarta.persistence.*;

@Entity
@Table(name = "voluntario")
public class Voluntario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true)
    private String rut;

    private String telefono;

    @Column(unique = true)
    private String email;

    private String password;

    public Voluntario() {
    }

    public Voluntario(Long id, String nombre, String rut, String telefono, String email, String password) {
        this.id = id;
        this.nombre = nombre;
        this.rut = rut;
        this.telefono = telefono;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getRut() {
        return rut;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}