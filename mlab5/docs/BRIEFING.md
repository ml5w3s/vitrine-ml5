# Briefing do Projeto: Vitrine ML5

Bem-vindo(a) ao `vitrine-ml5`! Este documento serve como um guia rápido para entender a arquitetura geral do projeto, a organização dos módulos e o fluxo de dados do principal componente, o `mlab5`.

## 1. Visão Geral do Projeto

O `vitrine-ml5` é um portal que serve como uma vitrine para diversos projetos e experimentos de desenvolvimento web. Ele não é uma Single-Page Application (SPA) única, mas um contêiner para vários subprojetos, cada um com sua própria estrutura e propósito.

## 2. Estrutura de Diretórios Principal

O projeto está organizado de forma modular na raiz:

-   **`index.html`**: O ponto de entrada principal, a "vitrine" que apresenta os demais projetos.
-   **`estilo/`**: Contém os arquivos CSS globais (`portal.css`, `styles.css`) que estilizam a página principal.
-   **`assets/`**: Armazena recursos globais como scripts (`app.js`, `controller.js`) e imagens.
-   **`docs/`**: Toda a documentação do projeto, incluindo este `BRIEFING.md`.
-   **`academy/`**: Um subprojeto completo, com seu próprio `index.html`, estilos, imagens e componentes, como o calendário (`calendario2025/`) e um To-Do List (`todolist/`).
-   **`mlab5/`**: O subprojeto mais complexo, focado em ser uma plataforma de visualização de cursos online. Seus detalhes estão descritos abaixo.
-   **`projetos/`**: Outra seção para abrigar projetos menores ou em desenvolvimento, como a `lousa/`.

---

## 3. Detalhes do Módulo `mlab5`

O `mlab5` funciona como uma SPA para visualização de cursos. Sua lógica foi refatorada para uma estrutura modular e moderna, localizada principalmente dentro do diretório `mlab5/src/`.

-   **`mlab5/index.html`**: O ponto de entrada da aplicação de cursos.
-   **`mlab5/src/main.js`**: O coração da aplicação. É responsável por inicializar o roteador, gerenciar os eventos e orquestrar a navegação e a renderização de conteúdo.
-   **`mlab5/style.css`**: Folha de estilos específica para o `mlab5`.
-   **`mlab5/data/`**: Diretório fundamental que contém os dados de todos os cursos, seguindo uma estrutura bem definida.
-   **`mlab5/src/`**: Contém todo o código-fonte da aplicação, organizado em subdiretórios como:
    -   `components/`: Componentes de UI reutilizáveis.
    -   `services/`: Serviços, como o `ApiService` para buscar dados.
    -   `repositories/`: Camada de acesso a dados.
    -   `router/`: Lógica de roteamento.
    -   `models/`: Modelos de dados da aplicação.
    -   `views/`: Lógica de renderização para diferentes partes da UI.

### 3.1. Fluxo de Dados dos Cursos no `mlab5`

O conteúdo dos cursos é carregado dinamicamente, visando automação e fácil manutenção.

1.  **Estrutura de Pastas:** Cada curso reside em sua própria pasta dentro de `mlab5/data/`.
    -   Exemplo: `mlab5/data/html5/`, `mlab5/data/jquery/`

2.  **Índice de Cursos (`courses.json`):**
    -   Localizado em `mlab5/data/courses.json`.
    -   Este arquivo é o **índice principal** de todos os cursos disponíveis.
    -   **Importante:** Ele é projetado para ser **gerado automaticamente** e não deve ser editado manualmente. Um processo de build (atualmente manual ou assistido) lê os metadados de cada curso para gerar este arquivo.

3.  **Metadados do Curso (`meta.json`):**
    -   Dentro de **cada pasta de curso**, deve existir um arquivo `meta.json`.
    -   Ele contém o título e a descrição daquele curso, servindo como fonte da verdade para a geração do `courses.json`.

4.  **Conteúdo das Aulas (`aulas.json`):**
    -   Dentro de **cada pasta de curso**, um arquivo `aulas.json` contém um array com o conteúdo detalhado de **todas as aulas** daquele curso.

### 3.2. Arquitetura e Lógica Interna do `mlab5`

A lógica da aplicação segue um design modular e orientado a componentes, organizado dentro da pasta `src`.

-   **`main.js`**: Orquestra a inicialização da aplicação, configurando o roteador e os serviços principais.
-   **Camada de Serviços (`services/`):** O `ApiService` é responsável por toda a comunicação com a "API" de arquivos locais, buscando os dados dos cursos nos arquivos JSON.
-   **Camada de Repositório (`repositories/`):** Atua como um intermediário para buscar os dados brutos dos serviços e transformá-los em modelos estruturados (ex: `Course`, `Lesson`).
-   **Roteamento (`router/`):** O `Router` intercepta cliques em links e dispara eventos de mudança de rota, permitindo a navegação no estilo SPA.
-   **Views (`views/`):** Componentes responsáveis por receber os dados dos modelos e renderizar o HTML correspondente no DOM.

## 4. Estratégia de Depuração (Legado)

Para otimizar a depuração no `mlab5`, foi implementado um sistema de log e uma UI de depuração. Embora os arquivos não estejam visíveis na estrutura atual, o conceito permanece relevante:

-   **Módulo de Log (`Debug.js`):** A ideia era centralizar todo o logging (`Debug.log`, `Debug.error`) para criar saídas organizadas no console, agrupadas por componente (ex: 'Router', 'ApiService').
-   **Painel Visual (`DebugView`):** Um painel flutuante (atalho: `Ctrl+M`) foi criado para exibir informações de estado em tempo real, como a rota atual, o último curso carregado e um histórico de logs, reduzindo a necessidade de inspecionar o console constantemente.

## 5. Workflow de Desenvolvimento (para o `mlab5`)

-   **Para adicionar um novo curso:**
    1.  Crie uma nova pasta em `mlab5/data/`.
    2.  Dentro dela, crie um `meta.json` com `title` e `description`.
    3.  Crie um `aulas.json` com o conteúdo das aulas.
    4.  Execute a ferramenta ou script de build para regenerar o `courses.json` principal.

-   **Para depurar um problema no `mlab5`:**
    1.  Verifique se o painel de depuração (`Ctrl+M`) está ativo.
    2.  Navegue até a página com o problema e observe o painel e os logs no console.
    3.  Se necessário, adicione novas chamadas de log nos pontos suspeitos do código, principalmente em `mlab5/src/main.js` e nos arquivos dentro de `mlab5/src/`, para obter mais detalhes.