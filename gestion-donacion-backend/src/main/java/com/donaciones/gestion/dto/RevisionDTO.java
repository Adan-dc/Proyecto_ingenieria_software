package com.donaciones.gestion.dto;

import com.donaciones.gestion.model.DestinoDonacion;
import com.donaciones.gestion.model.EstadoEnvio;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RevisionDTO {
    @NotNull(message = "El estado de aceptación es requerido (true/false)")
    private Boolean aceptar;
    
    // Solo si acepta
    private DestinoDonacion destino;
    private EstadoEnvio estadoEnvio;
    
    // Solo si rechaza
    private String motivoRechazo;
}
