INSERT INTO categoria (nome, slug, ordem) VALUES
  ('Telefones', 'telefones', 1),
  ('Acessórios Eletrónicos', 'acessorios-eletronicos', 2),
  ('Pastas (Bolsinhas)', 'pastas-bolsinhas', 3);

-- RN04: zonas iniciais. Taxas e prazos são provisórios (a confirmar com o Product Owner).
INSERT INTO zona_entrega (provincia, cidade, taxa_entrega, prazo_sugerido_dias) VALUES
  ('Maputo', 'Maputo Cidade', 0, 2),
  ('Maputo', 'Matola', 0, 3);

-- Produtos de exemplo (substituir por dados reais na Sprint 4)
INSERT INTO produto (categoria_id, nome, descricao, tipo_modelo, preco, stock) VALUES
  (1, 'Telefone Exemplo A', 'Produto de demonstração', 'Android', 8500.00, 10),
  (2, 'Carregador Rápido 20W', 'Produto de demonstração', NULL, 650.00, 25),
  (3, 'Bolsinha para Telefone', 'Produto de demonstração', NULL, 400.00, 15);
