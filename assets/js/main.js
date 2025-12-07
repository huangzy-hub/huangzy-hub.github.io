// 博客交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 背景图片切换功能
    initBackgroundSwitcher();
    
    // 时间轴交互功能
    initTimeline();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 代码块复制功能
    initCodeCopy();
    
    // 搜索功能
    initSearch();
    
    // 标签筛选功能
    initTagFilter();
    
    // 初始化滚动行为
    initScrollBehavior();
});

// 背景图片切换功能
function initBackgroundSwitcher() {
    // 背景图片列表
    const backgrounds = [
        '/assets/images/backgrounds/bg1.png',
        '/assets/images/backgrounds/bg2.png',
        '/assets/images/backgrounds/bg3.png'
    ];
    
    // 从localStorage获取上次使用的背景索引，如果没有则随机选择
    let lastBgIndex = parseInt(localStorage.getItem('lastBgIndex') || '-1');
    
    // 确保每次都是不同的背景
    let newBgIndex;
    do {
        newBgIndex = Math.floor(Math.random() * backgrounds.length);
    } while (backgrounds.length > 1 && newBgIndex === lastBgIndex);
    
    // 设置新的背景
    document.body.style.background = `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.6)),
                                     url('${backgrounds[newBgIndex]}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    
    // 保存当前背景索引
    localStorage.setItem('lastBgIndex', newBgIndex.toString());
}

// 时间轴功能
function initTimeline() {
    const timelinePosts = document.querySelectorAll('.timeline-post');
    const blogPosts = document.querySelectorAll('.post-card');
    
    timelinePosts.forEach(timelinePost => {
        timelinePost.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有高亮
            timelinePosts.forEach(post => post.classList.remove('active'));
            blogPosts.forEach(post => post.classList.remove('highlight'));
            
            // 添加高亮
            this.classList.add('active');
            
            // 找到对应的文章并高亮 - 使用更精确的选择器
            const postDate = this.getAttribute('data-date').trim();
            console.log('点击的时间轴文章日期:', postDate);
            
            // 尝试多种匹配方式
            let targetPost = document.querySelector(`.post-card[data-date="${postDate}"]`);
            
            // 如果第一种方式找不到，尝试其他可能的格式
            if (!targetPost) {
                // 尝试去除可能的空格或特殊字符
                const normalizedDate = postDate.replace(/\s+/g, '');
                targetPost = document.querySelector(`.post-card[data-date*="${normalizedDate}"]`);
            }
            
            if (!targetPost) {
                // 最后尝试遍历所有文章卡片
                for (let post of blogPosts) {
                    if (post.getAttribute('data-date') === postDate) {
                        targetPost = post;
                        break;
                    }
                }
            }
            
            console.log('找到的目标文章:', targetPost);
            
            if (targetPost) {
                targetPost.classList.add('highlight');
                
                // 平滑滚动到目标文章
                setTimeout(() => {
                    targetPost.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
                
                // 5秒后取消高亮
                setTimeout(() => {
                    targetPost.classList.remove('highlight');
                }, 5000);
            }
            
            // 更新URL（不刷新页面）
            const postUrl = this.getAttribute('href');
            history.pushState(null, '', postUrl);
        });
    });
    
    // 文章悬浮效果
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            const postDate = this.getAttribute('data-date').trim();
            const timelinePost = document.querySelector(`.timeline-post[data-date="${postDate}"]`);
            if (timelinePost) {
                timelinePost.style.backgroundColor = '#f0f7ff';
            }
        });
        
        post.addEventListener('mouseleave', function() {
            const postDate = this.getAttribute('data-date').trim();
            const timelinePost = document.querySelector(`.timeline-post[data-date="${postDate}"]`);
            if (timelinePost && !timelinePost.classList.contains('active')) {
                timelinePost.style.backgroundColor = '';
            }
        });
    });
}

// 全局高亮函数
function highlightPost(dateString) {
    const timelinePosts = document.querySelectorAll('.timeline-post');
    const blogPosts = document.querySelectorAll('.post-card');
    
    // 移除所有高亮
    timelinePosts.forEach(post => post.classList.remove('active'));
    blogPosts.forEach(post => post.classList.remove('highlight'));
    
    // 添加高亮
    const targetTimeline = document.querySelector(`.timeline-post[data-date="${dateString}"]`);
    
    // 使用更精确的方式查找目标文章
    let targetPost = document.querySelector(`.post-card[data-date="${dateString}"]`);
    
    // 如果第一种方式找不到，尝试其他可能的格式
    if (!targetPost) {
        // 尝试去除可能的空格或特殊字符
        const normalizedDate = dateString.replace(/\s+/g, '');
        targetPost = document.querySelector(`.post-card[data-date*="${normalizedDate}"]`);
    }
    
    if (!targetPost) {
        // 最后尝试遍历所有文章卡片
        for (let post of blogPosts) {
            if (post.getAttribute('data-date') === dateString) {
                targetPost = post;
                break;
            }
        }
    }
    
    console.log('高亮函数 - 目标时间轴:', targetTimeline);
    console.log('高亮函数 - 目标文章:', targetPost);
    
    if (targetTimeline) targetTimeline.classList.add('active');
    if (targetPost) {
        targetPost.classList.add('highlight');
        targetPost.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 代码块复制功能
function initCodeCopy() {
    // 为所有代码块添加复制按钮
    document.querySelectorAll('.highlight').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code';
        button.innerHTML = '📋';
        button.title = '复制代码';
        
        button.addEventListener('click', async () => {
            const code = block.querySelector('pre').innerText;
            
            try {
                await navigator.clipboard.writeText(code);
                button.innerHTML = '✅';
                button.style.background = '#4CAF50';
                
                setTimeout(() => {
                    button.innerHTML = '📋';
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                button.innerHTML = '❌';
                
                setTimeout(() => {
                    button.innerHTML = '📋';
                }, 2000);
            }
        });
        
        block.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.background = '#333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.zIndex = '10';
        
        block.appendChild(button);
    });
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');
    const resultsContainer = document.getElementById('results-container');
    const searchStats = document.getElementById('search-stats');
    const resultsCount = document.getElementById('results-count');
    
    // 搜索选项
    const searchTitle = document.getElementById('search-title');
    const searchContent = document.getElementById('search-content');
    const searchTags = document.getElementById('search-tags');
    
    // 文章数据（从页面中提取）
    const articles = [];
    document.querySelectorAll('.post-card').forEach(post => {
        const title = post.querySelector('.post-title').textContent.trim();
        const excerpt = post.querySelector('.post-excerpt').textContent.trim();
        const url = post.querySelector('.post-title a').getAttribute('href');
        const date = post.querySelector('.post-date').textContent.trim();
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.replace('#', '').trim());
        
        articles.push({
            title,
            excerpt,
            url,
            date,
            tags,
            element: post
        });
    });
    
    // 执行搜索
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            showPlaceholder();
            return;
        }
        
        const searchInTitle = searchTitle.checked;
        const searchInContent = searchContent.checked;
        const searchInTags = searchTags.checked;
        
        const results = articles.filter(article => {
            let match = false;
            
            if (searchInTitle && article.title.toLowerCase().includes(query)) {
                match = true;
            }
            
            if (searchInContent && article.excerpt.toLowerCase().includes(query)) {
                match = true;
            }
            
            if (searchInTags && article.tags.some(tag => tag.toLowerCase().includes(query))) {
                match = true;
            }
            
            return match;
        });
        
        displayResults(results, query);
    }
    
    // 显示搜索结果
    function displayResults(results, query) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>🔍 没有找到包含 "${query}" 的文章</p>
                    <p>试试其他关键词或调整搜索范围</p>
                </div>
            `;
            searchStats.style.display = 'none';
            return;
        }
        
        resultsContainer.innerHTML = results.map(article => `
            <div class="result-item">
                <div class="result-title">
                    <a href="${article.url}">${highlightText(article.title, query)}</a>
                </div>
                <div class="result-excerpt">
                    ${highlightText(article.excerpt, query)}
                </div>
                <div class="result-meta">
                    <span class="result-date">${article.date}</span>
                    <div class="result-tags">
                        ${article.tags.map(tag => `<a href="/tags/${tag}/" class="result-tag">#${tag}</a>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        resultsCount.textContent = results.length;
        searchStats.style.display = 'block';
    }
    
    // 高亮匹配的文本
    function highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    // 显示占位符
    function showPlaceholder() {
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <p>💡 输入关键词开始搜索</p>
                <p>您可以搜索文章标题、内容和标签</p>
            </div>
        `;
        searchStats.style.display = 'none';
    }
    
    // 清除搜索
    function clearSearch() {
        searchInput.value = '';
        searchTitle.checked = true;
        searchContent.checked = true;
        searchTags.checked = true;
        showPlaceholder();
    }
    
    // 事件监听
    searchButton.addEventListener('click', performSearch);
    clearButton.addEventListener('click', clearSearch);
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 实时搜索（可选）
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.trim()) {
                performSearch();
            }
        }, 300);
    });
    
    // 搜索选项改变时重新搜索
    [searchTitle, searchContent, searchTags].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (searchInput.value.trim()) {
                performSearch();
            }
        });
    });
}

// 标签筛选功能 - 增强版本
function initTagFilter() {
    const tagFilterBtns = document.querySelectorAll('.tag-filter-btn');
    const tagCloudItems = document.querySelectorAll('.tag-cloud-item');
    const postCards = document.querySelectorAll('.post-card');
    const postsSection = document.querySelector('.posts-section');
    const sectionHeader = document.querySelector('.section-header h3');
    
    if ((tagFilterBtns.length === 0 && tagCloudItems.length === 0) || postCards.length === 0) {
        return; // 如果没有找到元素，不执行
    }
    
    // 创建筛选结果提示
    const filterResultInfo = document.createElement('div');
    filterResultInfo.className = 'filter-result-info';
    filterResultInfo.style.cssText = `
        margin: 1rem 0;
        padding: 0.8rem 1.2rem;
        background: rgba(102, 126, 234, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.2);
        border-radius: 8px;
        color: var(--secondary-color);
        font-size: 0.9rem;
        font-weight: 600;
        text-align: center;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    postsSection.insertBefore(filterResultInfo, postsSection.querySelector('.posts-grid'));
    
    // 为每个筛选按钮添加点击事件
    tagFilterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedTag = this.getAttribute('data-tag');
            
            // 更新按钮状态
            tagFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选文章
            let visibleCount = 0;
            let filteredTags = [];
            
            postCards.forEach(card => {
                if (selectedTag === 'all') {
                    // 显示所有文章
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                    visibleCount++;
                } else {
                    // 检查文章是否包含选中的标签
                    const tags = card.querySelectorAll('.tag');
                    let hasTag = false;
                    let currentTags = [];
                    
                    tags.forEach(tag => {
                        const tagText = tag.textContent.replace('#', '').trim();
                        currentTags.push(tagText);
                        if (tagText === selectedTag) {
                            hasTag = true;
                        }
                    });
                    
                    if (hasTag) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                        visibleCount++;
                        filteredTags = filteredTags.concat(currentTags);
                    } else {
                        card.style.display = 'none';
                        card.style.animation = 'fadeOut 0.3s ease';
                    }
                }
            });
            
            // 更新筛选结果提示
            updateFilterResult(selectedTag, visibleCount, filteredTags);
            
            // 更新URL参数
            const url = new URL(window.location);
            if (selectedTag === 'all') {
                url.searchParams.delete('tag');
            } else {
                url.searchParams.set('tag', selectedTag);
            }
            window.history.pushState({}, '', url);
            
            // 如果筛选后有文章，滚动到文章区域
            if (visibleCount > 0) {
                setTimeout(() => {
                    postsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
    
    // 为标签云中的标签添加点击事件
    tagCloudItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedTag = this.textContent.trim().replace('#', '').replace(/\(\d+\)/, '').trim();
            
            // 找到对应的筛选按钮并触发点击
            const targetFilterBtn = document.querySelector(`.tag-filter-btn[data-tag="${selectedTag}"]`);
            if (targetFilterBtn) {
                targetFilterBtn.click();
            } else {
                // 如果没有对应的筛选按钮，直接执行筛选
                performTagFilter(selectedTag);
            }
        });
    });
    
    // 执行标签筛选的通用函数
    function performTagFilter(selectedTag) {
        // 更新所有筛选按钮状态
        tagFilterBtns.forEach(btn => btn.classList.remove('active'));
        
        // 筛选文章
        let visibleCount = 0;
        let filteredTags = [];
        
        postCards.forEach(card => {
            if (selectedTag === 'all') {
                // 显示所有文章
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
                visibleCount++;
            } else {
                // 检查文章是否包含选中的标签
                const tags = card.querySelectorAll('.tag');
                let hasTag = false;
                let currentTags = [];
                
                tags.forEach(tag => {
                    const tagText = tag.textContent.replace('#', '').trim();
                    currentTags.push(tagText);
                    if (tagText === selectedTag) {
                        hasTag = true;
                    }
                });
                
                if (hasTag) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                    visibleCount++;
                    filteredTags = filteredTags.concat(currentTags);
                } else {
                    card.style.display = 'none';
                    card.style.animation = 'fadeOut 0.3s ease';
                }
            }
        });
        
        // 更新筛选结果提示
        updateFilterResult(selectedTag, visibleCount, filteredTags);
        
        // 更新URL参数
        const url = new URL(window.location);
        if (selectedTag === 'all') {
            url.searchParams.delete('tag');
        } else {
            url.searchParams.set('tag', selectedTag);
        }
        window.history.pushState({}, '', url);
        
        // 如果筛选后有文章，滚动到文章区域
        if (visibleCount > 0) {
            setTimeout(() => {
                postsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }
    
    // 更新筛选结果提示
    function updateFilterResult(selectedTag, visibleCount, filteredTags) {
        if (selectedTag === 'all') {
            filterResultInfo.innerHTML = `📚 显示全部 ${visibleCount} 篇文章`;
            sectionHeader.innerHTML = '📝 最新文章';
        } else {
            filterResultInfo.innerHTML = `🏷️ 标签 <strong>#${selectedTag}</strong> - 共 ${visibleCount} 篇文章`;
            sectionHeader.innerHTML = `🏷️ 标签 <strong>#${selectedTag}</strong>`;
        }
        
        // 显示提示信息
        filterResultInfo.style.opacity = '1';
        filterResultInfo.style.transform = 'translateY(0)';
        
        // 3秒后淡出提示信息
        setTimeout(() => {
            filterResultInfo.style.opacity = '0';
            filterResultInfo.style.transform = 'translateY(-10px)';
        }, 3000);
    }
    
    // 检查URL参数，如果有标签参数则自动筛选
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    
    if (tagParam) {
        const targetBtn = document.querySelector(`.tag-filter-btn[data-tag="${tagParam}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
    
    // 添加淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 滚动行为初始化
    function initScrollBehavior() {
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.querySelector('.sidebar');
        
        if (!mainContent || !sidebar) return;
        
        let isScrolling = false;
        let scrollTimeout;
        
        // 监听主内容区的滚动
        mainContent.addEventListener('scroll', function() {
            if (!isScrolling) {
                sidebar.classList.add('sidebar-fixed');
                mainContent.classList.add('scrolling');
                isScrolling = true;
            }
            
            // 清除之前的定时器
            clearTimeout(scrollTimeout);
            
            // 设置新的定时器，滚动停止后移除固定效果
            scrollTimeout = setTimeout(() => {
                sidebar.classList.remove('sidebar-fixed');
                mainContent.classList.remove('scrolling');
                isScrolling = false;
            }, 150);
        });
        
        // 监听窗口滚动
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 200) {
                document.body.style.backgroundAttachment = 'scroll';
            } else {
                document.body.style.backgroundAttachment = 'fixed';
            }
        });
    }
}

