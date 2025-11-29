---
layout: page
title: 文章归档
permalink: /archive/
---

# 文章归档 📚

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

{% for year in posts_by_year %}
## {{ year.name }} 年

<ul class="archive-list">
    {% for post in year.items %}
    <li class="archive-item">
        <time>{{ post.date | date: "%m-%d" }}</time>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.tags %}
        <div class="archive-tags">
            {% for tag in post.tags %}
            <span class="tag">#{{ tag }}</span>
            {% endfor %}
        </div>
        {% endif %}
    </li>
    {% endfor %}
</ul>
{% endfor %}