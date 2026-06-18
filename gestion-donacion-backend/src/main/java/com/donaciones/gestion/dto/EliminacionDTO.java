package com.donaciones.gestion.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EliminacionDTO {
    @NotBlank(message = "Debe proporcionar una justificación para eliminar")
    private String justificacion;
}
