# Proposta de Estrutura de Diretórios

Esta estrutura organiza o projeto seguindo o padrão de SPA (Single-Page Application), separando as responsabilidades do código-fonte (`src`) em subpastas específicas.

- **`dist/`**: Pasta para arquivos de produção (gerados por um processo de build).
- **`src/`**: Código-fonte da aplicação.
  - **`components/`**: Componentes de UI reutilizáveis (header, footer, card, etc.).
  - **`services/`**: Lógica de negócio e comunicação externa (API, Roteamento, Autenticação).
  - **`models/`**: As classes que representam os dados da aplicação (Curso, Aula, Usuário).
  - **`pages/`**: Módulos responsáveis por controlar e renderizar cada "página".
  - **`assets/`**: Arquivos estáticos como imagens e CSS global.
  - **`data/`**: Arquivos de dados brutos (JSONs).
  - **`index.js`**: Ponto de entrada principal da aplicação que inicializa tudo.
- **`index.html`**: O único arquivo HTML principal.
- **`package.json`**: Para gerenciar dependências.

```
/vitrine-ml5/
├── dist/
├── src/
│   ├── components/
│   │   ├── course-card/
│   │   │   ├── course-card.html
│   │   │   └── course-card.css
│   │   └── ...
│   ├── services/
│   │   ├── ApiService.js
│   │   ├── AuthService.js
│   │   └── Router.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lesson.js
│   ├── pages/
│   │   ├── course-list-page/
│   │   └── lesson-page/
│   ├── assets/
│   │   ├── css/
│   │   └── images/
│   ├── data/
│   │   └── ...
│   └── index.js
│
├── index.html
└── package.json
```
