# Contexto do projeto (para agentes de IA)

App web de encomendas: React + Tailwind (frontend, Vercel) e Spring Boot 3 + MySQL 8 (backend, Docker).
Documento completo: `docs/SISTEMA.docx`. Plano atual: `docs/SPRINT-0.md`.

## Arquitetura (camadas, padrão MVC)
`controller` (REST, DTOs) -> `service` (regras de negócio RN01-RN13) -> `repository` (Spring Data JPA) -> MySQL.
Pacotes: controller, service, repository, model, dto, mapper, config, exception, integration.
Nunca colocar regras de negócio em controllers nem expor entidades JPA na API (usar DTOs).

## Convenções
- Código em inglês nas classes, **tabelas e colunas em português** (ver migrações Flyway).
- Alterações à BD só por nova migração `V{n}__descricao.sql`. Nunca editar migrações já aplicadas.
- `spring.jpa.hibernate.ddl-auto=validate` (o Flyway manda no esquema).
- Segredos só por variáveis de ambiente. Nunca no repositório.
- Dados do BI são sensíveis: bucket privado, acesso só do admin, nunca em logs.
- Preço do item é copiado para `item_pedido` no momento da compra (RN03).
- Zonas de entrega iniciais: Maputo Cidade e Matola (RN04).

## Regras de trabalho do agente
- Contrato primeiro: atualizar o OpenAPI antes de implementar endpoints.
- Cada história inclui testes. Não fazer merge nem deploy sem aprovação humana.
- Definition of Done: testes a passar, regras RN cobertas, sem segredos, documentação atualizada.

## Catálogo e cálculo (v0.2)
- O admin cria produtos escolhendo a categoria, com preço, stock e foto (RF12, RN15, RN18). Fotos em armazenamento externo (Cloudinary/S3), nunca no disco do servidor.
- O cliente indica a quantidade e vê o total calculado (preço x quantidade). **O backend recalcula sempre o total** (RN14) e ignora valores vindos do navegador.
- Quantidade: inteiro >= 1 e <= stock (RN16). Stock reservado ao criar a encomenda (RN17, a confirmar).

## Decisões v0.3
- Stock descontado ao criar a encomenda e devolvido no cancelamento (RN17). Limite por encomenda: 10 por defeito (`MAX_QUANTITY_PER_ORDER`), ou `produto.quantidade_maxima` (RN16).
- Fotos no Cloudinary (`STORAGE=cloudinary`); `local` só em desenvolvimento. Sem subtipos de categoria (usar `produto.tipo_modelo`).
- Entidades com Lombok; DTOs como `record`; erros devolvidos como `{"erro": "...", "campos": {...}}`.

## Segredos
Nunca colocar palavras-passe, chaves ou URLs com credenciais em ficheiros versionados. Usar `backend/config/secrets.properties` (ignorado pelo Git) ou variáveis de ambiente. Ver `docs/SEGREDOS.md`.
