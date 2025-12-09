---
layout: page
permalink: /teaching/
title: teaching
description:
nav: true
nav_order: 6
---
## Teaching

Aqui você encontra materiais de aulas, projetos guiados e atividades que utilizo em disciplinas e oficinas.

{% assign courses = site.teaching | sort: "date" | reverse %}

<ul class="post-list">
  {% for course in courses %}
  <li>
    <h3>
      <a href="{{ course.url | relative_url }}">
        {{ course.title }}
      </a>
    </h3>
    {% if course.description %}
      <p>{{ course.description }}</p>
    {% endif %}

    <p class="post-meta">
      {% if course.date %}
        {{ course.date | date: "%Y" }} ·
      {% endif %}
      {% if course.tags %}
        {{ course.tags | join: " · " }}
      {% endif %}
    </p>
  </li>
  {% endfor %}
</ul>