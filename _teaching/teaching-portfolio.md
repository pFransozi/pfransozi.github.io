---
layout: page
title: "Portfolio Web – Projetando uma Página Pessoal do Zero"
description: "Projeto de desenvolvimento de um portfólio web para trabalhar HTML, CSS, JavaScript e identidade digital com estudantes."
category: "Teaching"
tags:
  - Ensino Médio
  - Web Development
  - HTML
  - CSS
  - JavaScript
  - Projeto de Vida
github: "https://github.com/pFransozi/teaching-portfolio-projeto"
---

## Visão geral do projeto

Este projeto propõe que os estudantes desenvolvam um **portfólio pessoal em formato de página web**, integrando conteúdos de programação com reflexões sobre identidade, trajetória acadêmica e interesses profissionais.

Ao final, cada estudante tem uma página que apresenta:

- quem ele(a) é (bio, interesses, habilidades);
- projetos já realizados em outras disciplinas;
- contatos e links relevantes (GitHub, e-mail, etc.).

O repositório foi pensado para ser usado em contexto de **Ensino Médio**, mas pode ser facilmente adaptado para outros níveis.

---

## Objetivos de aprendizagem

Do ponto de vista pedagógico, o projeto busca:

- Consolidar conceitos básicos de **HTML** (estrutura de página, hierarquia de títulos, seções, listas, links e imagens);
- Trabalhar **CSS** para organização visual, layout responsivo e noções de identidade visual (cores, tipografia, espaçamentos);
- Introduzir ou reforçar **JavaScript** em pequenos trechos (interações simples, navegação, efeitos básicos);
- Estimular a reflexão sobre **“quem eu sou como estudante”** e como se apresentar em contextos acadêmicos/profissionais;
- Desenvolver autonomia na construção de páginas web a partir de um esqueleto inicial.

---

## Conteúdos trabalhados em programação

Ao longo do projeto, os estudantes praticam:

- **HTML**
  - `<header>`, `<main>`, `<section>`, `<footer>`;
  - uso correto de `<h1>…<h6>`, `<p>`, `<ul>/<ol>`, `<a>`, `<img>`;
  - organização semântica do conteúdo (“Sobre mim”, “Projetos”, “Contato”).

- **CSS**
  - classes e IDs para estilização;
  - layout com `flexbox` ou `grid` (dependendo da turma);
  - paleta de cores e tipografia;
  - espaçamento, bordas, alinhamentos;
  - responsividade básica (página legível em telas menores).

- **JavaScript** (quando incluído)
  - manipulação simples do DOM (ex.: mostrar/ocultar seções);
  - pequenos aprimoramentos de UX (ex.: rolagem suave, destaque em elementos, etc.).

---

## Competências transversais

Além da parte técnica, o projeto também trabalha:

- **Comunicação escrita** – escrever uma bio clara, objetiva e adequada ao público;
- **Organização de informação** – decidir o que entra na página e como estruturar seções;
- **Projeto de vida / carreira** – refletir sobre habilidades, interesses e objetivos de médio prazo;
- **Responsabilidade digital** – pensar em que informações pessoais fazem sentido (ou não) numa página pública.

---

## Estrutura do repositório

A organização do repositório segue uma estrutura simples (pode ajustar aqui conforme o repo real):

- `index.html` – página principal do portfólio (estrutura base para os estudantes modificarem);
- `css/` – estilos da página, separados em um ou mais arquivos `.css`;
- `js/` – scripts opcionais de interação (se a turma já estiver trabalhando com JavaScript);
- `assets/` ou `img/` – imagens e ícones usados de exemplo;
- `docs/` (opcional) – materiais de apoio para o professor, roteiros de aula, etc.

A ideia é que o estudante faça um **fork ou download**, renomeie a pasta e vá personalizando seu próprio portfólio a partir do esqueleto fornecido.

---

## Como usar em sala de aula

Algumas formas de trabalhar este projeto:

1. **Introdução guiada**
   - O professor apresenta o template, explica a estrutura de arquivos e demonstra ao vivo como alterar elementos básicos (título, texto, foto).

2. **Sprints curtos**
   - Cada aula/sprint foca em uma seção:
     - Aula 1: “Sobre mim” + estrutura HTML;
     - Aula 2: “Projetos” + listas, links e imagens;
     - Aula 3: “Contato” + formulários simples ou links;
     - Aula 4: ajustes de CSS e identidade visual.

3. **Apresentação final**
   - Os estudantes apresentam seus portfólios (em dupla ou individualmente), explicando:
     - as escolhas de conteúdo;
     - decisões de layout;
     - o que aprenderam no processo.

---

## Possíveis extensões

Para turmas mais avançadas ou para continuidade do projeto:

- Publicar o portfólio no **GitHub Pages**;
- Adicionar um **modo escuro/claro** com JavaScript;
- Criar uma seção dinâmica de projetos, lendo dados de um arquivo `.json`;
- Integrar o portfólio com outros projetos desenvolvidos em aula (por exemplo, linkando o **gerador de senhas**, o **recomendador de filmes**, etc.).