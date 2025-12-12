---
layout: default
title: 欢迎来到我的博客
---

<div class="welcome-section">
    <div class="welcome-content">
        <h1>欢迎来到我的博客</h1>
        <p>记录技术学习与思考的地方</p>
        <div class="welcome-actions">
            <a href="#posts" class="btn btn-primary">开始阅读</a>
            <a href="#about" class="btn btn-secondary">了解更多</a>
        </div>
    </div>
</div>

<style>
.welcome-section {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    padding: 6rem 0;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
}

.welcome-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
}

.welcome-content h1 {
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
}

.welcome-content p {
    font-size: 1.3rem;
    color: var(--text-light);
    margin-bottom: 2.5rem;
    line-height: 1.6;
}

.welcome-actions {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .welcome-section {
        padding: 4rem 0;
    }
    
    .welcome-content h1 {
        font-size: 2.2rem;
        margin-bottom: 1rem;
    }
    
    .welcome-content p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }
    
    .welcome-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .welcome-actions .btn {
        width: 200px;
    }
}
</style>