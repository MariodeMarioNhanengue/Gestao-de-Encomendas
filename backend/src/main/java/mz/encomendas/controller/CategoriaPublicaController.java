package mz.encomendas.controller;

import mz.encomendas.dto.CategoriaResponse;
import mz.encomendas.service.CatalogoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Categorias ativas para a header do site (público, sem autenticação). */
@RestController
@RequestMapping("/api/categories")
public class CategoriaPublicaController {

    private final CatalogoService catalogo;

    public CategoriaPublicaController(CatalogoService catalogo) {
        this.catalogo = catalogo;
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return catalogo.listarCategorias();
    }
}
