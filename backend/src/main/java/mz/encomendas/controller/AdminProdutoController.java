package mz.encomendas.controller;

import jakarta.validation.Valid;
import mz.encomendas.dto.ProdutoForm;
import mz.encomendas.dto.ProdutoResponse;
import mz.encomendas.service.ProdutoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProdutoController {

    private final ProdutoService service;

    public AdminProdutoController(ProdutoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProdutoResponse> listar(@RequestParam(required = false) Long categoryId) {
        return service.listar(categoryId);
    }

    @GetMapping("/{id}")
    public ProdutoResponse obter(@PathVariable Long id) {
        return service.obter(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoResponse criar(@Valid @ModelAttribute ProdutoForm form) {
        return service.criar(form);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProdutoResponse atualizar(@PathVariable Long id, @Valid @ModelAttribute ProdutoForm form) {
        return service.atualizar(id, form);
    }

    @PatchMapping("/{id}/active")
    public ProdutoResponse ativar(@PathVariable Long id, @RequestParam boolean value) {
        return service.alterarAtivo(id, value);
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProdutoResponse adicionarFotos(@PathVariable Long id, @RequestParam("imagens") List<MultipartFile> imagens) {
        return service.adicionarFotos(id, imagens);
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ProdutoResponse removerFoto(@PathVariable Long id, @PathVariable Long imageId) {
        return service.removerFoto(id, imageId);
    }

    @PatchMapping("/{id}/images/{imageId}/main")
    public ProdutoResponse fotoPrincipal(@PathVariable Long id, @PathVariable Long imageId) {
        return service.definirFotoPrincipal(id, imageId);
    }
}