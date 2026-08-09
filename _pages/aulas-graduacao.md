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
    Disciplinas e materiais utilizados no ensino superior, organizados por semestre. As disciplinas com material já publicado levam para páginas próprias com o percurso de aulas e recursos complementares.
  </p>
</div>

<section class="education-section">
  <div class="education-section-header">
    <h2>2026/2</h2>
    <p class="text-muted mb-0">Engenharia de Software</p>
  </div>

  {% assign courses = site.data.course_catalog.courses | where: "level", "graduacao" | sort: "order" %}
  <div class="row">
    {% for course in courses %}
      {% include course_card.liquid course=course %}
    {% endfor %}
  </div>
</section>

<p class="mt-4"><a href="{{ '/aulas/' | relative_url }}">← Voltar para níveis de ensino</a></p>
