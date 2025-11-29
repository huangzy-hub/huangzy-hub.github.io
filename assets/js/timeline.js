document.addEventListener('DOMContentLoaded', function() {
    // 获取所有时间轴链接
    const timelineLinks = document.querySelectorAll('.timeline-date');
    
    timelineLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 平滑滚动到目标元素
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 高亮显示目标区域
                targetElement.style.backgroundColor = '#f0f8ff';
                setTimeout(() => {
                    targetElement.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
    
    // 添加滚动监听，高亮当前可见的时间轴项
    const timelineItems = document.querySelectorAll('.timeline-item');
    const dateSections = document.querySelectorAll('.date-section');
    
    function updateActiveTimeline() {
        let currentSection = '';
        
        dateSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        timelineItems.forEach(item => {
            const link = item.querySelector('.timeline-date');
            const linkTarget = link.getAttribute('href').substring(1);
            
            if (linkTarget === currentSection) {
                item.style.backgroundColor = '#e3f2fd';
                item.style.borderLeft = '3px solid var(--secondary-color)';
            } else {
                item.style.backgroundColor = '';
                item.style.borderLeft = '';
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveTimeline);
    updateActiveTimeline(); // 初始化
});