# Sprint 2: Catálogo público e cálculo automático

**Objetivo:** o cliente navega pelo catálogo, escolhe a quantidade e vê o valor a pagar.
**Requisitos:** RF01, RF02, RF03, RF23, RF24 · **Regras:** RN09, RN16 (RN14 só entra na Sprint 3, no servidor).

## O que está implementado

### Backend
- `GET /api/categories`: só categorias **ativas**, por ordem.
- `GET /api/products`: só produtos **ativos de categorias ativas** (RN09), com fotos (principal primeiro).
- `GET /api/products?category={slug}`: filtro por categoria. Slug desconhecido ou categoria inativa devolve 404.
- `GET /api/products/{id}`: detalhe. Produto inativo, de categoria inativa ou inexistente devolve 404.
- Resposta pública (`ProdutoPublicoResponse`): não expõe `ativo` nem o stock exato. Devolve `disponivel` e `limiteQuantidade`.
- **RN16 — `limiteQuantidade`** = `min(stock, limite do produto ou limite global)`; 0 se não houver stock.
  O limite global vem de `MAX_QUANTITY_PER_ORDER` (por omissão 10) e o produto pode ter o seu (`quantidade_maxima`).
- Sem alterações à base de dados (nenhuma migração nova).

### Frontend
- **Header** com as categorias vindas da API (no telemóvel a lista desloca-se na horizontal).
- **Página inicial** (`/`): pré-visualização com até 4 produtos por categoria e "Ver todos".
- **Categoria** (`/categoria/:slug`): grelha de produtos.
- **Produto** (`/produto/:id`): galeria de fotos, descrição, preço, **seletor de quantidade com subtotal em tempo real**
  (preço × quantidade, calculado em cêntimos) e validação de inteiro >= 1 e <= limite.
- Estados de carregamento (skeleton), erro com "Tentar novamente", vazio, "Esgotado" e 404.
- O botão **Encomendar** aparece desativado ("disponível em breve"): o fluxo de encomenda é a Sprint 3.
  Para o ligar, mudar `ENCOMENDA_ATIVA` em `src/pages/Produto.jsx`.
- O `api.js` passa a mostrar "Não foi possível ligar ao servidor" quando o backend está em baixo e a guardar `status` nos erros.

## Como testar
```bash
cd backend && mvn verify && mvn spring-boot:run
cd frontend && npm install && npm run dev      # http://localhost:5173
```
Teste rápido da API (não precisa de token):
```bash
curl -s localhost:1111/api/categories
curl -s localhost:1111/api/products
curl -s "localhost:1111/api/products?category=telefones"
curl -s localhost:1111/api/products/1
curl -s -o /dev/null -w "%{http_code}\n" localhost:1111/api/products/9999    # 404
```
Para ver o catálogo é preciso ter, no admin, pelo menos um produto **ativo** com foto, numa categoria ativa e com stock.

## Definition of Done
- [ ] `mvn verify` passa (inclui `CatalogoServiceTest` e `CatalogoPublicoControllerTest`).
- [ ] Sem token, `/api/categories` e `/api/products` devolvem 200 e `/api/admin/**` continua a devolver 401.
- [ ] Um produto desativado desaparece do site; reativado, volta a aparecer.
- [ ] Quantidade acima do limite mostra erro e o subtotal não é calculado.
- [ ] Páginas bem apresentadas em telemóvel (sem scroll horizontal).

## Limitações conhecidas (para sprints futuras)
- Sem paginação nem pesquisa por texto (RNF03 pede paginação; o catálogo inicial é pequeno).
- O total mostrado é o **subtotal**: a taxa de entrega depende da zona e entra na Sprint 3. O servidor recalcula tudo (RN14).
- O stock não é reservado ao consultar; a reserva (RN17) acontece ao criar a encomenda.
