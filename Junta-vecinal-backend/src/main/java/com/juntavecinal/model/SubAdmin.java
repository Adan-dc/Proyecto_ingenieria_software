package com.juntavecinal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sub_admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String rol;

    @Column(length = 12)
    private String rut;

    @Column(length = 20)
    private String estado;

    @Column(nullable = false)
    private String password;
}