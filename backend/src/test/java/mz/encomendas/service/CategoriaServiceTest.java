package mz.encomendas.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CategoriaServiceTest {

    @Test
    void slugRemoveAcentosEPontuacao() {
        assertEquals("acessorios-eletronicos", CategoriaService.slugify("Acessórios Eletrónicos"));
        assertEquals("pastas-bolsinhas", CategoriaService.slugify("Pastas (Bolsinhas)"));
    }
}
