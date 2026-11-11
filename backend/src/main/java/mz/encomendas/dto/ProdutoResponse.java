package mz.encomendas.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProdutoResponse(
        Long id, Long categoriaId, String categoriaNome, String nome, String descricao, String tipoModelo,
        BigDecimal preco, String moeda, int stock, Integer quantidadeMaxima, boolean ativo,
        List<ImagemResponse> imagens) {}
