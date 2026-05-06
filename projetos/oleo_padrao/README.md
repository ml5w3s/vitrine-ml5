# Logística Reversa Platform - Projeto Óleo Padrão

Protótipo de sistema para gestão operacional e financeira de logística reversa de óleo lubrificante, alinhado à operação real **MR. OLUC**.

## 📌 Status Atual: Protótipo Rico Validado
O sistema evoluiu para um protótipo fiel à operação real. A integração Frontend -> API -> Banco de Dados está validada com campos logísticos reais.

### O que já está implementado:
- **Simulador (Frontend)**: Interface renovada em cards imitando o fluxo do app de campo, com identificação/criação automática de fornecedores.
- **API (@oleo/api)**: Fastify v5 servindo arquivos estáticos e processando coletas ricas com **Outbox Pattern**.
- **Infra**: Docker Compose (Postgres 15, Redis 7) com persistência e esquemas atualizados.
- **Shared (@oleo/shared)**: Contratos de dados expandidos para suportar múltiplos métodos de pagamento (PIX, Dinheiro, Contrato).

## 🚀 Como Rodar

### 1. Subir a Infraestrutura
```bash
cd infra/docker
docker compose up -d
```

### 2. Iniciar a API e Simulador
```bash
# Na raiz do projeto
npm install
npm run dev --workspace=services/api
```
Acesse: **http://localhost:3001** (API + Simulador unificados)

## 🛠 Arquitetura e Princípios
- **Outbox Pattern**: Garante atomicidade entre a persistência da coleta e a emissão de eventos.
- **Idempotência**: Operações marcadas com prefixo `MR-` para evitar duplicidade.
- **Event-Driven**: Base para futuras integrações com sistemas de BI, Financeiro e Frota.

## 🚀 Roadmap (Próximos Passos)
- [ ] **Outbox Worker**: Implementar o serviço que consome a tabela `outbox` e publica no Redis.
- [ ] **Mensageria**: Integrar BullMQ para processamento de filas.
- [ ] **Testes Automatizados**: Expandir a cobertura de integração para o fluxo completo.

## 📚 Documentação Detalhada
- [Handover e Status Atual](docs/handover.md)
- [Guia de Testes Manuais](docs/manual_testing.md)
- [Arquitetura](docs/architecture.md)
- [Modelagem de Dados](docs/database_der.md)

---
*Este projeto faz parte do ecossistema Vitrine ML5.*
