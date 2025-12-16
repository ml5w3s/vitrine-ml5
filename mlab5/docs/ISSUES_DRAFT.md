### **Issue 1: Finalizar Conteúdo do Curso jQuery**

**Título:** `feat: Finalizar conteúdo detalhado das aulas de jQuery`

**Descrição:**
```markdown
**Objetivo:**
Enriquecer as aulas restantes do curso de jQuery (01, 06 e 08) com seu conteúdo detalhado, seguindo o padrão já estabelecido para as aulas 02, 03, 04, 05 e 07.

**Contexto:**
Atualmente, as aulas 01, 06 e 08 no arquivo `mlab5/data/jquery/aulas.json` contêm apenas um resumo básico. É preciso substituir esses resumos pelo conteúdo completo extraído dos seus respectivos arquivos `index.html`.

**Tarefas:**
- [ ] Para a **Aula 01**: Ler `mlab5/data/jquery/01/index.html`, extrair seu conteúdo e atualizar a entrada correspondente em `aulas.json`.
- [ ] Para a **Aula 06**: Ler `mlab5/data/jquery/06/index.html`, extrair seu conteúdo e atualizar a entrada correspondente em `aulas.json`.
- [ ] Para a **Aula 08**: Ler `mlab5/data/jquery/08/index.html`, extrair seu conteúdo e atualizar a entrada correspondente em `aulas.json`.
- [ ] Garantir que os caminhos das imagens sigam o novo padrão (`/mlab5/data/images/XX_...`).
```

---

### **Issue 2: Centralizar Imagens dos Cursos**

**Título:** `refactor: Centralizar imagens dos cursos em /data/images`

**Descrição:**
```markdown
**Objetivo:**
Mover todas as imagens relacionadas ao conteúdo dos cursos para um diretório central (`/mlab5/data/images/`) e atualizar todas as referências nos arquivos `aulas.json` para refletir essa nova estrutura.

**Contexto:**
Atualmente, os caminhos das imagens nos arquivos `aulas.json` apontam para diferentes locais (ex: `/cursos/jquery/02/images/`). A centralização das imagens em `/mlab5/data/images/` simplificará a manutenção, a organização e o versionamento dos assets do projeto. Um padrão de nomenclatura com prefixo por aula (ex: `02_`, `03_`) já foi iniciado.

**Tarefas:**
- [ ] Mover fisicamente todos os arquivos de imagem das subpastas de cada aula (ex: `jquery/02/images/`, `html5/01/images/`, etc.) para a pasta `/mlab5/data/images/`.
- [ ] Garantir que todas as imagens movidas sejam renomeadas com um prefixo numérico correspondente à sua aula (ex: `02_efeitos_desktop.png`, `07_galeria_modal_desktop.png`).
- [ ] Revisar **todos** os arquivos `aulas.json` (`html5/aulas.json`, `jquery/aulas.json`, etc.) e atualizar os caminhos das imagens para apontar para o novo diretório central.
- [ ] Remover as pastas de imagens antigas e vazias de dentro dos diretórios de cada aula após a migração.
```

---

### **Issue 3: Criar `aulas.json` para Cursos Restantes**

**Título:** `feat: Criar arquivos de conteúdo para os cursos de CSS3, JavaScript e XML`

**Descrição:**
```markdown
**Objetivo:**
Criar os arquivos `aulas.json` para os cursos de CSS3, JavaScript e XML, populando-os com o conteúdo detalhado de suas respectivas aulas.

**Contexto:**
Os cursos de CSS3, JavaScript e XML já possuem uma estrutura de pastas em `/mlab5/data/`, mas ainda não têm um arquivo `aulas.json` com o conteúdo detalhado, como foi feito para HTML5 e jQuery. Para que eles sejam renderizados corretamente na aplicação, é preciso criar e preencher esses arquivos.

**Tarefas:**
- [ ] **Curso CSS3:**
    - [ ] Analisar o conteúdo existente em `mlab5/data/css3/`.
    - [ ] Extrair as informações de cada aula.
    - [ ] Criar e preencher o arquivo `mlab5/data/css3/aulas.json`.

- [ ] **Curso JavaScript:**
    - [ ] Analisar o conteúdo existente em `mlab5/data/javascript/`.
    - [ ] Extrair as informações de cada aula.
    - [ ] Criar e preencher o arquivo `mlab5/data/javascript/aulas.json`.

- [ ] **Curso XML:**
    - [ ] Analisar o conteúdo existente em `mlab5/data/xml/`.
    - [ ] Extrair as informações de cada aula.
    - [ ] Criar e preencher o arquivo `mlab5/data/xml/aulas.json`.

- [ ] Garantir que a estrutura dos novos arquivos `aulas.json` seja consistente com o padrão já estabelecido nos outros cursos.
```

---

### **Issue 4: Instruções Dinâmicas no Playground**

**Título:** `feat: Carregar instruções e código dinamicamente no Playground`

**Descrição:**
```markdown
**Objetivo:**
Modificar o `PlaygroundComponent.js` para que ele carregue dinamicamente as instruções, exercícios e código inicial a partir dos dados da aula que o invocou.

**Contexto:**
Atualmente, o Playground é um componente genérico. Para torná-lo uma ferramenta de aprendizado eficaz, ele precisa exibir o conteúdo específico da aula que o usuário está praticando. Os dados para isso (instruções, código inicial, etc.) já existem na estrutura do `aulas.json` (nos objetos `exercise` e `articles` com `programmingLanguage`).

**Tarefas:**
- [ ] Modificar o `PlaygroundView.js` para passar o objeto completo da `Lesson` para o `PlaygroundComponent`.
- [ ] Em `PlaygroundComponent.js`, usar os dados recebidos da aula para:
    - [ ] Renderizar as instruções e os passos do exercício (`lesson.content.course.exercise`).
    - [ ] Preencher a `<textarea>` com o código inicial da aula (`lesson.content.course.articles` que contêm a propriedade `code`).
- [ ] Garantir que o botão "Executar Código" funcione com o código inicial e com as modificações do usuário.
- [ ] Assegurar que os templates de layout (`lesson.content.course.controls.templates`) possam ser aplicados corretamente.
```

---

### **Issue 5: Implementar o Criador de Cursos**

**Título:** `feat: Implementar interface do Criador de Cursos`

**Descrição:**
```markdown
**Objetivo:**
Desenvolver a interface de usuário e a lógica para o "Criador de Cursos", permitindo a criação e edição de aulas e cursos de forma visual.

**Contexto:**
Existe uma rota (`#/creator`) e um arquivo de view (`LessonCreatorView.js`) que servem como ponto de partida, mas a funcionalidade completa precisa ser implementada. A ferramenta deve, eventualmente, ser capaz de gerar a estrutura de arquivos (`meta.json`, `aulas.json`) que a aplicação consome.

**Tarefas:**
- [ ] **Design da UI:**
    - [ ] Criar um formulário em `LessonCreatorView.js` para adicionar os campos de uma aula (título, tipo, artigos, exercícios, etc.).
    - [ ] Permitir a adição dinâmica de múltiplos artigos e passos de exercício.
    - [ ] Criar uma área de preview que mostre como a aula ficará.

- [ ] **Lógica de Negócio:**
    - [ ] Implementar a lógica para pegar os dados do formulário e montar um objeto JSON que corresponda à estrutura de um `aulas.json`.
    - [ ] Adicionar um botão "Gerar JSON" que exiba o resultado final para o usuário.
    - [ ] (Futuro) Implementar a funcionalidade de salvar o JSON diretamente no sistema de arquivos (pode requerer uma API backend ou integração com `electron/tauri`).

- [ ] **Integração:**
    - [ ] Garantir que o JSON gerado seja compatível com o `ApiService` e o `Lesson.render()`.
```

---

### **Issue 6: Refatorar Estilo dos Artigos**

**Título:** `style: Refatorar layout dos artigos das aulas para usar Flexbox`

**Descrição:**
```markdown
**Objetivo:**
Modernizar o CSS que controla o layout dos artigos dentro das aulas, substituindo o sistema atual por Flexbox para obter um design mais robusto, flexível e fácil de manter.

**Contexto:**
O layout atual dos artigos nas páginas de aula pode não ser otimizado para todos os tipos de conteúdo ou tamanhos de tela. A utilização de Flexbox permitirá um alinhamento mais previsível, distribuição de espaço mais inteligente e melhor responsividade.

**Tarefas:**
- [ ] Identificar os arquivos CSS que estilizam os contêineres e itens dos artigos das aulas (provavelmente em `base.css` ou `jquery.css`).
- [ ] Refatorar o CSS do contêiner principal dos artigos para usar `display: flex`.
- [ ] Ajustar as propriedades dos itens (`flex-grow`, `flex-shrink`, `flex-basis`) para controlar como eles se comportam em diferentes resoluções.
- [ ] Garantir que a ordem e o alinhamento de títulos, textos, imagens e listas de código permaneçam consistentes e legíveis.
- [ ] Testar o novo layout em diferentes larguras de tela para assegurar a responsividade.
```

---

### **Issue 7: Revisar Rotas Não Mapeadas**

**Título:** `fix: Mapear rotas para links do cabeçalho e rodapé`

**Descrição:**
```markdown
**Objetivo:**
Garantir que todos os links de navegação globais, como o logo no cabeçalho e os links no rodapé, sejam corretamente manipulados pelo `Router.js`, direcionando o usuário para as rotas apropriadas dentro da Single-Page Application.

**Contexto:**
Alguns links de navegação, como o que envolve o logo da aplicação ou os links institucionais no rodapé, podem estar usando `href`s tradicionais que causam um recarregamento completo da página. Em uma SPA, esses links devem ser interceptados para usar a navegação via hash (`#/...`) e preservar o estado da aplicação.

**Tarefas:**
- [ ] **Analisar `header.html`:**
    - [ ] Verificar o link envolvendo o logo e outros links de navegação principal.
    - [ ] Garantir que todos usem o formato `href="#/caminho-desejado"` (ex: `href="#/"` para o logo).

- [ ] **Analisar `footer.html`:**
    - [ ] Inspecionar todos os links presentes no rodapé (ex: "Sobre", "Contato", "Termos de Serviço").
    - [ ] Para links internos da SPA, convertê-los para o formato de hash.
    - [ ] Para links externos, garantir que eles abram em uma nova aba (`target="_blank" rel="noopener noreferrer"`) para não interromper a navegação na SPA.

- [ ] **Testar a Navegação:**
    - [ ] Clicar em todos os links do cabeçalho e rodapé para confirmar que a navegação ocorre como esperado, sem recarregamentos de página indesejados.
```
