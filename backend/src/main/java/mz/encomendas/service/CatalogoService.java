package mz.encomendas.service;

import mz.encomendas.dto.CategoriaResponse;
import mz.encomendas.dto.ImagemResponse;
import mz.encomendas.dto.ProdutoPublicoResponse;
import mz.encomendas.exception.ApiException;
import mz.encomendas.model.Categoria;
import mz.encomendas.model.Produto;
import mz.encomendas.repository.CategoriaRepository;
import mz.encomendas.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Catálogo público (Sprint 2): só mostra categorias ativas e produtos ativos de categorias ativas (RN09).
 * Calcula o limite de quantidade que o cliente pode escolher (RN16).
 */
@Service
public class CatalogoService {

    private final CategoriaRepository categorias;
    private final ProdutoRepository produtos;
    private final int limiteGlobal;

    public CatalogoService(CategoriaRepository categorias, ProdutoRepository produtos,
                           @Value("${app.order.max-quantity:10}") int limiteGlobal) {
        this.categorias = categorias;
        this.produtos = produtos;
        this.limiteGlobal = limiteGlobal;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categorias.findByAtivaTrueOrderByOrdemAscNomeAsc().stream()
                .map(c -> new CategoriaResponse(c.getId(), c.getNome(), c.getSlug(), c.isAtiva(), c.getOrdem()))
                .toList();
    }

    /** @param categoriaSlug slug da categoria; null ou vazio devolve todos os produtos visíveis. */
    @Transactional(readOnly = true)
    public List<ProdutoPublicoResponse> listarProdutos(String categoriaSlug) {
        List<Produto> lista;
        if (categoriaSlug == null || categoriaSlug.isBlank()) {
            lista = produtos.findByAtivoTrueAndCategoria_AtivaTrueOrderByIdDesc();
        } else {
            Categoria c = categorias.findBySlug(categoriaSlug.trim())
                    .filter(Categoria::isAtiva)
                    .orElseThrow(() -> ApiException.notFound("Categoria não encontrada"));
            lista = produtos.findByAtivoTrueAndCategoriaIdOrderByIdDesc(c.getId());
        }
        return lista.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoPublicoResponse obterProduto(Long id) {
        Produto p = produtos.findWithImagensById(id)
                .filter(x -> x.isAtivo() && x.getCategoria().isAtiva())
                .orElseThrow(() -> ApiException.notFound("Produto não encontrado"));
        return toResponse(p);
    }

    /**
     * RN16: a quantidade máxima é o limite do produto (se o admin definiu um) ou o limite global,
     * e nunca excede o stock disponível. Devolve 0 se não houver stock.
     */
    static int limiteQuantidade(int stock, Integer maximoDoProduto, int limiteGlobal) {
        if (stock <= 0) return 0;
        int maximo = maximoDoProduto != null ? maximoDoProduto : limiteGlobal;
        return Math.max(0, Math.min(stock, maximo));
    }

    private ProdutoPublicoResponse toResponse(Produto p) {
        List<ImagemResponse> imgs = p.getImagens().stream()
                .map(i -> new ImagemResponse(i.getId(), i.getUrl(), i.isPrincipal(), i.getOrdem())).toList();
        int limite = limiteQuantidade(p.getStock(), p.getQuantidadeMaxima(), limiteGlobal);
        return new ProdutoPublicoResponse(p.getId(), p.getCategoria().getId(), p.getCategoria().getNome(),
                p.getCategoria().getSlug(), p.getNome(), p.getDescricao(), p.getTipoModelo(),
                p.getPreco(), p.getMoeda(), limite > 0, limite, imgs);
    }
}
