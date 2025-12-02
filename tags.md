---
layout: default
title: 标签
---

<div class="tags-page">
    <header class="page-header">
        <h1>🏷️ 标签云</h1>
        <p>按标签浏览文章，快速找到感兴趣的内容</p>
    </header>

    <div class="tags-cloud">
        {% for tag in site.tags %}
            {% assign tag_name = tag[0] %}
            {% assign posts_count = tag[1] | size %}
            <a href="/tags/{{ tag_name | slugify }}/" class="tag-cloud-item" data-count="{{ posts_count }}">
                #{{ tag_name }}
                <span class="tag-count">({{ posts_count }})</span>
            </a>
        {% endfor %}
    </div>

    <div class="tags-section">
        <h2>📋 所有标签</h2>
        <div class="tags-list">
            {% assign tags_sorted = site.tags | sort %}
            {% for tag in tags_sorted %}
            {% assign tag_name = tag[0] %}
            {% assign posts = tag[1] %}
            <div class="tag-item">
                <div class="tag-header">
                    <a href="/tags/{{ tag_name | slugify }}/" class="tag-title">
                        #{{ tag_name }}
                        <span class="tag-count">({{ posts.size }})</span>
                    </a>
                </div>
                <div class="tag-posts">
                    {% for post in posts %}
                    <div class="tag-post-item">
                        <a href="{{ post.url | relative_url }}" class="tag-post-link">
                            {{ post.title }}
                        </a>
                        <time class="tag-post-date">{{ post.date | date: "%Y-%m-%d" }}</time>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div>