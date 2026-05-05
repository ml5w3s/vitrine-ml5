# 🧪 Guia de Teste Manual - MR. OLUC

Este guia orienta como subir o ambiente do projeto **Óleo Padrão** e realizar testes manuais simulando a operação do aplicativo MR. OLUC.

---

## 1. Subir a Infraestrutura (Banco de Dados)
Certifique-se de ter o Docker instalado e rodando.

1. Abra o terminal na raiz do projeto.
2. Execute o comando para subir os containers do PostgreSQL e Redis:
   ```bash
   cd infra/docker && docker compose up -d && cd ../..
   ```

## 2. Iniciar a API
A API é responsável por processar as coletas e salvar no banco.

1. Na raiz do projeto, instale as dependências (necessário apenas na primeira vez):
   ```bash
   npm install
   ```
2. Inicie a API em modo de desenvolvimento:
   ```bash
   npm run dev --workspace=services/api
   ```
   *Você verá a mensagem: `🚀 API Rodando em http://localhost:3001`*

## 3. Abrir o Simulador no Navegador
O simulador imita a tela do aplicativo de campo MR. OLUC.

1. Localize o arquivo `apps/simulator/index.html` no seu gerenciador de arquivos.
2. Abra este arquivo no seu navegador (Chrome ou Firefox recomendados).
   *Dica: Você pode simplesmente arrastar o arquivo para uma aba do navegador.*

---

## 4. Realizando um Teste de Coleta
Siga estes passos dentro do simulador:

1. **Dados do Fornecedor:** Preencha um Nome e um CPF/CNPJ (ex: `123.456.789-00`).
2. **Dados da Coleta:** Informe a quantidade de litros e o valor a pagar.
3. **Pagamento:** Escolha entre PIX, DINHEIRO ou CONTRATO. 
   *Note que se escolher PIX, campos adicionais aparecerão.*
4. **Finalizar:** Clique no botão **"Finalizar Coleta"**.

### Como saber se funcionou?
- No simulador: Uma mensagem de sucesso aparecerá na lista de "Últimas Coletas".
- No terminal da API: Você verá logs de `POST /v1/coletas 201`.

---

## 🏗️ Informações Técnicas e Persistência

### Onde os dados ficam guardados?
Os dados **não** são perdidos quando o computador é desligado ou quando o container é parado. 
- O Docker utiliza um **Volume** chamado `postgres_data`. 
- Isso significa que o banco de dados armazena as informações em uma pasta protegida no seu disco rígido, e não apenas na memória temporária do container.

### Reinicialização Automática
Os containers estão configurados com `restart: always`. Isso significa que:
- Se o computador for reiniciado, o Docker tentará subir o banco de dados automaticamente assim que o sistema iniciar.
- Você só precisará rodar `docker compose up -d` se alguém executar o comando `docker compose down` manualmente.

---

## 💾 Estratégia de Backup

Para garantir que os dados das coletas estejam seguros, recomendamos as seguintes práticas:

1. **Backup Rápido (Dump SQL):**
   Você pode gerar um arquivo `.sql` com todo o conteúdo do banco a qualquer momento rodando:
   ```bash
   docker exec oleo_postgres pg_dump -U user_oleo oleo_db > backup_coletas.sql
   ```
   *Guarde este arquivo em um local seguro (Cloud, HD Externo).*

2. **Backup do Volume:**
   Como os dados estão no volume do Docker, ferramentas de backup de sistema que salvam a pasta `/var/lib/docker/volumes` (no Linux) também protegerão o banco.

---

## 🛠️ Automação com GitHub (Builders)

O repositório está preparado para usar **GitHub Actions**. No contexto deste projeto:
- **Builders/CI:** Podem ser usados para verificar automaticamente se o código está correto e se o banco de dados "sobe" sem erros toda vez que alguém envia uma atualização.
- **Docker Images:** Podemos configurar o GitHub para "buildar" uma imagem pronta da nossa API, facilitando ainda mais a instalação para novos colaboradores no futuro.
