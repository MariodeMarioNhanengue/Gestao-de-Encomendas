# Onde ficam os dados sensíveis

| Ficheiro | No Git? | Conteúdo |
|---|---|---|
| `backend/config/secrets.properties` | **Não** (.gitignore) | Dados da base de dados, `app.jwt-secret`, admin inicial, Cloudinary, email. Carregado automaticamente se existir (`spring.config.import`). |
| `backend/config/secrets.properties.example` | Sim | Modelo sem valores reais. |
| `.env` (raiz) | **Não** | Palavras-passe do MySQL do `docker-compose.yml`. |
| `.env.example` | Sim | Modelo do `.env`. |
| `backend/.env.example` | Sim | Lista das variáveis de ambiente de **produção** (Render/Railway). Em produção não se usa ficheiro: os valores ficam nas variáveis do serviço. |

O Spring Boot dá prioridade às variáveis de ambiente sobre o `secrets.properties`, por isso o mesmo código funciona em local e em produção.

## Se já fez commit com palavras-passe
O `.gitignore` não apaga o que já foi para o histórico. Faça:
```bash
git rm --cached backend/config/secrets.properties .env
git commit -m "Remover segredos do controlo de versões"
```
e **mude as palavras-passe** (base de dados, JWT, Cloudinary), pois as antigas continuam no histórico. Se o repositório for público, considere reescrever o histórico (git filter-repo).
