package mz.encomendas.service;

import mz.encomendas.dto.CategoriaRequest;
import mz.encomendas.dto.CategoriaResponse;
import mz.encomendas.exception.ApiException;
import mz.encomendas.model.Categoria;
import mz.encomendas.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return repo.findAllByOrderByOrdemAscNomeAsc().stream().map(this::toResponse).toList();
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest req) {
        String nome = req.nome().trim();
        String slug = slugify(nome);
        if (repo.existsByNomeIgnoreCase(nome) || repo.existsBySlug(slug)) {
            throw ApiException.conflict("Já existe uma categoria com esse nome");
        }
        Categoria c = new Categoria();
        c.setNome(nome);
        c.setSlug(slug);
        c.setOrdem(req.ordem() == null ? 0 : req.ordem());
        return toResponse(repo.save(c));
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest req) {
        Categoria c = buscar(id);
        String nome = req.nome().trim();
        String slug = slugify(nome);
        if (repo.existsByNomeIgnoreCaseAndIdNot(nome, id) || repo.existsBySlugAndIdNot(slug, id)) {
            throw ApiException.conflict("Já existe uma categoria com esse nome");
        }
        c.setNome(nome);
        c.setSlug(slug);
        if (req.ordem() != null) c.setOrdem(req.ordem());
        return toResponse(c);
    }

    @Transactional
    public CategoriaResponse alterarAtiva(Long id, boolean ativa) {
        Categoria c = buscar(id);
        c.setAtiva(ativa);
        return toResponse(c);
    }

    private Categoria buscar(Long id) {
        return repo.findById(id).orElseThrow(() -> ApiException.notFound("Categoria não encontrada"));
    }

    private CategoriaResponse toResponse(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getNome(), c.getSlug(), c.isAtiva(), c.getOrdem());
    }

    static String slugify(String s) {
        String n = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return n.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
