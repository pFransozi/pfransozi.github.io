---
layout: page
permalink: /aulas/graduacao/2026-2/
title: graduação · 2026/2
description: Disciplinas e materiais da graduação no semestre 2026/2.
nav: false
---

{% include education_cards_styles.liquid %}

<div class="education-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / <a href="{{ '/aulas/graduacao/' | relative_url }}">Graduação</a> / 2026/2
</div>

<div class="education-intro">
  <p>
    Disciplinas e materiais da graduação referentes ao semestre 2026/2. Cada disciplina reúne seu percurso de aulas e os recursos publicados para esta edição.
  </p>
</div>

<section class="education-section">
  <div class="education-section-header">
    <h2>2026/2</h2>
    <p class="text-muted mb-0">Engenharia de Software</p>
  </div>

  {% assign courses = site.data.course_catalog.courses | where: "term", "2026-2" | sort: "order" %}
  <div class="row">
    {% for course in courses %}
      {% include course_card.liquid course=course %}
    {% endfor %}
  </div>
</section>

<p class="mt-4"><a href="{{ '/aulas/graduacao/' | relative_url }}">← Voltar para Graduação</a></p>
