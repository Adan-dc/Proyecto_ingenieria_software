package com.donaciones.gestion.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DonacionRequestDTO {
    @NotBlank(message = "El RUT es obligatorio")
    private String rutDonante;

    @NotBlank(message = "El nombre del donante es obligatorio")
    private String nombreDonante;

    @Size(max = 9, message = "El teléfono no puede superar 9 dígitos")
    @Pattern(regexp = "^[0-9]*$", message = "El teléfono solo puede contener dígitos")
    private String telefonoDonante;
    
    @NotBlank(message = "El objeto a donar es obligatorio")
    private String objetoADonar;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;
    
    private String descripcion;
}
