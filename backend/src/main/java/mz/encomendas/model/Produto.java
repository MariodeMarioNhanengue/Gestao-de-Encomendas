package mz.encomendas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produto")
@Getter @Setter @NoArgsConstructor
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String tipoModelo;

    @Column(precision = 12, scale = 2)
    private BigDecimal preco;

    @Column(columnDefinition = "CHAR(3)")
    private String moeda = "MZN";

    private int stock;

    private Integer quantidadeMaxima;

    private boolean ativo = true;

    @Column(insertable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("principal DESC, ordem ASC, id ASC")
    private List<ProdutoImagem> imagens = new ArrayList<>();
}
