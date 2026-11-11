package mz.encomendas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "O nome é obrigatório") @Size(max = 80, message = "Máximo 80 caracteres") String nome,
        Integer ordem) {}
