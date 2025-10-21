# Diagramas Detalhados do Sistema

Este arquivo contém vários diagramas UML e de entidade-relacionamento para detalhar o design do sistema ML5Lab.

---

## 1. Diagrama de Sequência

Mostra a interação entre os objetos ao longo do tempo. Este exemplo descreve o que acontece quando um aluno tenta assistir a uma aula.

```mermaid
sequenceDiagram
    participant Aluno
    participant Pagina
    participant Router
    participant ApiService
    participant BancoDeDados

    Aluno->>Pagina: Clica no link da "Aula 01"
    Pagina->>Router: navegarPara('/aulas/html-01')
    Router->>ApiService: getAula('html-01')
    ApiService->>BancoDeDados: Solicita dados da aula 'html-01'
    BancoDeDados-->>ApiService: Retorna dados da aula (JSON)
    ApiService-->>Router: Retorna objeto Aula
    Router->>Pagina: Atualiza estado com dados da Aula
    Pagina->>Pagina: renderizaConteudo(aula)
    Pagina-->>Aluno: Exibe conteúdo da "Aula 01"
```

---

## 2. Diagrama de Atividades

Descreve o fluxo de trabalho passo a passo de uma operação. Este exemplo mostra a atividade de um aluno se inscrevendo em um curso pago.

```mermaid
activityDiagram
    title Atividade: Aluno se Inscreve em um Curso
    start
    :Aluno visualiza a lista de cursos;
    :Aluno seleciona um curso;
    if (Curso requer pagamento?) then (sim)
        :Aluno é redirecionado para a página de créditos;
        :Aluno compra créditos;
        if (Pagamento aprovado?) then (sim)
            :Créditos são adicionados à conta;
        else (não)
            :Exibe mensagem de falha no pagamento;
            stop
        endif
        :Sistema debita créditos e inscreve o aluno;
    else (não)
        :Sistema inscreve o aluno diretamente;
    endif
    :Exibe página do curso com aulas disponíveis;
    stop
```

---

## 3. Diagrama de Estados

Modela os diferentes estados em que um objeto pode se encontrar durante seu ciclo de vida. Este exemplo mostra os estados de um `Curso` na perspectiva de um `Aluno`.

```mermaid
stateDiagram-v2
    title Estados de um Curso para um Aluno

    [*] --> Disponivel
    Disponivel --> Inscrito: Aluno se inscreve
    Inscrito --> EmAndamento: Aluno assiste a primeira aula
    EmAndamento --> Concluido: Aluno completa todas as aulas
    
    Inscrito --> Disponivel: Aluno cancela inscrição
    EmAndamento --> Disponivel: Aluno cancela inscrição
    Concluido --> Disponivel: Aluno decide refazer (opcional)
```

---

## 4. Diagrama de Entidade-Relacionamento (DER)

Descreve a estrutura do banco de dados, mostrando as tabelas (entidades) e como elas se relacionam. É uma visão inicial para o Firebase.

```mermaid
erDiagram
    USUARIOS {
        string id PK
        string nome
        string email
        string tipo "aluno, professor, etc"
    }
    CURSOS {
        string id PK
        string titulo
        string id_professor FK
    }
    AULAS {
        string id PK
        string titulo
        string conteudo
        string id_curso FK
    }
    INSCRICOES {
        string id_usuario FK
        string id_curso FK
        date data_inscricao
    }
    PAGAMENTOS {
        string id PK
        string id_usuario FK
        float valor
        date data_pagamento
    }

    USUARIOS ||--o{ INSCRICOES : "se inscreve em"
    CURSOS ||--|{ INSCRICOES : "tem"
    CURSOS ||--|{ AULAS : "contém"
    USUARIOS ||--o{ CURSOS : "é professor de"
    USUARIOS ||--o{ PAGAMENTOS : "realiza"
```

---

## 5. Diagrama de Objetos

Mostra instâncias de classes e seus relacionamentos em um ponto específico no tempo. É como uma "fotografia" do sistema em execução.

```mermaid
graph TD
    subgraph "Cenário: Aluno assistindo uma aula"
        direction LR
        aluno1("joao: Aluno")
        cursoHtml("cursoHtml5: Curso")
        licao1("licaoIntroducao: Aula")
        api("apiService: ApiService")

        aluno1 -- "inscrito em" --> cursoHtml
        cursoHtml -- "contém" --> licao1
        aluno1 -- "assiste" --> licao1
    end
```
