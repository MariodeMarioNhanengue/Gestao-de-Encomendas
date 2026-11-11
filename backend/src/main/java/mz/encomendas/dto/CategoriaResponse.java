package mz.encomendas.dto;

public record CategoriaResponse(Long id, String nome, String slug, boolean ativa, int ordem) {}
