# Personal Blog (`blog.yuancao.online`) Implementation Plan

> Saved from the approved execution plan.

- **Goal:** Build a modern-geek personal blog using Astro 7 + Tailwind CSS v4 (`技术分析`, `个人感悟`, `日常`), configure GitHub Actions auto-deployment, deploy the initial static build to `~/blog` on the remote server as a lightweight `caddy:2-alpine` container attached to `edge-gateway`, and verify end-to-end.
- **Spec:** `docs/superpowers/specs/2026-11-25-personal-blog-design.md`

## Steps
1. Initialize Git repo, `.gitignore`, spec doc, and plan doc.
2. Scaffold Astro 7 + Tailwind v4 project, `site.config.ts`, `content.config.ts`, `astro.config.mjs`.
3. Implement & unit-test `src/utils/posts.ts` and `src/plugins/remark-mermaid.mjs` (TDD with Vitest).
4. Build modern-geek design system (`src/styles/global.css`), layouts (`BaseLayout`, `PostLayout`), and components (`Header`, `Footer`, `ThemeToggle`, `SearchModal`, `PostCard`, `TableOfContents`, `Giscus`).
5. Build all pages (`/`, `/posts`, `/posts/[...slug]`, `/archive`, `/tags`, `/tags/[tag]`, `/about`, `/404`, `/rss.xml`) and 3 starter Chinese Markdown posts; run `npm test`, `npm run check`, `npm run build`.
6. Add `deploy/Caddyfile`, `deploy/docker-compose.yml`, `deploy/edge-gateway.Caddyfile.snippet`, `.github/workflows/deploy.yml`, and `README.md`.
7. Deploy initial `dist/` to remote `~/blog` via `remote-dev` MCP, start `blog-web`, verify all endpoints from inside `edge-gateway-caddy-1`, and confirm local checks.
