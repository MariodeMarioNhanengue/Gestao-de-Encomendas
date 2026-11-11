package mz.encomendas.service;

import mz.encomendas.dto.ImagemResponse;
import mz.encomendas.dto.ProdutoForm;
import mz.encomendas.dto.ProdutoResponse;
import mz.encomendas.exception.ApiException;
import mz.encomendas.model.Categoria;
import mz.encomendas.model.Produto;
import mz.encomendas.model.ProdutoImagem;
import mz.encomendas.repository.CategoriaRepository;
import mz.encomendas.repository.ProdutoRepository;
import mz.encomendas.storage.ImageStorage;
import mz.encomendas.storage.StoredImage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/** Regras RN15 (produto válido), RN18 (fotos) e gestão do catálogo pelo admin. */
@Service
public class ProdutoService {

    private static final Logger log = LoggerFactory.getLogger(ProdutoService.class);
    private static final Set<String> TIPOS = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private final ProdutoRepository produtos;
    private final CategoriaRepository categorias;
    private final ImageStorage storage;

    public ProdutoService(ProdutoRepository produtos, CategoriaRepository categorias, ImageStorage storage) {
        this.produtos = produtos;
        this.categorias = categorias;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponse> listar(Long categoriaId) {
        var lista = categoriaId == null ? produtos.findAllByOrderByIdDesc() : produtos.findByCategoriaIdOrderByIdDesc(categoriaId);
        return lista.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponse obter(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public ProdutoResponse criar(ProdutoForm f) {
        List<MultipartFile> files = ficheiros(f.imagens());
        if (files.isEmpty()) throw ApiException.badRequest("Adicione pelo menos uma foto do produto");
        files.forEach(this::validarImagem);

        Categoria cat = categoriaAtiva(f.categoriaId());
        Produto p = new Produto();
        preencher(p, f, cat);
        List<StoredImage> guardadas = new ArrayList<>();
        try {
            adicionarImagens(p, files, guardadas);
            return toResponse(produtos.save(p));
        } catch (RuntimeException e) {
            guardadas.forEach(s -> storage.delete(s.publicId())); // não deixar fotos órfãs
            throw e;
        }
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoForm f) {
        Produto p = buscar(id);
        List<MultipartFile> files = ficheiros(f.imagens());
        files.forEach(this::validarImagem);
        Categoria cat = p.getCategoria().getId().equals(f.categoriaId()) ? p.getCategoria() : categoriaAtiva(f.categoriaId());
        preencher(p, f, cat);
        List<StoredImage> guardadas = new ArrayList<>();
        try {
            adicionarImagens(p, files, guardadas);
            return toResponse(p);
        } catch (RuntimeException e) {
            guardadas.forEach(s -> storage.delete(s.publicId()));
            throw e;
        }
    }

    @Transactional
    public ProdutoResponse alterarAtivo(Long id, boolean ativo) {
        Produto p = buscar(id);
        if (ativo && p.getImagens().isEmpty()) {
            throw ApiException.conflict("Adicione uma foto antes de ativar o produto");
        }
        p.setAtivo(ativo);
        return toResponse(p);
    }

    @Transactional
    public ProdutoResponse adicionarFotos(Long id, List<MultipartFile> imagens) {
        Produto p = buscar(id);
        List<MultipartFile> files = ficheiros(imagens);
        if (files.isEmpty()) throw ApiException.badRequest("Nenhuma foto enviada");
        files.forEach(this::validarImagem);
        List<StoredImage> guardadas = new ArrayList<>();
        try {
            adicionarImagens(p, files, guardadas);
            return toResponse(p);
        } catch (RuntimeException e) {
            guardadas.forEach(s -> storage.delete(s.publicId()));
            throw e;
        }
    }

    @Transactional
    public ProdutoResponse removerFoto(Long id, Long imagemId) {
        Produto p = buscar(id);
        ProdutoImagem img = p.getImagens().stream().filter(i -> i.getId().equals(imagemId)).findFirst()
                .orElseThrow(() -> ApiException.notFound("Foto não encontrada"));
        if (p.isAtivo() && p.getImagens().size() == 1) {
            throw ApiException.conflict("Um produto ativo precisa de pelo menos uma foto");
        }
        p.getImagens().remove(img);
        storage.delete(img.getPublicId());
        if (img.isPrincipal() && !p.getImagens().isEmpty()) {
            p.getImagens().get(0).setPrincipal(true);
        }
        return toResponse(p);
    }

    @Transactional
    public ProdutoResponse definirFotoPrincipal(Long id, Long imagemId) {
        Produto p = buscar(id);
        boolean existe = p.getImagens().stream().anyMatch(i -> i.getId().equals(imagemId));
        if (!existe) throw ApiException.notFound("Foto não encontrada");
        p.getImagens().forEach(i -> i.setPrincipal(i.getId().equals(imagemId)));
        return toResponse(p);
    }

    // ---------- auxiliares ----------

    private Produto buscar(Long id) {
        return produtos.findWithImagensById(id).orElseThrow(() -> ApiException.notFound("Produto não encontrado"));
    }

    private Categoria categoriaAtiva(Long id) {
        Categoria c = categorias.findById(id).orElseThrow(() -> ApiException.badRequest("Categoria inexistente"));
        if (!c.isAtiva()) throw ApiException.badRequest("A categoria escolhida está desativada");
        return c;
    }

    private void preencher(Produto p, ProdutoForm f, Categoria cat) {
        p.setCategoria(cat);
        p.setNome(f.nome().trim());
        p.setDescricao(f.descricao() == null || f.descricao().isBlank() ? null : f.descricao().trim());
        p.setTipoModelo(f.tipoModelo() == null || f.tipoModelo().isBlank() ? null : f.tipoModelo().trim());
        p.setPreco(f.preco());
        p.setStock(f.stock());
        p.setQuantidadeMaxima(f.quantidadeMaxima());
    }

    private void adicionarImagens(Produto p, List<MultipartFile> files, List<StoredImage> guardadas) {
        int ordem = p.getImagens().stream().mapToInt(ProdutoImagem::getOrdem).max().orElse(-1) + 1;
        boolean semPrincipal = p.getImagens().stream().noneMatch(ProdutoImagem::isPrincipal);
        for (MultipartFile file : files) {
            StoredImage s = storage.store(file);
            guardadas.add(s);
            ProdutoImagem img = new ProdutoImagem();
            img.setProduto(p);
            img.setUrl(s.url());
            img.setPublicId(s.publicId());
            img.setOrdem(ordem++);
            if (semPrincipal) {
                img.setPrincipal(true);
                semPrincipal = false;
            }
            p.getImagens().add(img);
        }
    }

    private List<MultipartFile> ficheiros(List<MultipartFile> in) {
        if (in == null) return List.of();
        return in.stream().filter(f -> f != null && !f.isEmpty()).toList();
    }

    private void validarImagem(MultipartFile f) {
        if (f.getContentType() == null || !TIPOS.contains(f.getContentType())) {
            throw ApiException.badRequest("Formato de foto inválido (use JPG, PNG ou WebP)");
        }
        if (f.getSize() > MAX_BYTES) {
            throw ApiException.badRequest("Cada foto deve ter no máximo 5 MB");
        }
    }

    private ProdutoResponse toResponse(Produto p) {
        List<ImagemResponse> imgs = p.getImagens().stream()
                .map(i -> new ImagemResponse(i.getId(), i.getUrl(), i.isPrincipal(), i.getOrdem())).toList();
        return new ProdutoResponse(p.getId(), p.getCategoria().getId(), p.getCategoria().getNome(), p.getNome(),
                p.getDescricao(), p.getTipoModelo(), p.getPreco(), p.getMoeda(), p.getStock(),
                p.getQuantidadeMaxima(), p.isAtivo(), imgs);
    }
}
