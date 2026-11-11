package mz.encomendas.controller;

import jakarta.validation.Valid;
import mz.encomendas.dto.CategoriaRequest;
import mz.encomendas.dto.CategoriaResponse;
import mz.encomendas.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoriaController {

    private final CategoriaService service;

    public AdminCategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoriaResponse criar(@Valid @RequestBody CategoriaRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest req) {
        return service.atualizar(id, req);
    }

    @PatchMapping("/{id}/active")
    public CategoriaResponse ativar(@PathVariable Long id, @RequestParam boolean value) {
        return service.alterarAtiva(id, value);
    }
}
