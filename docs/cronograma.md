# Cronograma de Desenvolvimento e Fluxo de Trabalho

Este cronograma descreve um fluxo de trabalho para o desenvolvimento do projeto `mlab5` por equipes independentes, minimizando dependências e garantindo a entrega de aulas renderizadas com componentes funcionais.

## Princípios Fundamentais:

*   **Contratos Claros:** Todas as interfaces (APIs, eventos, estruturas de dados) entre as equipes devem ser definidas e acordadas *antes* do início do desenvolvimento.
*   **Mocking:** O uso extensivo de dados e serviços mockados é essencial para permitir o desenvolvimento paralelo.
*   **Comunicação Constante:** Reuniões regulares de sincronização entre as equipes são vitais para resolver impedimentos e garantir o alinhamento.
*   **Desenvolvimento Iterativo:** Cada fase pode ter mini-iterações para refinar e testar.

## Fases do Fluxo de Trabalho:

### Fase 1: Definição de Contratos e Setup da Fundação (Sprints 1-2)

**Objetivo:** Estabelecer a base arquitetural e os contratos de comunicação entre as equipes.

*   **Equipe de Infraestrutura:**
    *   Finalizar `index.html` minimalista, `app.js` (ponto de entrada) e `style.css` (CSS global).
    *   Implementar o `Router.js` com rotas de placeholder.
    *   Implementar o `EventBus.js` (padrão Observer) e definir sua API (métodos `subscribe`, `publish`).
    *   Implementar o `Debug.js` e `DebugView` básicos.
    *   Definir a estrutura de diretórios final.
*   **Equipe de Gerenciamento de Dados:**
    *   Definir os **esquemas JSON finais** para `courses.json`, `meta.json` e `aulas.json`.
    *   Definir os **eventos** que o `CourseRepository` publicará (ex: `courseIndexLoaded`, `courseDataLoaded`, `lessonDataLoaded`) e a estrutura dos dados desses eventos.
    *   Criar **dados mockados** para `courses.json`, `meta.json` e `aulas.json` que sigam os esquemas definidos.
*   **Equipes de UI / Funcionalidades:**
    *   Revisar os esquemas JSON e os contratos de eventos.
    *   Começar a prototipar componentes básicos com dados mockados locais.
*   **Equipe de Ferramenta de Criação de Conteúdo:**
    *   Revisar os esquemas JSON.
    *   Começar a planejar a UI da ferramenta.

**Entregáveis da Fase 1:**
*   `index.html`, `app.js`, `style.css`, `Router.js`, `EventBus.js`, `Debug.js`, `DebugView` (básicos e funcionais).
*   Esquemas JSON documentados.
*   Contratos de eventos documentados.
*   Dados mockados para todos os JSONs.
*   Estrutura de diretórios implementada.

### Fase 2: Desenvolvimento Paralelo com Mocking (Sprints 3-6)

**Objetivo:** Desenvolver as funcionalidades principais de cada equipe de forma independente, utilizando os contratos e mocks.

*   **Equipe de Infraestrutura:**
    *   Refinar o `Router.js` para lidar com parâmetros de rota.
    *   Otimizar o `EventBus.js` e `Debug.js`.
*   **Equipe de Gerenciamento de Dados:**
    *   Implementar `ApiService.js` para buscar os dados mockados (inicialmente) e depois os reais.
    *   Implementar `CourseRepository.js` para transformar os dados e **publicar os eventos definidos** no `EventBus`.
    *   Desenvolver os modelos `Course.js` e `Lesson.js` com seus métodos `render()`.
*   **Equipes de UI / Funcionalidades:**
    *   Desenvolver as Views (`HomeView`, `CourseView`) e Componentes.
    *   **Assinar os eventos** publicados pelo `CourseRepository` (usando o `EventBus`) para reagir a mudanças de dados.
    *   Utilizar os dados mockados fornecidos pela Equipe de Gerenciamento de Dados para o desenvolvimento e testes iniciais.
    *   Integrar os componentes nas Views.
*   **Equipe de Ferramenta de Criação de Conteúdo:**
    *   Desenvolver a UI e a lógica do `LessonCreatorView.js` para criar e editar `meta.json` e `aulas.json`.
    *   Implementar a lógica para gerar/atualizar `courses.json` a partir dos dados criados.
    *   Utilizar os esquemas JSON para validação.

**Entregáveis da Fase 2:**
*   `ApiService.js`, `CourseRepository.js`, `Course.js`, `Lesson.js` (funcionais com dados mockados/reais).
*   Views e Componentes da UI (funcionais com dados mockados).
*   `LessonCreatorView.js` (funcional para criação de conteúdo).

### Fase 3: Integração e Testes (Sprints 7-8)

**Objetivo:** Integrar as partes desenvolvidas e realizar testes completos.

*   **Todas as Equipes:**
    *   Substituir dados mockados por dados reais (se ainda não o fizeram).
    *   Realizar testes de integração entre os módulos.
    *   Testar o fluxo completo: desde a criação de conteúdo, passando pelo carregamento de dados, até a renderização das aulas na UI.
    *   Resolver bugs e ajustar interfaces conforme necessário.
    *   Otimização de performance e experiência do usuário.

**Entregáveis da Fase 3:**
*   Aplicação `mlab5` totalmente integrada e funcional.
*   Aulas renderizadas corretamente com componentes interativos.
*   Ferramenta de criação de conteúdo funcional.
*   Relatórios de testes e bugs corrigidos.
