# Vitrine ML5Lab

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Linguagem](https://img.shields.io/badge/linguagem-JavaScript-blue)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

Plataforma de ensino e tecnologia focada em cursos práticos, aulas particulares, e conexão entre profissionais e o mercado de trabalho.

---

## 🚀 Funcionalidades Planejadas

- **Cursos Livres:** Catálogo de cursos de tecnologia para estudo autônomo.
- **Aulas Particulares:** Plataforma para que professores possam ministrar aulas particulares.
- **Cursos para Escolas:** Cursos personalizados para instituições de ensino, gerenciados por um mantenedor.
- **Sistema de Créditos:** Aquisição e uso de créditos para acessar conteúdos e serviços.
- **Portal de Vagas:** Área para divulgação de vagas de emprego na área de tecnologia.
- **Monetização:** Exibição de propagandas como forma de monetização da plataforma.

---

## 🛠️ Estrutura do Projeto

O projeto está sendo refatorado para uma arquitetura de SPA (Single-Page Application) com clara separação de responsabilidades.

```
/vitrine-ml5/
├── src/               # Código-fonte da aplicação
│   ├── components/      # Componentes de UI reutilizáveis
│   ├── services/        # Lógica de negócio e APIs (ApiService, Router)
│   ├── models/          # Classes de domínio (Course, Lesson)
│   ├── pages/           # Módulos que renderizam cada página
│   └── ...
├── docs/              # Diagramas e documentação do projeto
├── index.html         # Ponto de entrada da SPA
└── package.json       # Dependências e scripts
```

---

## 🏁 Começando

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node.js)

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/ml5w3s/vitrine-ml5.git
   ```
2. Navegue até a pasta do projeto:
   ```sh
   cd vitrine-ml5
   ```
3. Instale as dependências (se houver):
   ```sh
   npm install
   ```

### Rodando o Projeto

Para iniciar o servidor de desenvolvimento local, execute:

```sh
npm start
```

Isso iniciará um servidor na porta `3000`. Abra [http://localhost:3000](http://localhost:3000) para ver o projeto.

*(Nota: Este comando irá futuramente executar o script definido em `package.json`, como `serve .`)*

### Rodando os Testes

Para executar a suíte de testes automatizados (a ser implementada com Jest), rode:

```sh
npm test
```

---

## 💻 Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, Vanilla JavaScript
- **Servidor de Dev:** [serve](https://www.npmjs.com/package/serve)
- **Testes (Planejado):** [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/)
- **Backend & Banco de Dados (Planejado):** [Firebase](https://firebase.google.com/)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o futuro arquivo `CONTRIBUTING.md` para mais detalhes sobre o processo.