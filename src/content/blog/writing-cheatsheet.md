---
title: "博客写作速查：Frontmatter、公式与流程图"
description: "一份给自己留存的 Markdown 写作模板，涵盖草稿标记、代码高亮、LaTeX 与 Mermaid 语法。"
pubDate: 2026-11-20
category: "日常"
tags: ["指南", "Markdown"]
---

新建文章只需要在 `src/content/blog/` 下创建一个 `.md` 文件（或者建一个文件夹放 `index.md` 和局部配图）。

## Frontmatter 字段说明

```yaml
---
title: "文章标题"
description: "一句话摘要，会显示在首页卡片和 SEO 描述里"
pubDate: 2026-11-25
category: "技术分析" # 推荐：技术分析 / 个人感悟 / 日常
tags: ["Astro", "笔记"]
draft: false        # 设为 true 时仅在本地 dev 预览可见，生产构建自动跳过
pinned: false       # 设为 true 时置顶显示
---
```

## 常用扩展语法

- **行内公式**：用单个 `$` 包裹，例如 `$E = mc^2$`。
- **块级公式**：用成对的 `$$` 独立成段。
- **Mermaid 流程图**：使用 ` ```mermaid ` 代码块，会自动适配页面的明暗主题。
