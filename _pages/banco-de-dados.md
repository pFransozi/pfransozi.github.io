---
layout: page
permalink: /aulas/graduacao/2026-2/banco-de-dados/
title: Banco de Dados — 2026/2
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
  .lesson-item { display: grid; grid-template-columns: 56px minmax(0, 1fr) 330px; gap: 1rem; align-items: start; padding: 1.3rem 0; border-top: 1px solid var(--global-divider-color); }
  .lesson-number { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--global-code-bg-color); font-weight: 700; color: var(--global-theme-color); }
  .lesson-copy h3 { font-size: 1.15rem; margin: 0 0 .25rem; }
  .lesson-copy p { margin: 0; color: var(--global-text-color-light); }
  .lesson-copy p + p { margin-top: .45rem; }
  .lesson-action { display: flex; flex-direction: column; align-items: flex-start; justify-self: start; width: 330px; min-width: 330px; max-width: 330px; gap: .45rem; white-space: nowrap; font-size: .9rem; padding-top: .15rem; text-align: left; }
  .lesson-action a, .lesson-action span { display: block; width: auto; margin: 0; text-align: left; align-self: flex-start; }
  .lesson-resource { font-size: .86rem; }
  .lesson-planned { color: var(--global-text-color-light); }
  .course-note { margin-top: 2rem; padding: 1rem 1.2rem; border-left: 3px solid var(--global-theme-color); background: var(--global-code-bg-color); border-radius: 0 8px 8px 0; }
  .course-note p { margin: .4rem 0 0; }
  @media (max-width: 700px) { .lesson-item { grid-template-columns: 48px 1fr; } .lesson-action { grid-column: 2; width: auto; min-width: 0; max-width: none; padding-top: 0; white-space: normal; } }
---

{% assign course = site.data.courses['banco-de-dados'] %}

<div class="course-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / <a href="{{ '/aulas/graduacao/' | relative_url }}">Graduação</a> / <a href="{{ '/aulas/graduacao/2026-2/' | relative_url }}">2026/2</a> / Banco de Dados
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

<p>As aulas e materiais publicados aparecem aqui na ordem em que são trabalhados. Os HTMLs completos da edição 2026/2 são mantidos em um repositório próprio e acessados a partir deste portal.</p>

<div class="lesson-list">
  {% for lesson in course.lessons %}
    <article class="lesson-item">
      <div class="lesson-number">{{ lesson.number | prepend: '0' | slice: -2, 2 }}</div>
      <div class="lesson-copy">
        <h3>{{ lesson.title }}</h3>
        <p>{{ lesson.description }}</p>
        {% if lesson.content %}
          <p><strong>Conteúdo:</strong> {{ lesson.content }}</p>
        {% endif %}
      </div>
      <div class="lesson-action">
        {% if lesson.url %}
          {% if lesson.url contains '://' %}
            <a href="{{ lesson.url }}" target="_blank" rel="noopener noreferrer">{{ lesson.action_label | default: 'Acessar aula' }} →</a>
          {% else %}
            <a href="{{ lesson.url | relative_url }}">{{ lesson.action_label | default: 'Acessar aula' }} →</a>
          {% endif %}
        {% elsif lesson.status == 'published' %}
          <span class="lesson-planned">material em preparação</span>
        {% else %}
          <span class="lesson-planned">em breve</span>
        {% endif %}

        {% if lesson.resources %}
          {% for resource in lesson.resources %}
            {% if resource.url contains '://' %}
              <a class="lesson-resource" href="{{ resource.url }}" target="_blank" rel="noopener noreferrer">{{ resource.label }} →</a>
            {% else %}
              <a class="lesson-resource" href="{{ resource.url | relative_url }}">{{ resource.label }} →</a>
            {% endif %}
          {% endfor %}
        {% endif %}
      </div>
    </article>
  {% endfor %}
</div>

<div class="course-note">
  <strong>Materiais da edição 2026/2.</strong>
  <p>Os HTMLs completos, atividades, diagramas e demais recursos da disciplina são versionados no <a href="https://github.com/pFransozi/bd-2026-02" target="_blank" rel="noopener noreferrer">repositório da disciplina</a>.</p>
</div>

<p class="mt-4"><a href="{{ '/aulas/graduacao/2026-2/' | relative_url }}">← Voltar para 2026/2</a></p>
