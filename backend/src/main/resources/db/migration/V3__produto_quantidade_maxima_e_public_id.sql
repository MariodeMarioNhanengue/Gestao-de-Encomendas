-- RN16: limite opcional de quantidade por encomenda, definido por produto (NULL = limite global)
ALTER TABLE produto ADD COLUMN quantidade_maxima INT NULL AFTER stock;
ALTER TABLE produto ADD CONSTRAINT ck_produto_qtd_max CHECK (quantidade_maxima IS NULL OR quantidade_maxima >= 1);

-- RN18: identificador no armazenamento externo (Cloudinary) para poder apagar a foto
ALTER TABLE produto_imagem ADD COLUMN public_id VARCHAR(255) NULL AFTER url;
