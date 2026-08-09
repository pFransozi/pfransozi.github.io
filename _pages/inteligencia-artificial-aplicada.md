---
layout: page
permalink: /aulas/inteligencia-artificial-aplicada/
title: Inteligência Artificial Aplicada
description: Engenharia de Software · 2026/2 · UniSENAI
nav: false
_styles: >-
  .course-breadcrumb { margin-bottom: 1.4rem; font-size: .92rem; color: var(--global-text-color-light); }
  .course-breadcrumb a { color: var(--global-theme-color); }
  .course-hero { margin-bottom: 2rem; }
  .course-kicker { font-size: .85rem; text-transform: uppercase; letter-spacing: .06em; color: var(--global-theme-color); font-weight: 600; margin-bottom: .5rem; }
  .course-summary { max-width: 780px; font-size: 1.05rem; }
  .course-meta { display: flex; flex-wrap: wrap; gap: .6rem; margin: 1rem 0 0; }
  .course-meta span { border: 1px solid var(--global-divider-color); border-radius: 999px; padding: .3rem .7rem; font-size: .85rem; color: var(--global-text-color-light); }
  .lesson-list { margin-top: 1.5rem; }
  .lesson-item { display: grid; grid-template-columns: 56px 1fr auto; gap: 1rem; align-items: start; padding: 1.3rem 0; border-top: 1px solid var(--global-divider-color); }
  .lesson-number { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--global-code-bg-color); font-weight: 700; color: var(--global-theme-color); }
  .lesson-copy h3 { font-size: 1.15rem; margin: 0 0 .25rem; }
  .lesson-copy p { margin: 0; color: var(--global-text-color-light); }
  .lesson-action { white-space: nowrap; font-size: .9rem; padding-top: .15rem; }
  .lesson-planned { color: var(--global-text-color-light); }
  .course-note { margin-top: 2rem; padding: 1rem 1.2rem; border-left: 3px solid var(--global-theme-color); background: var(--global-code-bg-color); border-radius: 0 8px 8px 0; }
  @media (max-width: 700px) { .lesson-item { grid-template-columns: 48px 1fr; } .lesson-action { grid-column: 2; padding-top: 0; } }
---

{% assign course = site.data.courses['ia-aplicada'] %}

<div class="course-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / <a href="{{ '/aulas/graduacao/' | relative_url }}">Graduação</a> / Inteligência Artificial Aplicada
</div>

<div class="course-hero">
  <div class="course-kicker">Disciplina · {{ course.semester }}</div>
  <p class="course-summary">{{ course.description }}</p>
  <div class="course-meta">
    <span>{{ course.program }}</span>
    <span>{{ course.institution }}</span>
    <span>{{ course.semester }}</span>
  </div>
</div>

## Percurso da disciplina

<p>As aulas aparecem aqui na ordem em que são trabalhadas. Materiais publicados podem receber links para páginas interativas, notebooks, códigos e outros recursos.</p>

<div class="lesson-list">
  {% for lesson in course.lessons %}
    <article class="lesson-item">
      <div class="lesson-number">{{ lesson.number | prepend: '0' | slice: -2, 2 }}</div>
      <div class="lesson-copy">
        <h3>{{ lesson.title }}</h3>
        <p>{{ lesson.description }}</p>
      </div>
      <div class="lesson-action">
        {% if lesson.url %}
          <a href="{{ lesson.url | relative_url }}">Acessar aula →</a>
        {% elsif lesson.status == 'published' %}
          <span class="lesson-planned">material em preparação</span>
        {% else %}
          <span class="lesson-planned">em breve</span>
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>

<div class="course-note">
  <strong>Página piloto.</strong> A estrutura já está pronta para receber os HTMLs completos das aulas. Quando o material de uma aula for incorporado ao repositório, basta acrescentar sua URL no arquivo de dados da disciplina.
</div>

<p class="mt-4"><a href="{{ '/aulas/graduacao/' | relative_url }}">← Voltar para Graduação</a></p>
