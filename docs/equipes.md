# Divisão do Projeto em Equipes

Este documento descreve uma sugestão de como o projeto `mlab5` poderia ser desmembrado em partes independentes, permitindo que diferentes equipes trabalhem em paralelo. A implementação do padrão Observer (com um `EventBus`) é crucial para o desacoplamento entre essas equipes.

## 1. Equipe de Infraestrutura / Fundação (Core Infrastructure Team)

*   **Responsabilidades:**
    *   **Ponto de Entrada (`index.html`, `app.js`):** Configuração inicial da aplicação, carregamento global, tratamento de erros de alto nível e bootstrapping.
    *   **Roteamento (`Router.js`):** Implementação e manutenção do mecanismo de roteamento (baseado em hash).
    *   **Barramento de Eventos (`EventBus.js`):** Desenvolvimento e manutenção do sistema central de eventos para o padrão Observer.
    *   **Módulos de Utilitários (`Debug.js`, etc.):** Funções utilitárias essenciais e o sistema de depuração.
    *   **Configuração de Build/Deploy:** (Se houver) Configuração de ferramentas de build e pipelines de deploy.
*   **Dependências:** Mínimas dependências externas. Fornece serviços fundamentais para as outras equipes.

## 2. Equipe de Gerenciamento de Dados (Data Management Team)

*   **Responsabilidades:**
    *   **Serviço de API (`ApiService.js`):** Responsável por toda a busca de dados brutos dos arquivos JSON.
    *   **Repositório de Cursos (`CourseRepository.js`):** Transformação dos dados brutos da API em modelos `Course` e `Lesson` estruturados. Publicação de eventos relacionados a dados via o `EventBus` (ex: `courseLoaded`, `lessonUpdated`).
    *   **Modelos de Dados (`Course.js`, `Lesson.js`):** Definição da estrutura e lógica central dos modelos de dados, incluindo seus métodos `render()`.
    *   **Definição da Estrutura de Dados:** Definição e manutenção dos esquemas JSON para `courses.json`, `meta.json` e `aulas.json`.
*   **Dependências:** Depende da Equipe de Infraestrutura (Event Bus). Fornece dados para as Equipes de UI/Funcionalidades.

## 3. Equipes de UI / Funcionalidades (UI / Feature Teams - pode haver mais de uma)

*   **Responsabilidades:**
    *   **Views (`HomeView`, `CourseView`, etc.):** Desenvolvimento das principais "páginas" da aplicação. Essas Views assinariam eventos de dados da Equipe de Gerenciamento de Dados e usariam componentes para renderizar a interface.
    *   **Componentes (ex: `PlaygroundComponent`, `DebugView`):** Desenvolvimento de elementos de UI reutilizáveis com sua própria lógica e estilização.
    *   **Estilização (`mlab5/src/css/` e `style.css`):** Implementação do design visual e estilização para suas respectivas Views e Componentes.
*   **Dependências:** Depende da Equipe de Infraestrutura (Router, Event Bus) e da Equipe de Gerenciamento de Dados (Course Repository, Modelos).

## 4. Equipe de Ferramenta de Criação de Conteúdo (Content Creation Tool Team)

*   **Responsabilidades:**
    *   **View do Criador de Aulas (`LessonCreatorView.js`):** Desenvolvimento da ferramenta interna para criar e validar o conteúdo dos cursos (`meta.json`, `aulas.json`).
    *   **Lógica de Geração de Conteúdo:** Implementação da lógica para regenerar o `courses.json` com base nos dados dos cursos individuais.
    *   **UI para Gerenciamento de Conteúdo:** A interface do usuário para os criadores de conteúdo.
*   **Dependências:** Depende da Equipe de Infraestrutura (Event Bus, potencialmente Router se for uma View roteada) e da Equipe de Gerenciamento de Dados (para entender as estruturas de dados). Esta equipe também pode interagir com a Equipe de Gerenciamento de Dados para garantir a consistência dos formatos de dados.

## Como as equipes podem trabalhar independentemente:

*   **Interfaces Claras:** Cada equipe definiria interfaces claras (contratos de API) para como seus módulos interagem. Por exemplo, a Equipe de Gerenciamento de Dados definiria os eventos que publica e a estrutura dos dados dentro desses eventos.
*   **Comunicação Orientada a Eventos:** O padrão Observer (via `EventBus.js`) é a chave aqui. As equipes não precisam conhecer os detalhes de implementação interna dos módulos de outras equipes; elas só precisam saber quais eventos publicar e quais eventos assinar.
*   **Mocking:** As equipes podem "mockar" as dependências de outras equipes. A equipe de UI pode mockar eventos de dados da equipe de Gerenciamento de Dados para desenvolver suas Views independentemente.
*   **Repositórios/Módulos Separados (Opcional):** Para projetos muito grandes, essas partes poderiam até residir em repositórios Git separados ou ser gerenciadas como pacotes distintos, embora para este projeto, diretórios separados dentro do mesmo repositório provavelmente seriam suficientes.
