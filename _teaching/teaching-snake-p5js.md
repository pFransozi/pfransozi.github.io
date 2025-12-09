---
layout: page
title: "Snake com P5.js: construindo o clássico jogo da cobrinha"
description: "Projeto guiado de Pensamento Computacional para 1º ano, programando o jogo Snake em JavaScript com a biblioteca P5.js."
category: "Teaching"
date: 2025-03-01
importance: 1
tags:
  - Teaching
  - Pensamento Computacional
  - JavaScript
  - P5.js
  - Jogos
  - Lógica de Programação
github: "https://github.com/pFransozi/teaching-snake-p5js"
selected: false
---

Projeto de **Pensamento Computacional** em que os estudantes implementam, passo a passo, o clássico jogo da **cobrinha (Snake)** usando **JavaScript + P5.js**.  
A proposta é usar um jogo simples, mas visualmente atraente, para trabalhar animação em tempo real, detecção de colisões e gerenciamento de estado em programas interativos.

---

## Objetivos de aprendizagem

- Experimentar **animação quadro a quadro** em um *canvas* usando P5.js.
- Trabalhar **loops** e atualização contínua de estado (`draw()`, *game loop*).
- Modelar o jogo usando **objetos** (cobra, comida, grade) e **vetores** de posição.
- Praticar **eventos de teclado** e controle de movimento.
- Implementar **regras de jogo**:
  - crescimento da cobra,
  - colisão com paredes e consigo mesma,
  - reinício e contagem de pontos.
- Refletir sobre **estratégias de programação incremental**: começar com um protótipo mínimo e evoluir o jogo por etapas.

---

## Estrutura do projeto

O desenvolvimento foi pensado como um roteiro de aulas, em **etapas progressivas**, cada uma associada a conceitos específicos:

1. **Desenho da grade**
   - Configuração do *canvas*.
   - Laços para desenhar a grade do tabuleiro.
   - Coordenadas e conversão “linha/coluna → pixels”.

2. **Cobra em movimento automático**
   - Criação de uma **classe Snake**.
   - Vetor de posições para representar o corpo.
   - Atualização contínua de posição no `draw()`.

3. **Controle por teclado**
   - Uso de `keyPressed()` para alterar a direção.
   - Tratamento de movimentos inválidos (impedir “voltar sobre si mesmo”).

4. **Comida e pontuação**
   - Geração **aleatória** de comida em células livres.
   - Detecção de colisão cabeça–comida.
   - Incremento de tamanho + **contador de pontos**.

5. **Game over e reinício**
   - Colisão com paredes e com o próprio corpo.
   - Estado de jogo (`playing`, `gameOver`).
   - Lógica de reinício sem recarregar a página.

6. **Polimento e experimentação**
   - Ajustes de velocidade.
   - Feedback visual (cores, fontes, mensagens).
   - Espaço para o aluno propor **regras extras** ( níveis, obstáculos, bônus etc.).

---

## Conteúdos de programação trabalhados

**JavaScript + P5.js**

- Estrutura básica de um *sketch*: `setup()`, `draw()`.
- Desenho em *canvas*: `rect()`, `fill()`, `noStroke()`, etc.
- Controle de fluxo: `if`, `else`, `for`.
- Vetores/arrays para representar o corpo da cobra e histórico de posições.
- Objetos e classes para organizar a lógica do jogo.
- Funções auxiliares para manter o código modular.

**Pensamento Computacional**

- Decomposição do problema em **módulos** (cobra, comida, tabuleiro, placar).
- Definição explícita de **regras de estado**: onde a cobra está, para onde vai, quando cresce, quando perde.
- Uso de **abstrações** (célula da grade, direção, estado do jogo) para simplificar o raciocínio.

---

## Repositório

- Código-fonte e tutorial:  
  👉 [GitHub – 2025-PC-1ANOS-1TRI-Snake-Project](https://github.com/pFransozi/teaching-snake-p5js)

O repositório inclui o **jogo completo**, o **tutorial em etapas** e os arquivos necessários para executar o projeto em laboratório ou em sala de aula (HTML, CSS, JavaScript e bibliotecas P5.js).
