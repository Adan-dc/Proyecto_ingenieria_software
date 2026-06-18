package com.donaciones.gestion.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donacion_eliminada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonacionEliminada {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long idDonacionOriginal;
    
    @Column(nullable = false)
    private String articulo;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false, length = 500)
    private String motivoEliminacion;
    
    @Column(nullable = false)
    private LocalDateTime fechaEliminacion;
}
