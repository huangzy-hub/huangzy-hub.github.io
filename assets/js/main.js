// 博客交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 时间轴交互功能
    initTimeline();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 代码块复制功能
    initCodeCopy();
    
    // 标签下拉菜单功能
    initTagsDropdown();
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

// 标签下拉菜单功能
function initTagsDropdown() {
    const dropdowns = document.querySelectorAll('.tags-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.tags-trigger');
        const menu = dropdown.querySelector('.tags-menu');
        
        // 点击触发器时切换菜单显示
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 关闭其他下拉菜单
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.tags-menu').style.maxHeight = '0';
                    otherDropdown.querySelector('.tags-menu').style.opacity = '0';
                }
            });
            
            // 切换当前菜单
            if (menu.style.maxHeight === '0px' || !menu.style.maxHeight) {
                menu.style.maxHeight = '300px';
                menu.style.opacity = '1';
            } else {
                menu.style.maxHeight = '0';
                menu.style.opacity = '0';
            }
        });
        
        // 点击标签项时添加点击效果
        const tagItems = menu.querySelectorAll('.tag-item');
        tagItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 添加点击动画效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // 可以在这里添加更多交互效果，比如高亮显示相关文章
                const tag = this.textContent.trim();
                console.log('点击了标签:', tag);
            });
        });
    });
    
    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.tags-menu');
            menu.style.maxHeight = '0';
            menu.style.opacity = '0';
        });
    });
    
    // 防止菜单内部点击时关闭菜单
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.tags-menu');
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}