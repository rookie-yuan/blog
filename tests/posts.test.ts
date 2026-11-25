import { describe, expect, it } from 'vitest';
import {
  calculateReadingTime,
  collectTags,
  encodeTagSlug,
  filterPublishedPosts,
  formatDate,
  getPostSlug,
  groupPostsByYear,
  sortPosts,
  type BlogPostData,
  type BlogPostLike,
} from '../src/utils/posts';

function makePost(overrides: {
  id: string;
  body?: string;
  data?: Partial<BlogPostData>;
}): BlogPostLike {
  return {
    id: overrides.id,
    body: overrides.body ?? '默认测试正文内容',
    data: {
      title: 'Test Title',
      description: 'Test Description',
      pubDate: new Date('2026-11-25T00:00:00Z'),
      category: '日常',
      tags: [],
      draft: false,
      pinned: false,
      ...overrides.data,
    },
  };
}

describe('getPostSlug', () => {
  it('strips .md extension and trailing /index', () => {
    expect(getPostSlug('hello-world.md')).toBe('hello-world');
    expect(getPostSlug('2026/my-post/index.md')).toBe('2026/my-post');
    expect(getPostSlug('nested/post')).toBe('nested/post');
  });
});

describe('calculateReadingTime', () => {
  it('returns at least 1 minute for empty or short text', () => {
    expect(calculateReadingTime('')).toBe(1);
    expect(calculateReadingTime('你好世界')).toBe(1);
  });

  it('handles mixed CJK characters and English words', () => {
    const cjk = '测'.repeat(600); // 2 mins at 300 chars/min
    const english = Array.from({ length: 200 }, () => 'word').join(' '); // 1 min at 200 words/min
    expect(calculateReadingTime(`${cjk} ${english}`)).toBe(3);
  });
});

describe('formatDate', () => {
  it('formats dates consistently as YYYY-MM-DD in UTC', () => {
    expect(formatDate(new Date('2026-11-05T00:00:00Z'))).toBe('2026-11-05');
    expect(formatDate('2026-01-09')).toBe('2026-01-09');
  });
});

describe('filterPublishedPosts', () => {
  const posts = [
    makePost({ id: 'pub', data: { draft: false } }),
    makePost({ id: 'draft', data: { draft: true } }),
  ];

  it('excludes drafts by default and includes them when requested', () => {
    expect(filterPublishedPosts(posts).map((p) => p.id)).toEqual(['pub']);
    expect(filterPublishedPosts(posts, true).map((p) => p.id)).toEqual(['pub', 'draft']);
  });
});

describe('sortPosts', () => {
  it('places pinned posts first and sorts each group by pubDate descending', () => {
    const posts = [
      makePost({ id: 'old', data: { pubDate: new Date('2026-01-01T00:00:00Z'), pinned: false } }),
      makePost({ id: 'pinned-old', data: { pubDate: new Date('2026-02-01T00:00:00Z'), pinned: true } }),
      makePost({ id: 'new', data: { pubDate: new Date('2026-11-25T00:00:00Z'), pinned: false } }),
      makePost({ id: 'pinned-new', data: { pubDate: new Date('2026-10-01T00:00:00Z'), pinned: true } }),
    ];

    expect(sortPosts(posts).map((p) => p.id)).toEqual([
      'pinned-new',
      'pinned-old',
      'new',
      'old',
    ]);
  });
});

describe('groupPostsByYear', () => {
  it('groups posts by UTC year descending', () => {
    const posts = [
      makePost({ id: 'a', data: { pubDate: new Date('2025-05-01T00:00:00Z') } }),
      makePost({ id: 'b', data: { pubDate: new Date('2026-11-20T00:00:00Z') } }),
      makePost({ id: 'c', data: { pubDate: new Date('2026-02-10T00:00:00Z') } }),
    ];
    const groups = groupPostsByYear(posts);
    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0].posts.map((p) => p.id)).toEqual(['b', 'c']);
    expect(groups[1].posts.map((p) => p.id)).toEqual(['a']);
  });
});

describe('encodeTagSlug & collectTags', () => {
  it('normalizes slashes and whitespace while preserving CJK', () => {
    expect(encodeTagSlug('技术分析')).toBe('技术分析');
    expect(encodeTagSlug('AI/LLM')).toBe('AI-LLM');
    expect(encodeTagSlug(' Web Dev ')).toBe('Web-Dev');
  });

  it('aggregates tag counts sorted by count desc then name', () => {
    const posts = [
      makePost({ id: '1', data: { tags: ['Astro', '架构'] } }),
      makePost({ id: '2', data: { tags: ['Astro', 'AI/LLM'] } }),
    ];
    expect(collectTags(posts)).toEqual([
      { tag: 'Astro', slug: 'Astro', count: 2 },
      { tag: 'AI/LLM', slug: 'AI-LLM', count: 1 },
      { tag: '架构', slug: '架构', count: 1 },
    ]);
  });
});
