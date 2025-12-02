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
    
    // 标签过滤功能
    initTagFilter();
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
    document.body.style.background = `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.7)),
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

// 标签过滤功能
function initTagFilter() {
    // 为所有标签添加点击事件
    document.querySelectorAll('.tag-filter').forEach(tagElement => {
        tagElement.addEventListener('click', function(e) {
            e.preventDefault();
            const tagName = this.getAttribute('data-tag');
            filterByTag(e, tagName);
        });
    });
}

// 根据标签过滤文章
function filterByTag(event, tagName) {
    event.preventDefault();
    
    const allPosts = document.querySelectorAll('.post-card');
    let hasVisiblePosts = false;
    
    allPosts.forEach(post => {
        const postTags = post.querySelectorAll('.tag');
        let hasTag = false;
        
        // 检查文章是否包含该标签
        postTags.forEach(tag => {
            const tagText = tag.textContent.substring(1); // 移除 # 符号
            if (tagText === tagName) {
                hasTag = true;
            }
        });
        
        // 显示或隐藏文章
        if (hasTag || tagName === 'all') {
            post.style.display = 'block';
            hasVisiblePosts = true;
        } else {
            post.style.display = 'none';
        }
    });
    
    // 更新URL状态
    const url = new URL(window.location);
    url.searchParams.set('tag', tagName);
    window.history.pushState({ tag: tagName }, '', url);
    
    // 显示提示信息
    showFilterMessage(tagName, hasVisiblePosts);
}

// 显示过滤提示信息
function showFilterMessage(tagName, hasPosts) {
    // 移除之前的提示信息
    const existingMessage = document.querySelector('.filter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新的提示信息
    const message = document.createElement('div');
    message.className = 'filter-message';
    message.textContent = hasPosts ? `显示标签 "${tagName}" 的文章` : `没有找到标签 "${tagName}" 的文章`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // 3秒后自动移除
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

