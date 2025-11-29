document.addEventListener('DOMContentLoaded', function() {
    const tagSearchInput = document.getElementById('tagSearch');
    const tagSuggestions = document.getElementById('tagSuggestions');
    
    // 标签搜索功能
    tagSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            tagSuggestions.innerHTML = '';
            return;
        }
        
        // 这里需要从服务器获取所有标签，或者通过其他方式获取
        // 暂时使用一个示例数组
        const allTags = ['技术', '博客', 'GitHub', '随笔', '教程', '生活'];
        
        const filteredTags = allTags.filter(tag => 
            tag.toLowerCase().includes(searchTerm)
        );
        
        if (filteredTags.length > 0) {
            tagSuggestions.innerHTML = filteredTags
                .map(tag => `<a href="/tag/${tag.toLowerCase().replace(/\s+/g, '-')}">${tag}</a>`)
                .join('');
        } else {
            tagSuggestions.innerHTML = '<div class="no-results">没有找到相关标签</div>';
        }
    });
    
    // 点击外部关闭建议
    document.addEventListener('click', function(e) {
        if (!tagSearchInput.contains(e.target) && !tagSuggestions.contains(e.target)) {
            tagSuggestions.innerHTML = '';
        }
    });
});