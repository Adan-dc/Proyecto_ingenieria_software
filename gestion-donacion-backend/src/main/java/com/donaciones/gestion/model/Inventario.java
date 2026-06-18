package com.donaciones.gestion.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventario {

    @Id
    private Long codDonacion;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "`Id donacion`")
    private GestionDonacion gestionDonacion;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private String objeto;

    @Column(length = 500)
    private String descripcion;
}
