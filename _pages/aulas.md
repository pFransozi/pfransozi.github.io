---
layout: page
permalink: /aulas/
title: aulas
description: Disciplinas e materiais organizados por nível de ensino.
nav: true
nav_order: 6
---

{% include education_cards_styles.liquid %}

<div class="education-intro">
  <p>
    Esta área reúne disciplinas, materiais de aula, projetos e atividades utilizados em diferentes contextos de ensino. Selecione um nível para acessar os conteúdos correspondentes.
  </p>
</div>

{% assign levels = site.data.course_catalog.levels | sort: "order" %}
<div class="row education-grid">
  {% for level in levels %}
    <div class="col-12 col-md-4 mb-4">
      <a class="education-card-link" href="{{ level.url | relative_url }}">
        <article class="education-card">
          <div class="education-card-kicker">nível de ensino</div>
          <h2>{{ level.title }}</h2>
          <p>{{ level.description }}</p>
          <span class="education-card-action">Ver conteúdos →</span>
        </article>
      </a>
    </div>
  {% endfor %}
</div>
