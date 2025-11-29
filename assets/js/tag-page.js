document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的标签参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    
    if (tag) {
        // 可以在这里添加根据标签筛选文章的逻辑
        // 由于Jekyll是静态站点，这个功能需要在服务器端处理
        console.log('当前标签:', tag);
    }
});