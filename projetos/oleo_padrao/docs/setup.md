# ⚙️ Como rodar o ambiente

## 🧠 Visão geral

O sistema utiliza PostgreSQL como banco de dados.

Você pode rodar de duas formas:

---

## 🐳 Opção 1 — Docker (mais fácil)

Pré-requisito:
- Docker instalado

Rodar:

docker-compose up

Pronto. O banco estará disponível.

---

## 💻 Opção 2 — Sem Docker

1. Instale PostgreSQL
2. Crie um banco
3. Execute:

psql -U usuario -d banco -f infra/db/init.sql

---

## 🧪 Verificando

Você deve ver as tabelas:

- coletas
- pagamentos
- eventos
