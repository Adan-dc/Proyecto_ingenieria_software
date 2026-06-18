package com.donaciones.gestion.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`donante`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donante {

    @Id
    @Column(name = "`rut`", nullable = false, length = 12)
    private String rut;

    @Column(name = "`nombre`", nullable = false)
    private String nombre;

    @Column(name = "`apellido`")
    private String apellido;

    @Column(name = "`correo`")
    private String correo;

    @Column(name = "`telefono`", length = 9)
    private String telefono;

    @Column(name = "`direccion`")
    private String direccion;

    @Column(name = "`ID_Usuario`")
    private Long idUsuario;
}
