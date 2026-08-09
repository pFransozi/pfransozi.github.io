---
layout: page
permalink: /teaching/
title: teaching
description:
nav: false
nav_order: 6
---
## Teaching

Esta página permanece disponível para compatibilidade com links antigos. Os materiais didáticos agora também são apresentados de forma organizada na nova área de [aulas]({{ '/aulas/' | relative_url }}).

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