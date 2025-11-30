// 博客交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 时间轴交互功能
    initTimeline();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 代码块复制功能
    initCodeCopy();
    
    // 标签云交互功能
    initTagsCloud();
});

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
            
            // 找到对应的文章并高亮
            const postDate = this.getAttribute('data-date');
            const targetPost = document.querySelector(`.post-card[data-date="${postDate}"]`);
            
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
            const postDate = this.getAttribute('data-date');
            const timelinePost = document.querySelector(`.timeline-post[data-date="${postDate}"]`);
            if (timelinePost) {
                timelinePost.style.backgroundColor = '#f0f7ff';
            }
        });
        
        post.addEventListener('mouseleave', function() {
            const postDate = this.getAttribute('data-date');
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
    const targetPost = document.querySelector(`.post-card[data-date="${dateString}"]`);
    
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

// 主题切换功能（可选）
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    // 保存用户偏好
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 加载保存的主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// 图片懒加载
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 标签云交互功能
function initTagsCloud() {
    const tagItems = document.querySelectorAll('.tag-cloud-item');
    const postCards = document.querySelectorAll('.post-card');
    
    // 为每个标签添加点击事件
    tagItems.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tagName = this.getAttribute('data-tag');
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 150);
            
            // 移除其他标签的激活状态
            tagItems.forEach(otherTag => {
                if (otherTag !== this) {
                    otherTag.classList.remove('active');
                }
            });
            
            // 切换当前标签的激活状态
            this.classList.toggle('active');
            
            // 显示/隐藏相关文章
            postCards.forEach(postCard => {
                const postTags = postCard.querySelectorAll('.post-tags .tag');
                let hasTag = false;
                
                // 检查文章是否包含当前标签
                postTags.forEach(postTag => {
                    const tagText = postTag.textContent.replace('#', '').trim();
                    if (tagText === tagName) {
                        hasTag = true;
                    }
                });
                
                // 如果标签被激活，只显示包含该标签的文章
                if (this.classList.contains('active')) {
                    if (hasTag) {
                        postCard.style.display = 'block';
                        postCard.style.animation = 'fadeIn 0.5s ease-in';
                    } else {
                        postCard.style.display = 'none';
                    }
                } else {
                    // 如果标签未被激活，显示所有文章
                    postCard.style.display = 'block';
                    postCard.style.animation = 'fadeIn 0.5s ease-in';
                }
            });
            
            // 更新URL参数
            const url = new URL(window.location);
            if (this.classList.contains('active')) {
                url.searchParams.set('tag', tagName);
            } else {
                url.searchParams.delete('tag');
            }
            window.history.pushState({}, '', url);
        });
        
        // 根据标签使用频率设置大小
        const tagName = this.getAttribute('data-tag');
        let tagCount = 0;
        
        // 手动计算标签使用频率
        postCards.forEach(postCard => {
            const postTags = postCard.querySelectorAll('.post-tags .tag');
            postTags.forEach(postTag => {
                const tagText = postTag.textContent.replace('#', '').trim();
                if (tagText === tagName) {
                    tagCount++;
                }
            });
        });
        
        if (tagCount >= 5) {
            this.classList.add('size-5');
        } else if (tagCount >= 4) {
            this.classList.add('size-4');
        } else if (tagCount >= 3) {
            this.classList.add('size-3');
        } else if (tagCount >= 2) {
            this.classList.add('size-2');
        } else {
            this.classList.add('size-1');
        }
    });
    
    // 检查URL参数，如果有标签参数则自动激活对应标签
    const urlParams = new URLSearchParams(window.location.search);
    const activeTag = urlParams.get('tag');
    
    if (activeTag) {
        const activeTagElement = document.querySelector(`.tag-cloud-item[data-tag="${activeTag}"]`);
        if (activeTagElement) {
            activeTagElement.click();
        }
    }
}