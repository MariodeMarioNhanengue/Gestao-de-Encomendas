# Sprint 1: Administração do catálogo

**Objetivo:** o admin entra no sistema e cria categorias e produtos (categoria, preço, stock e fotos).
**Requisitos:** RF10, RF11, RF12, RF25 · **Regras:** RN15, RN16 (limite), RN18.

## O que está implementado
- Login do admin com JWT (`POST /api/admin/login`). O primeiro admin é criado no arranque a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Em desenvolvimento vêm de `backend/config/secrets.properties` (por omissão `admin@localhost` / `admin12345`; altere).
- Categorias: listar, criar, editar, ativar/desativar.
- Produtos: criar e editar com categoria, nome, modelo, descrição, preço, stock, limite por encomenda e fotos; ativar/desativar; remover foto; definir foto principal.
- Validações: categoria ativa, preço > 0, pelo menos uma foto, JPG/PNG/WebP até 5 MB, produto ativo não pode ficar sem fotos.
- Fotos: pasta local `./uploads` em desenvolvimento; **Cloudinary** em produção (`STORAGE=cloudinary` e `CLOUDINARY_URL`).
- Frontend: `/admin/login`, `/admin` (produtos), `/admin/produtos/novo`, `/admin/produtos/:id`, `/admin/categorias`.
- Migração `V3`: `produto.quantidade_maxima` e `produto_imagem.public_id`.

## Como testar
```bash
cp .env.example .env && docker compose up -d
cp backend/config/secrets.properties.example backend/config/secrets.properties   # preencher
cd backend && mvn spring-boot:run
cd frontend && cp .env.example .env && npm install && npm run dev
# abrir http://localhost:5173/admin/login
```
Teste rápido da API:
```bash
TOKEN=$(curl -s -X POST localhost:8080/api/admin/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@localhost","password":"admin12345"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
curl -s localhost:8080/api/admin/categories -H "Authorization: Bearer $TOKEN"
curl -s -X POST localhost:8080/api/admin/products -H "Authorization: Bearer $TOKEN" \
  -F categoriaId=1 -F nome="Capa Teste" -F preco=350 -F stock=5 -F imagens=@foto.jpg
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/api/admin/products   # deve dar 401
```

## Cloudinary em produção
1. Cria conta em cloudinary.com e copia o valor *API environment variable* (`cloudinary://KEY:SECRET@CLOUD`).
2. No serviço do backend define `STORAGE=cloudinary`, `CLOUDINARY_URL=...`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (forte) e `JWT_SECRET` (32+ caracteres).
3. Depois do primeiro login, o admin pode trocar a palavra-passe inicial (alteração de palavra-passe fica para uma sprint futura).

## Definition of Done
- [ ] `mvn verify` passa (testes de JWT, segurança e slug).
- [ ] Flyway aplica V1, V2 e V3 sem erros e o Hibernate valida o esquema.
- [ ] Admin cria produto com foto e este aparece em `/admin`.
- [ ] Sem token, `/api/admin/**` devolve 401.
- [ ] Nenhum segredo no repositório.

## Limitações conhecidas (para sprints futuras)
- Ainda sem limite de tentativas de login nem alteração de palavra-passe.
- O tipo da foto é validado pelo `Content-Type` enviado; a verificação do conteúdo real do ficheiro fica para a Sprint 6 (segurança).
- A listagem pública de produtos (só ativos) é a Sprint 2.
