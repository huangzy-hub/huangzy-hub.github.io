## 引言

在博客文章中插入图片是非常重要的功能，它可以让你的内容更加生动和直观。本文将介绍如何在Jekyll博客中正确插入和使用图片。

## 图片的基本语法

在Markdown中，插入图片的基本语法如下：

```markdown
![图片描述](图片路径)
```

例如：

```markdown
![示例图片](/photo/sample-image.png)
```

效果如下：

![示例图片](/photo/sample-image.png)

## 图片路径的几种方式

### 1. 相对路径

使用相对于当前文章的路径：

```markdown
![示例图片](../../posts/sample-image.png)
```

### 2. 绝对路径

从网站根目录开始的路径：

```markdown
![示例图片](/photo/sample-image.png)
```

### 3. 网络图片

也可以直接使用网络上的图片：

```markdown
![网络图片](https://example.com/image.jpg)
```

## 图片的高级用法

### 指定图片尺寸

可以使用HTML标签来指定图片尺寸：

```html
<img src="/photo/sample-image.png" alt="示例图片" width="300" height="200">
```

效果如下：

<img src="/photo/sample-image.png" alt="示例图片" width="300" height="200">

### 添加图片链接

将图片包裹在链接中：

```markdown
[![示例图片](/photo/sample-image.png)](/about)
```

效果如下：

[![示例图片](/photo/sample-image.png)](/about)

### 图片对齐方式

使用HTML标签控制图片对齐：

```html
<div style="text-align: center;">
  <img src="/photo/sample-image.png" alt="居中图片" style="width: 200px;">
</div>

<div style="float: right; margin-left: 20px;">
  <img src="/photo/sample-image.png" alt="右对齐图片" style="width: 150px;">
</div>

<p>这是一段文字，图片会显示在右侧。当文字足够多时，会围绕图片排列。</p>

<div style="clear: both;"></div>
```

效果如下：

<div style="text-align: center;">
  <img src="/photo/sample-image.png" alt="居中图片" style="width: 200px;">
</div>

<div style="float: right; margin-left: 20px;">
  <img src="/photo/sample-image.png" alt="右对齐图片" style="width: 150px;">
</div>

<p>这是一段文字，图片会显示在右侧。当文字足够多时，会围绕图片排列。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

<div style="clear: both;"></div>

## 图片优化建议

1. **压缩图片**：使用工具如TinyPNG压缩图片大小
2. **选择合适的格式**：
   - JPEG：适合照片类图片
   - PNG：适合图标和透明背景图片
   - WebP：现代格式，压缩率高
3. **指定尺寸**：根据显示需求指定合适的图片尺寸
4. **添加alt属性**：提高可访问性和SEO

## 常见问题

### 图片不显示

检查以下几点：
- 图片路径是否正确
- 图片文件是否存在
- 图片文件名是否区分大小写
- 图片权限是否正确

### 图片加载慢

优化方法：
- 压缩图片文件大小
- 使用CDN加速
- 实现懒加载
- 使用响应式图片

## 总结

正确使用图片可以让你的博客文章更加丰富多彩。掌握基本的图片插入语法和一些高级技巧，可以帮助你创建更加吸引人的内容。

记住要优化图片大小和格式，确保良好的用户体验。同时，也要注意图片的版权问题，使用自己拥有版权或获得授权的图片。

希望这篇教程对你有所帮助！