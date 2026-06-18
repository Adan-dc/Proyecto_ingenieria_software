package com.donaciones.gestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApkRequestDTO {
    @NotBlank(message = "El RUT es obligatorio")
    private String rutDonante;
    
    @NotBlank(message = "El artículo es obligatorio")
    private String articulo;
}
