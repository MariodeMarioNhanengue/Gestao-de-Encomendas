-- MySQL 8 | InnoDB | utf8mb4

CREATE TABLE categoria (
  id     BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(80) NOT NULL,
  slug   VARCHAR(80) NOT NULL,
  ativa  BOOLEAN NOT NULL DEFAULT TRUE,
  ordem  INT NOT NULL DEFAULT 0,
  CONSTRAINT uq_categoria_nome UNIQUE (nome),
  CONSTRAINT uq_categoria_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produto (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  categoria_id  BIGINT NOT NULL,
  nome          VARCHAR(150) NOT NULL,
  descricao     TEXT NULL,
  tipo_modelo   VARCHAR(80) NULL,
  preco         DECIMAL(12,2) NOT NULL,
  moeda         CHAR(3) NOT NULL DEFAULT 'MZN',
  stock         INT NOT NULL DEFAULT 0,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id),
  CONSTRAINT ck_produto_preco CHECK (preco > 0),
  CONSTRAINT ck_produto_stock CHECK (stock >= 0),
  INDEX idx_produto_categoria (categoria_id, ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE produto_imagem (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  produto_id  BIGINT NOT NULL,
  url         VARCHAR(500) NOT NULL,
  principal   BOOLEAN NOT NULL DEFAULT FALSE,
  ordem       INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_imagem_produto FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE,
  INDEX idx_imagem_produto (produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cliente (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome_completo      VARCHAR(150) NOT NULL,
  numero_bi          VARCHAR(30) NOT NULL,
  telefone           VARCHAR(15) NOT NULL,
  telefone_whatsapp  BOOLEAN NOT NULL DEFAULT TRUE,
  email              VARCHAR(150) NULL,
  criado_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_cliente_bi UNIQUE (numero_bi),
  INDEX idx_cliente_telefone (telefone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE documento_identificacao (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente_id        BIGINT NOT NULL,
  tipo              VARCHAR(20) NOT NULL DEFAULT 'BI',
  caminho_ficheiro  VARCHAR(500) NOT NULL,
  mime_type         VARCHAR(50) NULL,
  tamanho_bytes     BIGINT NULL,
  enviado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  eliminar_apos     DATE NULL,
  CONSTRAINT fk_doc_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  INDEX idx_doc_cliente (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE zona_entrega (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
  provincia             VARCHAR(80) NOT NULL,
  cidade                VARCHAR(80) NOT NULL,
  taxa_entrega          DECIMAL(12,2) NOT NULL DEFAULT 0,
  prazo_sugerido_dias   INT NULL,
  ativa                 BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_zona UNIQUE (provincia, cidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE administrador (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL,
  papel       VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_admin_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RN01: cada pedido pertence a exatamente um cliente (cliente_id NOT NULL + FK)
CREATE TABLE pedido (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo              VARCHAR(20) NOT NULL,
  cliente_id          BIGINT NOT NULL,
  zona_entrega_id     BIGINT NOT NULL,
  bairro              VARCHAR(120) NOT NULL,
  endereco_detalhe    VARCHAR(255) NULL,
  subtotal            DECIMAL(12,2) NOT NULL,
  taxa_entrega        DECIMAL(12,2) NOT NULL DEFAULT 0,
  total               DECIMAL(12,2) NOT NULL,
  estado              VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
  prazo_entrega_dias  INT NULL,
  estado_pagamento    VARCHAR(20) NOT NULL DEFAULT 'NAO_APLICAVEL',
  criado_em           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_pedido_codigo UNIQUE (codigo),
  CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  CONSTRAINT fk_pedido_zona FOREIGN KEY (zona_entrega_id) REFERENCES zona_entrega(id),
  CONSTRAINT ck_pedido_estado CHECK (estado IN ('PENDENTE','EM_ANALISE','CONFIRMADO','EM_ENTREGA','ENTREGUE','CANCELADO')),
  CONSTRAINT ck_pedido_prazo CHECK (prazo_entrega_dias IS NULL OR prazo_entrega_dias > 0),
  INDEX idx_pedido_cliente (cliente_id),
  INDEX idx_pedido_estado (estado, criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE item_pedido (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       BIGINT NOT NULL,
  produto_id      BIGINT NOT NULL,
  nome_produto    VARCHAR(150) NOT NULL,
  preco_unitario  DECIMAL(12,2) NOT NULL,
  quantidade      INT NOT NULL DEFAULT 1,
  total_linha     DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_produto FOREIGN KEY (produto_id) REFERENCES produto(id),
  CONSTRAINT ck_item_qtd CHECK (quantidade >= 1),
  INDEX idx_item_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE historico_estado_pedido (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id        BIGINT NOT NULL,
  estado_anterior  VARCHAR(20) NULL,
  estado_novo      VARCHAR(20) NOT NULL,
  alterado_por     BIGINT NULL,
  alterado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nota             VARCHAR(255) NULL,
  CONSTRAINT fk_hist_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_hist_admin FOREIGN KEY (alterado_por) REFERENCES administrador(id),
  INDEX idx_hist_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificacao (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id     BIGINT NOT NULL,
  canal         VARCHAR(15) NOT NULL,
  destinatario  VARCHAR(150) NULL,
  mensagem      TEXT NULL,
  estado        VARCHAR(15) NOT NULL DEFAULT 'PENDENTE',
  erro          VARCHAR(255) NULL,
  enviada_em    TIMESTAMP NULL,
  CONSTRAINT fk_notif_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT ck_notif_canal CHECK (canal IN ('EMAIL','WHATSAPP')),
  CONSTRAINT ck_notif_estado CHECK (estado IN ('PENDENTE','ENVIADA','FALHADA')),
  INDEX idx_notif_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fase futura (gateway de pagamento)
CREATE TABLE pagamento (
  id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id           BIGINT NOT NULL,
  metodo              VARCHAR(30) NULL,
  valor               DECIMAL(12,2) NULL,
  referencia_gateway  VARCHAR(100) NULL,
  estado              VARCHAR(20) NULL,
  pago_em             TIMESTAMP NULL,
  CONSTRAINT fk_pag_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id),
  INDEX idx_pag_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
