# Análise da Aplicação "mlab5"

Este documento descreve a arquitetura e o funcionamento da aplicação de página única (SPA) encontrada no diretório `mlab5/`.

## Visão Geral

A `mlab5` é uma aplicação web projetada como uma vitrine ou plataforma para cursos de programação. Ela permite que os usuários naveguem por uma lista de cursos, visualizem as aulas disponíveis para cada um e acessem o conteúdo específico de cada aula.

A aplicação é construída utilizando tecnologias web padrão, sem depender de frameworks de grande porte como React, Angular ou Vue.

## Arquitetura e Tecnologia

- **Tipo:** SPA (Single Page Application).
- **Linguagem Principal:** JavaScript (ES6+), utilizando módulos (`import`/`export`).
- **Estrutura:** HTML5.
- **Estilização:** CSS3.
- **Fonte de Dados:** O conteúdo (cursos, aulas, etc.) é carregado dinamicamente a partir de arquivos JSON locais.

## Estrutura de Arquivos Essenciais

- **`mlab5/index.html`**: O ponto de entrada da aplicação. É um arquivo HTML simples que contém o elemento raiz `<main id="app-root">` onde todo o conteúdo dinâmico é renderizado. Ele também carrega o script principal.

- **`mlab5/app.js`**: O coração da aplicação. Este script é o ponto de entrada do JavaScript e é responsável por:
    - Inicializar o roteador.
    - Definir as rotas da aplicação (ex: `#/courses`, `#/course/:id`).
    - Buscar os dados dos arquivos JSON.
    - Chamar as funções que renderizam as diferentes telas (views).

- **`mlab5/data/`**: Diretório que armazena os dados da aplicação no formato JSON.
    - `courses.json`: Contém a lista de todos os cursos disponíveis, com seus metadados (título, descrição, imagem).
    - `data/<nome-do-curso>/aulas.json`: Para cada curso, existe um arquivo `aulas.json` que detalha o conteúdo de suas respectivas aulas.

- **`mlab5/src/js/router/Router.js`**: Um roteador personalizado baseado em hash (`#`). Ele monitora as mudanças na URL e aciona a função de renderização correspondente à rota acessada.

- **`mlab5/style.css`**: A folha de estilos principal que define a aparência da aplicação.

## Fluxo de Funcionamento

1.  **Carregamento Inicial:** O usuário acessa `mlab5/index.html`. O navegador carrega a estrutura HTML básica e o script `app.js`.
2.  **Inicialização do Roteador:** `app.js` instancia o `Router`, que passa a ouvir as mudanças de hash na URL. A rota inicial (geralmente `#/home` ou `#/`) é processada.
3.  **Renderização da View:** Com base na rota, uma função de renderização é executada.
    - Se a rota for `#/courses`, `app.js` faz uma requisição `fetch` para `data/courses.json`.
    - Com os dados recebidos, ele gera o HTML da lista de cursos e o insere no elemento `<main id="app-root">`.
4.  **Navegação do Usuário:** Quando o usuário clica em um link (ex: "Ver Detalhes" de um curso), a URL muda (ex: para `#/course/html5`).
5.  **Mudança de Rota:** O roteador detecta a mudança e chama a função associada a `#/course/:courseId`.
6.  **Carregamento de Dados Específicos:** A função de renderização da página do curso faz um `fetch` para o arquivo JSON correspondente (ex: `data/html5/aulas.json`).
7.  **Renderização da Nova View:** O conteúdo das aulas do curso é renderizado e exibido na tela, substituindo o conteúdo anterior, tudo sem a necessidade de recarregar a página.
