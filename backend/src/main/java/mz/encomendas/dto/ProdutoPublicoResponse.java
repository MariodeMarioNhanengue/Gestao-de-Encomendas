package mz.encomendas.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Produto visto pelo cliente. Não expõe o estado interno (ativo) nem o stock exato:
 * o cliente só precisa de saber se está disponível e quantas unidades pode encomendar (RN16).
 */
public record ProdutoPublicoResponse(
        Long id, Long categoriaId, String categoriaNome, String categoriaSlug,
        String nome, String descricao, String tipoModelo,
        BigDecimal preco, String moeda,
        boolean disponivel, int limiteQuantidade,
        List<ImagemResponse> imagens) {}
