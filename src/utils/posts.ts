export interface BlogPostData {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  category: string;
  tags: string[];
  draft: boolean;
  pinned: boolean;
}

export interface BlogPostLike {
  id: string;
  body?: string;
  data: BlogPostData;
}

export function getPostSlug(id: string): string {
  return id.replace(/\.md$/, '').replace(/\/index$/, '');
}

export function calculateReadingTime(rawBody: string): number {
  const cleaned = rawBody
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_\-[\]()]/g, ' ');

  const cjkMatches = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? [];
  const latinMatches =
    cleaned
      .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, ' ')
      .trim()
      .match(/[A-Za-z0-9_'-]+/g) ?? [];

  const minutes = cjkMatches.length / 300 + latinMatches.length / 200;
  return Math.max(1, Math.ceil(minutes));
}

export function formatDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function filterPublishedPosts<T extends BlogPostLike>(
  posts: T[],
  includeDrafts = false
): T[] {
  if (includeDrafts) return [...posts];
  return posts.filter((post) => !post.data.draft);
}

export function sortPosts<T extends BlogPostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) {
      return a.data.pinned ? -1 : 1;
    }
    return b.data.pubDate.getTime() - a.data.pubDate.getTime();
  });
}

export function groupPostsByYear<T extends BlogPostLike>(
  posts: T[]
): Array<{ year: number; posts: T[] }> {
  const sorted = [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  const map = new Map<number, T[]>();

  for (const post of sorted) {
    const year = post.data.pubDate.getUTCFullYear();
    const list = map.get(year);
    if (list) {
      list.push(post);
    } else {
      map.set(year, [post]);
    }
  }

  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, group]) => ({ year, posts: group }));
}

export function encodeTagSlug(tag: string): string {
  return tag.trim().replace(/\//g, '-').replace(/\s+/g, '-');
}

export function collectTags<T extends BlogPostLike>(
  posts: T[]
): Array<{ tag: string; slug: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({
      tag,
      slug: encodeTagSlug(tag),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'en'));
}
