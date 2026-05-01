# Arquitetura (Visão Inicial)

## Modelo

Sistema orientado a eventos.

## Fluxo principal

APP (simulador) → API → Evento → Fila → Workers → Integrações

## Eventos principais

- coleta_criada
- coleta_finalizada
- pagamento_confirmado

## Objetivo

Garantir que o dado:

- nasce uma vez
- é distribuído automaticamente
- não precisa ser digitado novamente

## Observações

Integrações reais (financeiro, frota) serão adicionadas após validação do fluxo.
