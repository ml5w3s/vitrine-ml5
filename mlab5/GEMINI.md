# MLab5 - Sistema de Gestão de Aulas

## Objetivo
Plataforma SPA (Single Page Application) modular para renderização de cursos e aulas interativas a partir de arquivos JSON.

## Arquitetura e Estrutura de Pastas
- **Ponto de Entrada:** `mlab5/index.html` e `src/main.js` (orquestrador).
- **Core (`src/`):**
    - `router/`: Gerencia navegação via hash (`#/`).
    - `services/`: `ApiService.js` para busca de dados locais.
    - `repositories/`: Transforma dados brutos em modelos (`Course`, `Lesson`).
    - `views/`: Renderização de UI (ex: `LivroMestreView`, `PlaygroundView`).
    - `components/`: UI reutilizável.
- **Dados (`data/`):**
    - `courses.json`: Índice global (gerado automaticamente via build).
    - `[curso]/meta.json`: Metadados do curso.
    - `[curso]/aulas.json`: Conteúdo detalhado das lições.
    - `images/`: Central de assets com padrão de nomenclatura `XX_nome.png` (onde XX é o número da aula).

## Fluxo de Trabalho (Workflow)
1. **Novo Curso:** Criar pasta em `data/` -> `meta.json` -> `aulas.json` -> Rodar script de build para atualizar `courses.json`.
2. **Imagens:** Sempre mover para `data/images/` e atualizar caminhos no `aulas.json`.
3. **Conversão:** Para converter aulas legadas (HTML), seguir o plano de mapeamento semântico (tags h3 -> headline, p -> text, etc).

## Recursos de Desenvolvimento
- **Depuração:** Atalho `Ctrl+M` abre o painel visual de debug. Use `Debug.log()` e `Debug.error()` para mensagens categorizadas.
- **Persistência:** Estratégia de "Chave de Progresso" (Base64) armazenada no `localStorage`. Para dados volumosos (inventário), utilizar `IndexedDB` vinculado ao ID da sessão.

## Roadmap e Pendências (Issues)
- [ ] Finalizar conteúdo detalhado de jQuery (Aulas 01, 06, 08).
- [ ] Centralizar imagens restantes em `data/images/`.
- [ ] Implementar carregamento dinâmico de instruções no `PlaygroundComponent`.
- [ ] Desenvolver interface visual do "Criador de Cursos" (`#/creator`).
- [ ] Refatorar layout de artigos para Flexbox.
- [ ] Mapear rotas em links de header/footer para evitar recarregamento de página.

## Regras de Integridade
- **Consistência:** `courses.json` deve refletir fielmente as pastas em `data/`.
- **Segurança:** Nunca incluir segredos ou chaves de API (ex: `client_secret.json`) em pastas de documentação pública ou commits.
