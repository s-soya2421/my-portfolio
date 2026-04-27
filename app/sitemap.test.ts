import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { BLOG_POSTS_PER_PAGE } from '@/lib/blog';
import { type BlogFrontmatter, loadCollection } from '@/lib/content';
import { siteConfig } from '@/lib/site';

const getUrls = async () => {
  const entries = await sitemap();
  return entries.map((entry) => entry.url);
};

const getExpectedPaginationUrls = async (locale: 'ja' | 'en') => {
  const posts = await loadCollection<BlogFrontmatter>(
    'blog',
    locale === siteConfig.defaultLocale ? siteConfig.defaultLocale : locale
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_POSTS_PER_PAGE));
  const prefix = locale === siteConfig.defaultLocale ? '/blog' : '/en/blog';

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => {
    const page = index + 2;
    return `${siteConfig.url}${prefix}/page/${page}`;
  });
};

describe('sitemap', () => {
  it('includes static routes for supported locales', async () => {
    const urls = await getUrls();

    expect(urls).toEqual(
      expect.arrayContaining([
        siteConfig.url,
        `${siteConfig.url}/about`,
        `${siteConfig.url}/projects`,
        `${siteConfig.url}/blog`,
        `${siteConfig.url}/en`,
        `${siteConfig.url}/en/about`,
        `${siteConfig.url}/en/projects`,
        `${siteConfig.url}/en/blog`,
      ])
    );
  });

  it('includes generated blog pagination routes', async () => {
    const urls = await getUrls();
    const expectedUrls = [
      ...(await getExpectedPaginationUrls('ja')),
      ...(await getExpectedPaginationUrls('en')),
    ];

    expect(expectedUrls.length).toBeGreaterThan(0);
    expect(urls).toEqual(expect.arrayContaining(expectedUrls));
    expect(urls).not.toContain(`${siteConfig.url}/blog/page/1`);
    expect(urls).not.toContain(`${siteConfig.url}/en/blog/page/1`);
  });

  it('excludes draft content routes', async () => {
    const urls = await getUrls();

    expect(urls).not.toContain(`${siteConfig.url}/projects/ai-workflow`);
    expect(urls).not.toContain(`${siteConfig.url}/en/projects/ai-workflow`);
  });
});
