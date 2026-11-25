import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../site.config';
import { filterPublishedPosts, getPostSlug, sortPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('blog');
  const posts = sortPosts(filterPublishedPosts(allPosts, false));

  return rss({
    title: siteConfig.siteName,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${getPostSlug(post.id)}/`,
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  });
}
