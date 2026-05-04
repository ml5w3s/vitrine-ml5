# Briefing de Handover - Projeto Óleo Padrão

## 📌 Status Atual: Walking Skeleton Concluído
O projeto atingiu o marco de "Esqueleto Funcional" (end-to-end), integrando Frontend, API e Banco de Dados.

### O que já está implementado:
1.  **Shared (@oleo/shared)**: Interfaces TS e DTOs definidos para Coletas e Eventos.
2.  **Infra**: Docker Compose com PostgreSQL 15 e Redis 7. Script `init.sql` com tabelas de `coletas`, `pagamentos` e `outbox`.
3.  **API (@oleo/api)**: 
    - Framework: Fastify.
    - Padrões: Repository/Service/Controller.
    - **Outbox Pattern**: Transação atômica salva Coleta + Evento.
    - **Idempotency**: Verificação de `id_operacao` antes de processar.
    - **CORS**: Habilitado para comunicação com o simulador.
4.  **Simulador (Frontend)**: Interface Vanilla JS/CSS para registro de coletas.
5.  **GitHub Actions**: Workflow de validação de banco pronto para ser ativado na raiz.

## 🚀 Como Continuar:
1.  **Testar o Fluxo**: 
    - Subir containers (`infra/docker/docker-compose.up -d`).
    - Rodar API (`services/api/npm run dev`).
    - Abrir `apps/simulator/index.html` e testar registro.
2.  **Próxima Grande Task**: Implementar o **Outbox Worker** (consumir a tabela `outbox` e enviar para o BullMQ/Redis).
3.  **Ambiente**: O projeto usa npm workspaces. Rodar `npm install` na raiz para linkar os pacotes.

## ⚠️ Observações de Infra:
- Porta da API: `3001`
- Porta do DB: `5432`
- O arquivo `test-api.sh` na raiz é a forma mais rápida de validar o backend.
