export interface NavItem {
  label: string;
  href: string;
}

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title';
  reactionsEnabled: '1' | '0';
  emitMetadata: '1' | '0';
  inputPosition: 'top' | 'bottom';
  lang: string;
}

export const siteConfig = {
  title: '~/blog',
  siteName: 'Yuancao Blog',
  description: '记录技术分析、个人感悟与日常思考。',
  author: 'Yuancao',
  authorBio:
    '开发者与写作者，这里存放我对技术的拆解、日常的观察，以及一些值得留存的思考。',
  siteUrl: 'https://blog.yuancao.online',
  lang: 'zh-CN',
  categories: ['技术分析', '个人感悟', '日常'] as const,
  nav: [
    { label: '文章', href: '/posts' },
    { label: '归档', href: '/archive' },
    { label: '标签', href: '/tags' },
    { label: '关于', href: '/about' },
  ] satisfies NavItem[],
  social: {
    github: 'https://github.com/rookie-yuan',
    rss: '/rss.xml',
  },
  katexVersion: '0.19.1',
  mermaidCdnUrl:
    'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs',
  giscus: {
    enabled: true,
    repo: 'rookie-yuan/blog',
    repoId: 'R_kgDOQwAsog',
    category: 'Announcements',
    categoryId: 'DIC_kwDOQwAsos4DL8k-',
    mapping: 'pathname',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'zh-CN',
  } satisfies GiscusConfig,
};
