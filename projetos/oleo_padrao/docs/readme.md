# Logística Reversa Platform

Protótipo de sistema para gestão operacional e financeira de logística reversa de óleo lubrificante.

## 🎯 Objetivo

Construir uma arquitetura orientada a eventos onde:

- O APP simula a operação de campo (coletas e pagamentos)
- O backend processa e distribui eventos
- Sistemas externos (financeiro, BI, frota) serão integrados futuramente

## 🧠 Princípios

- Fonte única de verdade: operação
- Event-driven architecture
- Sem retrabalho manual
- Simplicidade primeiro, complexidade depois

## 🚧 Status

Fase inicial de prototipação (MVP em desenvolvimento)

## 📦 Estrutura

- `apps/simulator`: simulação da operação
- `services/api`: backend principal
- `packages/shared`: código compartilhado
- `infra`: infraestrutura local

## 🚀 Roadmap (curto prazo)

- [ ] Criar API básica
- [ ] Simular coleta
- [ ] Simular pagamento
- [ ] Implementar eventos
- [ ] Adicionar fila (BullMQ)

## 👨‍💻 Objetivo técnico

Validar arquitetura antes de integrar com sistemas reais como financeiro e frota.

## 📦 Estado atual do projeto

O sistema já possui:

- API inicial estruturada
- Banco de dados PostgreSQL modelado
- Estrutura de eventos definida

---

## 🗄️ Banco de dados

O banco foi modelado com base na operação de coletas e pagamentos.

- Script de criação: `infra/db/init.sql`
- Diagrama: `docs/databaseder.md`

---

## 🚀 Como rodar (modo simples)

### Opção 1 — Usando Docker (recomendado para devs)

docker-compose up

### Opção 2 — Sem Docker

- Instalar PostgreSQL local
- Executar script: `infra/db/init.sql`

---

## 📚 Documentação

- Arquitetura: `docs/architecture.md`
- Fluxos: `docs/flows.md`
- Eventos: `docs/events.md`
- Banco (DER): `docs/databaseder.md`
