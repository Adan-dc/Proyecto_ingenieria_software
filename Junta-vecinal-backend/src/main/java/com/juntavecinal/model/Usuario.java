package com.juntavecinal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false)
    private Boolean activo;

    @Column(length = 20)
    private String estado;
}
