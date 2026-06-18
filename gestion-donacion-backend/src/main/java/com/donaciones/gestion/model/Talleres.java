package com.donaciones.gestion.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "taller")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Talleres {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`Codigo`")
    private Long codigo;

    @Column(name = "`nombre`", nullable = false)
    private String nombre;

    @Column(name = "`Fecha`")
    private String fecha;

    @Column(name = "`Hora`")
    private String hora;

    @Column(name = "`direccion`")
    private String direccion;

    @Column(name = "`comentarios`", length = 500)
    private String comentarios;

    @Column(name = "`Max-Voluntarios`")
    private Integer maxVoluntarios;

    @Column(name = "`donaciones requeridas`")
    private Integer donacionesRequeridas;

    @Column(name = "`donaciones listas`")
    private Integer donacionesListas;
}
