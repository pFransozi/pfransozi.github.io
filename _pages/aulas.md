---
layout: page
permalink: /aulas/
title: aulas
description: Disciplinas, materiais de aula e projetos didáticos.
nav: true
nav_order: 6
_styles: >-
  .courses-intro { max-width: 760px; margin-bottom: 2rem; }
  .courses-section { margin-top: 2.5rem; }
  .courses-section-header { display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 1rem; }
  .courses-section-header h2 { margin-bottom: 0; }
  .course-card-link { color: inherit; text-decoration: none !important; display: block; height: 100%; }
  .course-card { border: 1px solid var(--global-divider-color); border-radius: 12px; padding: 1.4rem; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; background: var(--global-bg-color); }
  .course-card-link:hover .course-card { transform: translateY(-3px); border-color: var(--global-theme-color); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
  .course-card h2 { font-size: 1.35rem; margin: .55rem 0 .2rem; }
  .course-card p { margin-bottom: .8rem; }
  .course-card-meta { display: flex; justify-content: space-between; gap: .75rem; font-size: .82rem; text-transform: uppercase; letter-spacing: .04em; color: var(--global-text-color-light); }
  .course-status { color: var(--global-theme-color); font-weight: 600; }
  .course-program { color: var(--global-text-color-light); font-size: .95rem; }
  .course-card-action { color: var(--global-theme-color); font-weight: 600; }
  .teaching-archive { margin-top: 1rem; padding-top: .5rem; }
  .teaching-archive-item { padding: .9rem 0; border-bottom: 1px solid var(--global-divider-color); }
  .teaching-archive-item h3 { font-size: 1.08rem; margin-bottom: .25rem; }
  .teaching-archive-item p { margin-bottom: .25rem; }
---

<div class="courses-intro">
  <p>
    Esta área reúne materiais utilizados nas disciplinas que ministro. Cada disciplina funciona como um pequeno portal, com o percurso do semestre, aulas publicadas, atividades e materiais complementares.
  </p>
</div>

<section class="courses-section">
  <div class="courses-section-header">
    <div>
      <h2>Disciplinas atuais</h2>
      <p class="text-muted mb-0">Materiais organizados por disciplina e semestre.</p>
    </div>
  </div>

  {% assign courses = site.data.course_catalog.courses | sort: "order" %}
  <div class="row">
    {% for course in courses %}
      {% include course_card.liquid course=course %}
    {% endfor %}
  </div>
</section>

<section class="courses-section">
  <div class="courses-section-header">
    <div>
      <h2>Projetos e materiais didáticos</h2>
      <p class="text-muted mb-0">Atividades e projetos desenvolvidos para diferentes contextos de ensino.</p>
    </div>
  </div>

  {% assign materials = site.teaching | sort: "title" %}
  <div class="teaching-archive">
    {% for material in materials %}
      <article class="teaching-archive-item">
        <h3><a href="{{ material.url | relative_url }}">{{ material.title }}</a></h3>
        {% if material.description %}<p>{{ material.description }}</p>{% endif %}
        {% if material.tags %}<small class="text-muted">{{ material.tags | join: " · " }}</small>{% endif %}
      </article>
    {% endfor %}
  </div>
</section>
