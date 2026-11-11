package mz.encomendas.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

/** Dados do formulário (multipart/form-data) para criar ou editar um produto. */
public record ProdutoForm(
        @NotNull(message = "Escolha a categoria") Long categoriaId,
        @NotBlank(message = "O nome é obrigatório") @Size(max = 150, message = "Máximo 150 caracteres") String nome,
        String descricao,
        @Size(max = 80, message = "Máximo 80 caracteres") 
        String tipoModelo,
        @NotNull(message = "O preço é obrigatório") @DecimalMin(value = "0.01", message = "O preço deve ser maior que 0") BigDecimal preco,
        @NotNull(message = "O stock é obrigatório") @Min(value = 0, message = "O stock não pode ser negativo") Integer stock,
        @Min(value = 1, message = "O limite mínimo é 1") Integer quantidadeMaxima,
        List<MultipartFile> imagens) {}
