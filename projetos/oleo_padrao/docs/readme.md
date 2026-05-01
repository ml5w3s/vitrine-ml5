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
