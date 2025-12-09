---
layout: page
title: "Pong em JavaScript com p5.js"
description: "Ensino de lógica de jogos 2D, animação quadro a quadro e colisão usando JavaScript e p5.js"
importance: 1
category: "Teaching"
date: 2025-03-01
tags:
  - Ensino de Programação
  - JavaScript
  - p5.js
  - Jogos 2D
  - Pensamento Computacional
github: "https://github.com/pFransozi/teaching-pong-js"
selected: false
---

## Visão geral

Este projeto recria o clássico **Pong** em JavaScript usando **p5.js** e **p5.collide2d** como laboratório para introduzir lógica de jogos 2D, animação contínua e detecção de colisão.  
Ele é usado em aula para mostrar, de forma incremental, como:

- estruturar um *game loop* (`setup()` + `draw()`);
- atualizar o estado do jogo a cada quadro;
- reagir a eventos (teclado, colisões, pontuação);
- incorporar áudio e pequenos elementos de “IA” para o oponente.

A ideia é que estudantes vejam um exemplo completo, mas ainda legível, de jogo 2D baseado em **canvas**, com foco em raciocínio lógico e experimentação.

---

## Objetivos pedagógicos

- Introduzir o **ciclo básico de um jogo**: inicialização → atualização do estado → renderização.
- Trabalhar **movimento em 2D** com velocidade, direção e limites da tela.
- Explorar **colisão** entre bola e raquetes, e entre bola e bordas do canvas.
- Mostrar o uso de **bibliotecas gráficas** (p5.js, p5.sound, p5.collide2d) em um projeto simples.
- Exercitar **leitura e modificação de código existente**, adicionando recursos e polindo o jogo.

---

## Conteúdos de programação trabalhados

- **JavaScript no navegador**
  - variáveis, tipos básicos e escopo;
  - funções e parâmetros;
  - condicionais e estruturas de repetição;
  - organização de código em blocos lógicos (funções para desenhar, atualizar, checar colisão).

- **p5.js e desenho em canvas**
  - `createCanvas`, `background`, `ellipse`, `rect`;
  - função `draw()` como *game loop*;
  - atualização quadro a quadro (posição = posição + velocidade).

- **Lógica de jogo 2D**
  - detecção de colisão com bordas (inversão de velocidade);
  - detecção de colisão bola × raquete com `collideRectCircle`;
  - controle de entrada do jogador via teclado (setas ↑ ↓);
  - “IA” simples para o adversário, seguindo a posição da bola com margem de erro.

- **Áudio e feedback**
  - uso de `p5.sound` para trilha de fundo e efeitos de colisão/pontuação;
  - conexão entre eventos do jogo (ponto, colisão) e feedback auditivo.

---

## Competências desenvolvidas

- **Técnicas**
  - compreensão prática de um *game loop* e de animação contínua;
  - modelagem de objetos de jogo (bola, raquetes, placar) como conjuntos de variáveis e funções;
  - noções de **física simples** aplicadas (velocidade, direção, reflexão);
  - uso de bibliotecas externas (p5.js / p5.collide2d / p5.sound) e leitura de documentação;
  - primeiros passos em **debugging visual** (ajustar velocidade, tamanho, posições da bola e das raquetes).

- **Cognitivas e comportamentais**
  - **pensamento computacional** (decompor o jogo em componentes: desenho, lógica, entrada, pontuação);
  - experimentação controlada: alterar um parâmetro por vez e observar o impacto;
  - persistência ao resolver bugs de colisão, travamentos de bola ou problemas no placar;
  - colaboração, quando os estudantes trabalham em dupla para testar e ajustar o jogo.

---

## Estrutura do projeto

O repositório é intencionalmente simples para facilitar o uso em sala:

- `index.html` – arquivo principal para abrir o jogo no navegador.
- `sketch.js` – código JavaScript com:
  - declaração de variáveis da bola e das raquetes;
  - funções de desenho e atualização;
  - lógica de colisão e pontuação;
  - controle de entrada do jogador e IA do oponente.
- `style.css` – ajustes básicos de layout e centralização do canvas.
- `p5.collide2d.js` – biblioteca auxiliar para detecção de colisão.
- `trilha.mp3`, `raquetada.mp3`, `ponto.mp3` – arquivos de áudio usados como trilha e efeitos de jogo.

---

## Como o projeto é usado em aula

Em geral, a sequência didática segue etapas como:

1. **Rodar o jogo pronto** e discutir os elementos principais (bola, raquetes, placar, sons).
2. Voltar para uma versão reduzida:
   - bola estática → bola em movimento → colisão com bordas.
3. Introduzir as **raquetes do jogador e do adversário**:
   - controles de teclado;
   - movimento da raquete adversária seguindo a bola com erro.
4. Adicionar **placar e sons**, conectando eventos a feedback visual e auditivo.
5. Propor **desafios de extensão**, como:
   - deixar a IA mais “humana” (erra mais ou menos, dependendo do placar);
   - criar diferentes níveis de dificuldade;
   - ajustar velocidade da bola ao longo da partida.

---

## Conexão com pensamento computacional e cultura digital

O projeto permitiu discussões:

- como **modelar um problema** (jogo) em termos de estados e regras;
- a diferença entre “ver o jogo” e **entender a lógica por trás**;
- como jogos digitais envolvem **experimentação, iteração e teste** contínuo do código;
- a importância de **criar e modificar tecnologia**, em vez de apenas consumi-la.

Essas discussões ajudam a conectar o entretenimento digital do dia a dia dos estudantes com conceitos estruturais de programação e com uma relação mais ativa e crítica com a tecnologia.

---