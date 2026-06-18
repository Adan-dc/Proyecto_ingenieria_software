package com.donaciones.gestion.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`gestion donacion`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GestionDonacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`Id donacion`")
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "`rut donante`", nullable = false)
    private Donante donante;

    @Column(name = "`Objeto a donar`", nullable = false)
    private String objetoADonar;

    @Column(name = "`Cantidad`", nullable = false)
    private Integer cantidad;

    @Column(name = "`descripcion`", length = 500)
    private String descripcion;

    @Column(name = "`Destino`")
    @Enumerated(EnumType.STRING)
    private DestinoDonacion destino;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "`Codigo_Taller`")
    private Talleres taller;

    @Column(name = "`estado_revision`", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoRevision estadoRevision;

    @Column(name = "`estado_envio`")
    @Enumerated(EnumType.STRING)
    private EstadoEnvio estadoEnvio;

    @Column(name = "`motivo_rechazo`", length = 500)
    private String motivoRechazo;
}
