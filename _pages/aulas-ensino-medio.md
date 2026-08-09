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
    <p class="text-muted mb-0">O acervo anterior está sendo classificado dentro da nova estrutura.</p>
  </div>
  <p>
    Enquanto essa organização é concluída, os projetos de programação, Web e pensamento computacional permanecem disponíveis no <a href="{{ '/teaching/' | relative_url }}">acervo de materiais didáticos</a>.
  </p>
</section>

<p class="mt-4"><a href="{{ '/aulas/' | relative_url }}">← Voltar para níveis de ensino</a></p>
