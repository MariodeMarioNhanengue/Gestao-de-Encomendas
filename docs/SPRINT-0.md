# Sprint 0: Preparação (BD: MySQL 8)

**Objetivo:** ambiente, esqueleto, base de dados e deploy base prontos, para a Sprint 1 começar só com funcionalidades.

## Backlog
| ID | Tarefa | Estado |
|---|---|---|
| S0-01 | Repositório Git (monorepo `backend/` + `frontend/`) e convenções (`CLAUDE.md`) | Feito no esqueleto |
| S0-02 | Projeto Spring Boot 3 (Java 17) com Web, JPA, Security, Validation, Mail, Actuator, Flyway | Feito |
| S0-03 | Projeto React + Vite + Tailwind + Router | Feito |
| S0-04 | MySQL 8 local via Docker Compose | Feito |
| S0-05 | Migrações Flyway V1 (12 tabelas) e V2 (categorias, zonas, produtos de exemplo) | Feito |
| S0-06 | Segurança base: CORS, rotas públicas vs `/api/admin/**` | Feito |
| S0-07 | CI (GitHub Actions): build + testes | Feito |
| S0-08 | Dockerfile do backend e `vercel.json` do frontend | Feito |
| S0-09 | Criar BD MySQL gerida de produção e backend em produção | A fazer por ti |
| S0-10 | Deploy do frontend no Vercel | A fazer por ti |
| S0-11 | Wireframes mobile-first (home, categoria, produto, formulário, resumo, admin) | A fazer |

## Definition of Done da Sprint 0
- `docker compose up -d` sobe o MySQL; `mvn spring-boot:run` aplica V1 e V2 sem erros.
- `GET /api/ping` e `/actuator/health` respondem; a home do React mostra "Backend: ligado".
- `mvn verify` e `npm run build` passam no CI.
- Frontend no Vercel a falar com o backend em produção (CORS correto).
- Nenhum segredo no repositório.

## Como correr localmente
```bash
cp .env.example .env                 # preencher as palavras-passe do MySQL
docker compose up -d                 # MySQL em :3306, Adminer em :8081
cp backend/config/secrets.properties.example backend/config/secrets.properties   # preencher com os seus dados
cd backend && mvn spring-boot:run    # API em :8080
cd frontend && cp .env.example .env && npm install && npm run dev   # Web em :5173
```

## Deploy em produção
1. **MySQL gerido:** cria uma instância MySQL 8 (Railway, Aiven, ou o fornecedor que preferires) e anota host, utilizador e palavra-passe. Confirma no fornecedor as condições do plano.
2. **Backend (Docker):** em Render, Railway ou Fly.io, cria um serviço a partir de `backend/Dockerfile` com as variáveis de `backend/.env.example` (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `CORS_ORIGINS`, `JWT_SECRET`, `ADMIN_EMAIL`, `MAIL_*`). O Flyway cria as tabelas no primeiro arranque.
3. **Frontend (Vercel):** importa o repositório, define *Root Directory* = `frontend`, framework Vite, e a variável `VITE_API_URL` com o URL público do backend.
4. Depois do deploy, atualiza `CORS_ORIGINS` no backend com o URL do Vercel.

## Decisões tomadas
- MySQL 8 em vez de PostgreSQL: `DECIMAL(12,2)` para dinheiro, `BOOLEAN` (TINYINT), `ENGINE=InnoDB`, `utf8mb4`, validações com `CHECK` (MySQL 8.0.16+).
- Hibernate com `ddl-auto=validate`: o esquema só muda por migrações Flyway.
- Fotos do BI nunca na BD nem no repositório: ficheiro em armazenamento privado, só o caminho na tabela.

## Pontos em aberto para a Sprint 1 (administração do catálogo)
Taxas de entrega e prazos por zona, lista real de produtos e preços, nome e logótipo da marca.
