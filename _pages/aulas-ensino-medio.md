---
layout: page
permalink: /aulas/ensino-medio/
title: ensino médio
description: Disciplinas, projetos e materiais do Ensino Médio.
nav: false
---

{% include education_cards_styles.liquid %}

<div class="education-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / Ensino Médio
</div>

<div class="education-intro">
  <p>
    Disciplinas, atividades e projetos voltados ao Ensino Médio. A organização desta área separa as disciplinas regulares dos projetos didáticos desenvolvidos ao longo do ano.
  </p>
</div>

<section class="education-section">
  <div class="education-section-header">
    <h2>Disciplinas</h2>
    <p class="text-muted mb-0">Materiais organizados por componente e turma.</p>
  </div>

  {% assign courses = site.data.course_catalog.courses | where: "level", "ensino-medio" | sort: "order" %}
  <div class="row">
    {% for course in courses %}
      {% include course_card.liquid course=course %}
    {% endfor %}
  </div>
</section>

<section class="education-section">
  <div class="education-section-header">
    <h2>Projetos e atividades</h2>
    <p class="text-muted mb-0">Projetos didáticos de programação, Web, pensamento computacional e cidadania digital.</p>
  </div>

  {% assign materials = site.teaching | sort: "title" %}
  <div class="row">
    {% for material in materials %}
      <div class="col-12 col-md-6 mb-4">
        <a class="course-card-link" href="{{ material.url | relative_url }}">
          <article class="course-card h-100">
            <div class="course-card-meta">
              <span>projeto didático</span>
            </div>
            <h2>{{ material.title }}</h2>
            {% if material.description %}<p>{{ material.description }}</p>{% endif %}
            {% if material.tags %}<p class="course-program">{{ material.tags | join: " · " }}</p>{% endif %}
            <span class="course-card-action">Acessar projeto →</span>
          </article>
        </a>
      </div>
    {% endfor %}
  </div>
</section>

<p class="mt-4"><a href="{{ '/aulas/' | relative_url }}">← Voltar para níveis de ensino</a></p>
