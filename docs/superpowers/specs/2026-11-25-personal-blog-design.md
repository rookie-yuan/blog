# 个人博客设计方案（v1）

- **日期**：2026-11-25
- **域名**：`https://blog.yuancao.online`
- **状态**：已确认

## 1. 目标与边界

- **核心定位**：面向读者的个人博客，承载**技术分析、个人感悟、日常文章**三类内容。
- **目标（Goals）**：
  - 现代极客风格（冷白/纯黑双主题、1px 细边框、单一克制强调色、等宽元数据），中文长文与技术内容阅读体验极佳。
  - 写作零摩擦：本地 Markdown 写作预览，纯文本文件管理，为将来平滑演进到“路线二（网页后台）”留好基础。
  - 服务器极轻运行：仅运行纯静态 `caddy:2-alpine` 容器（内存上限 `96m`），不挤压 2G 服务器上现有 MySQL/Redis/业务容器。
- **非目标（Non-Goals）**：v1 不做网页在线编辑器、用户登录体系、自建数据库或后端评论存储。
- **反目标（Anti-Goals）**：不在 2G 服务器上执行 Node/Astro 编译构建，不引入重型常驻 SSR 进程。

## 2. 环境与约束

- **服务器**：OpenCloudOS 9.4（2 核 / 1.9 GiB 内存，可用约 915 MiB），已安装 Docker & Docker Compose v5.6.0，已缓存 `caddy:2-alpine` 镜像。
- **网关**：宿主机 80/443 端口由 `edge-gateway-caddy-1` 统一接管并负责 HTTPS（位于 `edge-gateway` Docker 网络）。`/opt/gateway/Caddyfile` 属主为 `root`，最终域名接入需由服务器管理员执行 `caddy reload`。
- **网络条件**：服务器与主要使用网络位于新加坡，可正常使用 Google Fonts（`Inter`、`JetBrains Mono`、`Noto Sans SC`）与 `cdn.jsdelivr.net`（KaTeX CSS、Mermaid ESM），保持构建产物 `dist/` 轻量（< 500 KB）。

## 3. 技术选型

- **框架**：Astro 7 + Tailwind CSS v4（`@tailwindcss/vite` + `@tailwindcss/typography`）
- **内容管理**：Astro Content Collections（`src/content.config.ts` + `glob` loader + `astro/zod`）
- **技术写作管线**：
  - 代码高亮：Astro 内置 Shiki 双主题（`github-light` / `github-dark`），带语言标签栏与一键复制按钮。
  - 数学公式：`remark-math` + `rehype-katex` 构建期直出静态 HTML，配合精确版本匹配的 KaTeX CDN 样式表。
  - 流程图：自定义 `remark-mermaid` 插件在 Shiki 之前保留原始代码块，页面仅在存在图表时按需从 CDN 懒加载 Mermaid ESM，并随站点明暗主题重绘。
- **全文搜索**：Pagefind 构建期生成纯静态分片索引，前端 `⌘K` / `Ctrl+K` 弹窗按需加载。
- **评论**：Giscus（基于 GitHub Discussions），与明暗主题同步；未配置仓库参数时静默隐藏。
- **订阅与 SEO**：`@astrojs/rss`（`/rss.xml`）、`@astrojs/sitemap`（`/sitemap-index.xml`）、规范 `canonical` 与 Open Graph 元信息。

## 4. 页面结构

1. **首页（`/`）**：极简导航栏 + 个人简介区 + 分类快速筛选（全部 / 技术分析 / 个人感悟 / 日常）+ 桌面端双列细边框卡片流。
2. **文章列表（`/posts`）**：全量已发布文章与分类筛选。
3. **文章详情（`/posts/[slug]`）**：居中 720px 主阅读区 + 桌面端右侧粘性大纲（TOC）+ 上下篇导航 + Giscus 评论区。
4. **归档（`/archive`）**：按年份聚合的紧凑等宽时间线。
5. **标签（`/tags` 与 `/tags/[tag]`）**：标签聚合与单标签文章列表。
6. **关于（`/about`）** 与 **404（`/404`）**。

## 5. 部署与发布流

- **首次部署**：本地构建 `dist/` 后通过 `remote-dev` MCP 上传至服务器 `~/blog/dist`，启动 `blog-web`（`caddy:2-alpine`）容器加入 `edge-gateway` 网络。
- **日常发布**：GitHub Actions（`.github/workflows/deploy.yml`）在推送 `main` 分支后自动执行 `npm ci && npm run build`，并通过 SSH 将 `dist/` 原子替换到服务器 `~/blog/dist`。
