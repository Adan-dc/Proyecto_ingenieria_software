package com.donaciones.gestion.dto;

import com.donaciones.gestion.model.EstadoEnvio;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EdicionInventarioDTO {
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private Integer cantidad;
    
    @NotNull(message = "El estado de envío es obligatorio")
    private EstadoEnvio estadoEnvio;
}
