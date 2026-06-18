package com.donaciones.gestion.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @Column(name = "id")
    private String id;
    
    @Column(name = "nombre_usuario", unique = true, nullable = false)
    private String nombreUsuario;
    
    @Column(name = "clave", nullable = false)
    private String clave;
}
