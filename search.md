---
layout: default
title: 搜索
---

<div class="search-page">
    <header class="page-header">
        <h1>🔍 搜索文章</h1>
        <p>输入关键词搜索相关文章</p>
    </header>

    <div class="search-container">
        <div class="search-box">
            <input type="text" id="search-input" placeholder="输入关键词搜索..." autocomplete="off">
            <button id="search-button">搜索</button>
            <button id="clear-button">清除</button>
        </div>

        <div class="search-filters">
            <h3>搜索范围</h3>
            <div class="filter-options">
                <label>
                    <input type="checkbox" id="search-title" checked>
                    <span>标题</span>
                </label>
                <label>
                    <input type="checkbox" id="search-content" checked>
                    <span>内容</span>
                </label>
                <label>
                    <input type="checkbox" id="search-tags" checked>
                    <span>标签</span>
                </label>
            </div>
        </div>

        <div class="search-results">
            <div id="results-container">
                <div class="search-placeholder">
                    <p>💡 输入关键词开始搜索</p>
                    <p>您可以搜索文章标题、内容和标签</p>
                </div>
            </div>
        </div>

        <div class="search-stats" id="search-stats" style="display: none;">
            <p>找到 <span id="results-count">0</span> 篇相关文章</p>
        </div>
    </div>
</div>