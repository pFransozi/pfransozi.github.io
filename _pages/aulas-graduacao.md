---
layout: page
permalink: /aulas/graduacao/
title: graduação
description: Disciplinas e materiais do ensino superior.
nav: false
---

{% include education_cards_styles.liquid %}

<div class="education-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / Graduação
</div>

<div class="education-intro">
  <p>
    Disciplinas e materiais utilizados no ensino superior, organizados por ano e semestre. Selecione uma edição para acessar as disciplinas, o percurso das aulas e os recursos correspondentes.
  </p>
</div>

{% assign terms = site.data.course_catalog.terms | where: "level", "graduacao" | sort: "order" | reverse %}
<div class="row education-grid">
  {% for term in terms %}
    <div class="col-12 col-md-6 mb-4">
      <a class="education-card-link" href="{{ term.url | relative_url }}">
        <article class="education-card">
          <div class="education-card-kicker">semestre</div>
          <h2>{{ term.title }}</h2>
          {% if term.program %}<p>{{ term.program }}</p>{% endif %}
          <span class="education-card-action">Ver disciplinas →</span>
        </article>
      </a>
    </div>
  {% endfor %}
</div>

<p class="mt-4"><a href="{{ '/aulas/' | relative_url }}">← Voltar para níveis de ensino</a></p>
