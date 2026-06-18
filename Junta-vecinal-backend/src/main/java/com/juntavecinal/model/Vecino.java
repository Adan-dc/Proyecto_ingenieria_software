package com.juntavecinal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vecinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vecino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Importante:
     * Ya no debe ser unique, porque una misma persona puede existir como
     * VOLUNTARIO y DONANTE por separado.
     */
    @Column(nullable = false)
    private String rut;

    @Column(nullable = false)
    private String nombre;

    private String apellido;

    private String correo;

    private String telefono;

    private String direccion;

    private String sector;

    private String estado;

    /*
     * Ejemplos:
     * VOLUNTARIO
     * DONANTE
     * MANUAL
     */
    private String tipoOrigen;

    /*
     * ID original de la tabla voluntario o donante.
     */
    private Long idOrigen;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;
}