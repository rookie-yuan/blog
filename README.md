# Yuancao Blog (`blog.yuancao.online`)

基于 Astro 7 + Tailwind CSS v4 构建的现代极客风格个人博客，纯静态生成并托管在轻量 `caddy:2-alpine` 容器中。

## 常用命令

```bash
npm run dev      # 本地开发预览（含 draft: true 草稿）
npm test         # 运行单元测试
npm run check    # 运行 Astro / TypeScript 类型检查
npm run build    # 构建 dist/ 并生成 Pagefind 全文搜索索引
npm run preview  # 本地预览构建产物
```

## 写文章

在 `src/content/blog/` 下新建 `.md` 文件（或 `<slug>/index.md` 搭配局部图片）：

```markdown
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-11-25
category: "技术分析" # 技术分析 | 个人感悟 | 日常
tags: ["Astro", "笔记"]
draft: false
pinned: false
---
```

- **代码高亮**：使用标准 Markdown 代码块，自动支持明暗双主题与一键复制。
- **数学公式**：支持 `$inline$` 与 `$$display$$`（KaTeX 构建期直出）。
- **流程图**：使用 ` ```mermaid ` 代码块，按需加载并自动跟随明暗主题。

## 个性化与评论配置

站点名称、简介、社交链接和 Giscus 评论参数集中位于 `src/site.config.ts`。
如需开启评论：
1. 准备一个公开 GitHub 仓库并开启 Discussions，安装 [Giscus App](https://github.com/apps/giscus)。
2. 在 `src/site.config.ts` 中将 `giscus.enabled` 设为 `true`，并填入 `repo`、`repoId`、`categoryId`。

## GitHub Actions 自动发布配置

推送到 `main` 分支后会自动构建并同步至服务器 `~/blog`。在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 中添加：

- `SSH_HOST`：服务器 IP 或域名
- `SSH_USER`：SSH 登录用户名
- `SSH_PRIVATE_KEY`：对应的私钥内容
- `SSH_PORT`（可选，默认 `22`）
- `DEPLOY_DIR`（可选，默认 `~/blog`）

## 一次性网关接入（root 权限）

将 `deploy/edge-gateway.Caddyfile.snippet` 的内容追加到服务器 `/opt/gateway/Caddyfile`，然后重载网关：

```bash
sudo tee -a /opt/gateway/Caddyfile >/dev/null <<'EOF'

blog.yuancao.online {
    encode zstd gzip
    reverse_proxy blog-web:80
}
EOF
sudo docker exec edge-gateway-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```
