package mz.encomendas.repository;

import mz.encomendas.model.Produto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @EntityGraph(attributePaths = {"categoria", "imagens"})
    List<Produto> findAllByOrderByIdDesc();

    @EntityGraph(attributePaths = {"categoria", "imagens"})
    List<Produto> findByCategoriaIdOrderByIdDesc(Long categoriaId);

    @EntityGraph(attributePaths = {"categoria", "imagens"})
    Optional<Produto> findWithImagensById(Long id);

    // --- Catálogo público (Sprint 2): só produtos ativos de categorias ativas ---
    @EntityGraph(attributePaths = {"categoria", "imagens"})
    List<Produto> findByAtivoTrueAndCategoria_AtivaTrueOrderByIdDesc();

    @EntityGraph(attributePaths = {"categoria", "imagens"})
    List<Produto> findByAtivoTrueAndCategoriaIdOrderByIdDesc(Long categoriaId);

    long countByCategoriaId(Long categoriaId);
}
