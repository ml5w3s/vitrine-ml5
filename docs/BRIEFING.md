# Briefing do Projeto: mlab5

Bem-vindo(a) ao `mlab5`, "pessoa de carbono" ou "pessoa de silício"! Este documento serve como um guia rápido para entender a arquitetura, o fluxo de dados e as ferramentas de depuração do projeto.

## 1. Visão Geral do Projeto

O `mlab5` é uma Single-Page Application (SPA) para visualização de cursos online. O objetivo é fornecer um ambiente interativo para aprendizado, onde o conteúdo dos cursos é carregado dinamicamente.

## 2. Arquitetura Principal

O projeto segue uma arquitetura baseada em componentes, com responsabilidades bem definidas:

-   **`index.html`**: O ponto de entrada da aplicação. Carrega todos os scripts e CSS necessários.
-   **`Router.js`**: Gerencia a navegação baseada em hash (`#/`). Ele mapeia as URLs para as funções que renderizam as "Views" corretas.
-   **`ApiService.js`**: A camada de dados. É o único responsável por buscar e processar os dados dos cursos e aulas a partir dos arquivos JSON.
-   **Views (`/views`):** Funções que geram o HTML para cada "página" da aplicação (ex: `HomeView`, `CourseView`). Elas consomem os dados do `ApiService`.
-   **Models (`/models`):** Classes que representam nossas estruturas de dados (`Course`, `Lesson`). Elas garantem que os dados tenham uma estrutura consistente.
-   **Components (`/components`):** Partes reutilizáveis da UI com lógica própria (ex: `PlaygroundComponent`, `DebugView`).

### 2.1. Detalhes da Arquitetura e Fluxo de Dados

O projeto utiliza JavaScript puro e moderno (com `fetch` e `async/await`) para suas funcionalidades principais, sem depender de bibliotecas externas para a lógica central.

-   **`CourseRepository.js` (`mlab5/src/assets/js/repositories/CourseRepository.js`):** Esta é uma camada arquitetural crucial e indocumentada. Atua como um intermediário entre o `ApiService.js` (responsável pela busca de dados brutos) e o restante da aplicação. Sua função principal é transformar os dados brutos em modelos `Course` e `Lesson` estruturados, implementando o Padrão Repository.

-   **Modelos com Lógica de Renderização (`Course.js` e `Lesson.js` em `mlab5/src/assets/js/models/`):** Diferente de modelos puramente de dados, `Course.js` e `Lesson.js` contêm métodos `render()` complexos. Estes métodos são responsáveis por gerar o HTML correspondente aos modelos. Esta abordagem, que integra lógica de modelo e visualização, é um aspecto arquitetural importante. O método `render()` de `Lesson.js`, em particular, revela um esquema JSON detalhado e atualmente indocumentado para a estrutura de `aulas.json`.

## 3. Fluxo de Dados dos Cursos

Estabelecemos um padrão claro para a organização e carregamento do conteúdo dos cursos, visando automação e fácil manutenção.

1.  **Estrutura de Pastas:** Cada curso reside em sua própria pasta dentro de `mlab5/data/`.
    -   Exemplo: `mlab5/data/html5/`, `mlab5/data/jquery/`

2.  **Índice de Cursos (`courses.json`):**
    -   Localizado em `mlab5/data/courses.json`.
    -   Este arquivo é o **índice principal** de todos os cursos.
    -   **Importante:** Ele é **gerado automaticamente** e não deve ser editado manualmente. O processo de "build" (atualmente manual e assistido) lê os metadados de cada curso e gera este arquivo.

3.  **Metadados do Curso (`meta.json`):**
    -   Dentro de **cada pasta de curso**, deve existir um arquivo `meta.json`.
    -   Ele contém o título e a descrição principal do curso. É a fonte de verdade para o `courses.json`.

4.  **Conteúdo das Aulas (`aulas.json`):**
    -   Dentro de **cada pasta de curso**, deve existir um arquivo `aulas.json`.
    -   Este arquivo contém um array com o conteúdo detalhado de **todas as aulas** daquele curso.

## 4. Estratégia de Depuração ("Assistente de Depuração")

Para otimizar a depuração e economizar tokens, implementamos um sistema de log centralizado e uma UI de depuração.

-   **Módulo `Debug.js`:**
    -   Centraliza todo o logging. Use-o em vez de `console.log`.
    -   **Como usar:**
        -   `Debug.log('Grupo', 'Mensagem', dadosOpcionais)`: Para logs de fluxo geral.
        -   `Debug.error('Grupo', 'Mensagem de Erro', erroObjeto)`: Para registrar erros.
        -   `Debug.table('Grupo', 'Título', arrayDeDados)`: Para exibir dados complexos de forma legível no console.
    -   O "Grupo" (ex: 'Router', 'ApiService') cria seções organizadas no console.

-   **Painel Visual (`DebugView`):**
    -   Um painel flutuante aparece no canto inferior direito.
    -   **Atalho:** Pressione **`Ctrl+M`** para mostrar ou ocultar o painel.
    -   **O que ele mostra:**
        -   A rota que está sendo visualizada.
        -   O ID do último curso e/ou aula carregados.
        -   Um histórico dos últimos logs e erros.
    -   Isso fornece contexto imediato sobre o estado da aplicação sem a necessidade de inspecionar o console a fundo.

## 5. Workflow de Desenvolvimento

-   **Para adicionar um novo curso:**
    1.  Crie uma nova pasta em `mlab5/data/`.
    2.  Dentro dela, crie um `meta.json` com `title` e `description`.
    3.  Crie um `aulas.json` com o conteúdo das aulas.
    4.  Utilize a ferramenta interna `LessonCreatorView.js` (acessível via rota específica ou interface de administração) para auxiliar na criação e validação do conteúdo, e para regenerar o `courses.json` principal.

-   **Para depurar um problema:**
    1.  Abra o painel de depuração (`Ctrl+M`).
    2.  Navegue até a página com o problema e observe as informações no painel e os logs no console.
    3.  Adicione novas chamadas `Debug.log()` nos pontos suspeitos do código para obter mais detalhes.
