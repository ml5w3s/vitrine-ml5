# Diagrama Entidade-Relacionamento (DER) - Óleo Padrão

Este diagrama utiliza a sintaxe [Mermaid.js](https://mermaid.js.org/) para representar a estrutura do banco de dados definida em `infra/db/init.sql`.

```mermaid
erDiagram
    COLETAS ||--o| PAGAMENTOS : "possui"
    COLETAS {
        uuid id PK
        varchar id_operacao UK "Chave de Idempotência"
        uuid cliente_id
        decimal volume_estimado
        decimal volume_coletado
        varchar status "pendente, finalizada, cancelada"
        timestamp criado_at
        timestamp atualizado_at
    }

    OUTBOX {
        uuid id PK
        varchar event_type
        jsonb payload
        varchar status "pendente, processado, falha"
        timestamp criado_at
        timestamp processado_at
    }

    PAGAMENTOS {
        uuid id PK
        uuid coleta_id FK
        decimal valor
        varchar metodo "pix"
        text comprovante_url
        varchar status "confirmado"
        timestamp confirmado_at
    }
```

## Descrição das Tabelas

### 1. Coletas
Armazena o estado operacional das coletas em campo. O campo `id_operacao` é vital para garantir que a mesma operação enviada pelo app não seja processada duas vezes.

### 2. Pagamentos
Registra a transação financeira vinculada a uma coleta. Atualmente simplificado para focar em fluxos de Pix.

### 3. Outbox
Peça central da arquitetura orientada a eventos. Garante a entrega de mensagens (at-least-once delivery) ao persistir o evento na mesma transação que a regra de negócio.
