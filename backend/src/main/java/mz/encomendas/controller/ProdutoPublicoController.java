package mz.encomendas.controller;

import mz.encomendas.dto.ProdutoPublicoResponse;
import mz.encomendas.service.CatalogoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Produtos visíveis ao cliente (ativos, de categorias ativas). Público, sem autenticação. */
@RestController
@RequestMapping("/api/products")
public class ProdutoPublicoController {

    private final CatalogoService catalogo;

    public ProdutoPublicoController(CatalogoService catalogo) {
        this.catalogo = catalogo;
    }

    /** GET /api/products?category=telefones (o parâmetro é o slug da categoria; opcional). */
    @GetMapping
    public List<ProdutoPublicoResponse> listar(@RequestParam(name = "category", required = false) String category) {
        return catalogo.listarProdutos(category);
    }

    @GetMapping("/{id}")
    public ProdutoPublicoResponse obter(@PathVariable("id") Long id) {
        return catalogo.obterProduto(id);
    }
}
