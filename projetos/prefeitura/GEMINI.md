# Prefeitura Comunitária (Portal da Quadra)

Este projeto é um protótipo de portal comunitário focado em Brasília, com design inspirado em sistemas de transporte público (metrô).

## Padrões de Design
- **Navegação por Linhas:** Cada seção principal do site é uma "linha" (Avisos, Transparência, Comunidade, Mapa).
- **Cores:**
  - Amarelo: Avisos e Alertas
  - Azul: Transparência e Documentos
  - Verde: Comunidade e Enquetes
  - Vermelho: Mapa e Infraestrutura

## Estrutura Técnica
- **Vanilla CSS:** Foco em Grid e Flexbox para mobile-first.
- **Vanilla JS:** Manipulação de DOM simples para troca de seções e renderização de dados.
- **Mock Data:** Centralizado em `js/data.js` para facilitar testes.

## Próximos Passos
- Implementar o componente de "Mapa da Quadra" usando SVG interativo.
- Criar a seção de "Comunidade" com formulários de sugestão.
- Refinar a tipografia para parecer "sinalização urbana".
