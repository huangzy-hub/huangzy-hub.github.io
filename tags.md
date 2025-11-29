---
layout: page
title: 所有标签
permalink: /tags/
---

<div class="tags-page">
    <header class="page-header">
        <h1>🏷️ 所有标签</h1>
    </header>

    <div class="tags-cloud">
        {% assign tags = site.tags | sort %}
        {% for tag in tags %}
            {% assign tag_name = tag[0] %}
            {% assign post_count = tag[1] | size %}
            {% assign tag_size = post_count %}
            {% if post_count > 5 %}
                {% assign tag_size = 5 %}
            {% endif %}
            <a href="{{ '/tags/' | relative_url }}{{ tag_name | slugify }}" 
               class="tag tag-size-{{ tag_size }}">
                #{{ tag_name }} ({{ post_count }})
            </a>
        {% endfor %}
    </div>
</div>