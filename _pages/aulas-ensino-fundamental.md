---
layout: page
permalink: /aulas/ensino-fundamental/
title: ensino fundamental
description: Programação, pensamento computacional e projetos do Ensino Fundamental.
nav: false
---

{% include education_cards_styles.liquid %}

<div class="education-breadcrumb">
  <a href="{{ '/aulas/' | relative_url }}">Aulas</a> / Ensino Fundamental
</div>

<div class="education-intro">
  <p>
    Materiais e projetos voltados à introdução à programação, pensamento computacional, investigação científica e uso responsável de tecnologia no Ensino Fundamental.
  </p>
</div>

<section class="education-section">
  <div class="education-section-header">
    <h2>Projetos e iniciativas</h2>
    <p class="text-muted mb-0">Atividades em desenvolvimento com organização própria de materiais.</p>
  </div>

{% assign initiatives = site.data.course_catalog.initiatives | where: "level", "ensino-fundamental" | sort: "order" %}

  <div class="row">
    {% for initiative in initiatives %}
      {% include course_card.liquid course=initiative %}
    {% endfor %}
  </div>
</section>

<section class="education-section">
  <div class="education-section-header">
    <h2>Atividades interativas</h2>
    <p class="text-muted mb-0">Experimentos didáticos para trabalhar Matemática, lógica e pensamento computacional.</p>
  </div>

  <div class="row">
    <div class="col-12 mb-4">
      <a class="course-card-link" href="{{ '/aulas/ensino-fundamental/laboratorio-blocos/' | relative_url }}">
        <article class="course-card h-100">
          <div class="course-card-meta">
            <span>trilha interativa · 8º ano</span>
          </div>
          <h2>Movimento, coordenadas e algoritmos</h2>
          <p>
            Laboratório de Matemática e Pensamento Computacional com 16 exercícios progressivos e 4 desafios bônus sobre plano cartesiano,
            rotação, padrões, repetição, depuração e estratégia.
          </p>
          <p class="course-program">Plano cartesiano · Ângulos · Algoritmos · Programação em blocos · Estratégia</p>
          <span class="course-card-action">Abrir laboratório →</span>
        </article>
      </a>
    </div>
  </div>
</section>

<div class="education-note">
  As disciplinas e sequências didáticas do Ensino Fundamental serão incorporadas gradualmente a esta área, preservando os materiais já publicados no site.
</div>

<p class="mt-4"><a href="{{ '/aulas/' | relative_url }}">← Voltar para níveis de ensino</a></p>
