# Briefing de Handover - Projeto Óleo Padrão

## 📌 Status Atual: Alinhamento MR. OLUC Concluído
O projeto evoluiu do esqueleto funcional para um protótipo rico e fiel à operação real do aplicativo **MR. OLUC**. A integração Frontend -> API -> Banco de Dados está validada com campos reais.

### O que já está implementado:
1.  **Shared (@oleo/shared)**: 
    - Interfaces para **Fornecedores** e **Coletas** expandidas.
    - Suporte a múltiplos métodos de pagamento (PIX, DINHEIRO, CONTRATO).
    - Campos logísticos: Litros coletados, Valor, PIX 1/2, Número Início/Fim, CCO, etc.
2.  **Infra**: 
    - Docker Compose (Postgres 15, Redis 7) com persistência via volumes.
    - Script `init.sql` atualizado com as novas tabelas e índices de performance.
3.  **API (@oleo/api)**: 
    - **Fastify v5**: Servindo arquivos estáticos do simulador em `http://localhost:3001`.
    - **Entidade Fornecedor**: Repositório e Controller para gestão de fornecedores.
    - **Outbox Pattern**: Transação atômica que salva a Coleta rica + Evento de integração.
    - **Idempotência**: Mantida via prefixo `MR-` no ID de operação.
4.  **Simulador (Frontend)**: 
    - Interface renovada em cards imitando o fluxo do app de campo.
    - Automação: Identifica/Cria fornecedor automaticamente ao registrar coleta.
5.  **Documentação**: 
    - `docs/manual_testing.md`: Guia passo a passo para novos colaboradores.
    - `docs/tela_coleta_mroluc.txt`: Referência da transcrição original.

## 🚀 Como Continuar:
1.  **Testar o Fluxo Único**: 
    - Subir containers (`cd infra/docker && docker compose up -d`).
    - Rodar API (`npm run dev --workspace=services/api`).
    - Acessar diretamente **`http://localhost:3001`**.
2.  **Próxima Grande Task**: Implementar o **Outbox Worker**.
    - Objetivo: Um serviço separado (ou thread) que consome a tabela `outbox` e publica no Redis/BullMQ.
    - Os eventos agora possuem payloads ricos (ID Coleta, Fornecedor, Valor).
3.  **Validação**: O script `./test-api.sh` foi atualizado para o novo fluxo MR. OLUC.

## ⚠️ Observações Técnicas:
- **Porta Unificada**: 3001 (API + Frontend).
- **Persistência**: Os dados ficam no volume `docker_postgres_data`.
- **Backup**: Use `docker exec oleo_postgres pg_dump ...` conforme guia de testes.
