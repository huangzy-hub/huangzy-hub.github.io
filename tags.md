---
layout: default
title: 标签
---

<section class="tags-page">
    <h2>所有标签</h2>
    
    {% assign tags_list = "" | split: "" %}
    
    {% for post in site.posts %}
        {% if post.tags %}
            {% for tag in post.tags %}
                {% unless tags_list contains tag %}
                    {% assign tags_list = tags_list | push: tag %}
                {% endunless %}
            {% endfor %}
        {% endif %}
    {% endfor %}
    
    {% assign tags_list = tags_list | sort %}
    
    <div class="tags-cloud">
        {% for tag in tags_list %}
            <a href="/tag/{{ tag | slugify }}" class="tag-item">
                {{ tag }} ({{ site.posts | where: "tags", tag | size }})
            </a>
        {% endfor %}
    </div>
</section>