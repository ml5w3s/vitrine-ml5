# Diagrama de Classes - ML5Lab (Nova Abordagem)

Este diagrama reflete a arquitetura orientada a objetos do sistema, incorporando os papéis dos diferentes atores e os principais processos de negócio, como solicitações de personalização e licenciamento.

```mermaid
classDiagram
    direction LR

    class User {
        +String id
        +String nome
        +login()
        +logout()
    }

    class Student {
        +List~Course~ cursosInscritos
        +int creditos
        +comprarCreditos()
        +solicitarAulaPersonalizada()
        +assistirAula(Lesson)
    }

    class Teacher {
        +List~AulaPersonalizada~ aulasCriadas
        +criarAulaPersonalizada(Solicitacao)
        +ministrarAula()
    }

    class Mantenedor {
        +gerenciarPlataforma()
        +criarCurso(SolicitacaoNovoCurso)
        +responderSolicitacao(Solicitacao)
    }

    class Escola {
        <<Cliente B2B>>
        +Licenca licenca
        +solicitarPersonalizacao(descricao)
        +solicitarNovoCurso(tema)
        +solicitarProfessorParticular(topico)
    }

    User <|-- Student
    User <|-- Teacher
    User <|-- Mantenedor
    User <|-- Escola

    class Course {
        +String id
        +String titulo
        +String descricao
        +List~Lesson~ lessons
    }

    class Lesson {
        +String id
        +String titulo
        +Object conteudo
    }

    class AulaPersonalizada {
        +Student aluno
        +Teacher professor
        +String status
    }
    Lesson <|-- AulaPersonalizada

    class Solicitacao {
        <<Abstract>>
        +String id
        +Date data
        +String status
        +Escola escola
        +Mantenedor responsavel
    }

    class SolicitacaoPersonalizacao {
        +String descricao
    }
    Solicitacao <|-- SolicitacaoPersonalizacao

    class SolicitacaoNovoCurso {
        +String tema
        +String detalhes
    }
    Solicitacao <|-- SolicitacaoNovoCurso

    class SolicitacaoProfessorParticular {
        +String topico
        +Teacher professorDesignado
    }
    Solicitacao <|-- SolicitacaoProfessorParticular

    class Licenca {
        +String tipo
        +Date dataExpiracao
    }

    class VagaEmprego {
        +String titulo
        +String descricao
        +String requisitos
    }

    class Propaganda {
        +String imagemUrl
        +String linkDestino
    }

    class ApiService {
        <<Singleton>>
        +get(endpoint)
        +post(endpoint, data)
        +getVagas() VagaEmprego[]
        +getPropagandas() Propaganda[]
        +solicitar(dados) Solicitacao
        +comprarCreditos(valor)
    }

    class Router {
        <<Singleton>>
        +navigateTo(path)
    }

    ' --- Relacionamentos --- '
    Escola "1" -- "1" Licenca : possui
    Escola "1" -- "0..*" Solicitacao : faz >
    Mantenedor "1" -- "0..*" Solicitacao : atende <

    Student "1" -- "0..*" AulaPersonalizada : solicita
    Teacher "1" -- "0..*" AulaPersonalizada : cria

    Course "1" -- "1..*" Lesson : contem

    ApiService ..> User
    ApiService ..> Course
    ApiService ..> Solicitacao
    ApiService ..> VagaEmprego
    ApiService ..> Propaganda
    Router ..> ApiService
```