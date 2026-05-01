# Arquitetura e Padrões de Projeto

Este documento define a estratégia técnica para o sistema de logística reversa. O objetivo é criar um sistema **orientado a eventos**, **distribuído** e **resiliente**.

---

## 🎯 Princípios Fundamentais
*   **Dado Único:** O dado nasce uma vez e é propagado automaticamente.
*   **Desacoplamento:** Componentes não conhecem a implementação um do outro.
*   **Consistência:** Garantia de que ações no banco de dados e eventos na fila estejam sincronizados.

---

## 🧩 1. Estrutura e Fluxo (Event-Driven Architecture)
O sistema é baseado em fatos (eventos) que representam mudanças de estado no negócio.
*   **Fluxo:** `Simulator App` → `API` → `Evento` → `Fila (BullMQ)` → `Workers` → `Integrações`.
*   **Eventos Principais:** `coleta_criada`, `coleta_finalizada`, `pagamento_confirmado`.

---

## 🧱 2. Padrões de Confiabilidade (Essenciais)

### 🚀 Outbox Pattern
Para evitar inconsistência entre Banco de Dados e Fila.
*   **Como:** O evento é salvo em uma tabela `outbox` dentro da mesma transação do banco de dados. Um worker dedicado lê essa tabela e publica na fila (Redis).
*   **Benefício:** Se o banco salvar, o evento é garantido. Se o banco falhar, o evento não é disparado.

### 🧪 Idempotency Pattern
Evita processamento duplicado de eventos.
*   **Como:** Cada operação possui uma `id_operacao` única. O consumidor verifica se aquele ID já foi processado antes de agir.
*   **Benefício:** Segurança total em retentativas de fila e pagamentos Pix.

---

## 🔌 3. Padrões de Design e Código

### 🏗️ Service Layer & Repository
Separação clara de responsabilidades para evitar código "espaguete".
*   **Controller:** Apenas entrada/saída (HTTP).
*   **Service:** Onde reside a regra de negócio e orquestração.
*   **Repository:** Abstração total do banco de dados.

### 🔌 Adapter Pattern
Protege o core do sistema contra mudanças em APIs externas (Financeiro, BI, Frota).
*   **Interface:** `FinanceService.createTransaction()`.
*   **Implementações:** `ContaAzulAdapter`, `FaturamentoLocalAdapter`.

---

## 🛡️ 4. Resiliência e Evolução

### 🧯 Retry + Dead Letter Queue (DLQ)
*   **Retry:** Retentativa exponencial em caso de falhas temporárias (ex: API externa fora do ar).
*   **DLQ:** Se todas as tentativas falharem, o evento vai para uma fila de erro para análise manual.

### 🧭 Domain Events
Os eventos não são apenas "mensagens técnicas", eles refletem a linguagem do negócio.

### 🔄 Saga Pattern (Evolução)
Para processos de longa duração que envolvem múltiplas etapas (Coleta -> Pagamento -> Conciliação).

---

## 📦 5. Escala (Futuro)
*   **CQRS:** Separação entre modelos de Escrita (Operacional) e Leitura (BI/Dashboards).
