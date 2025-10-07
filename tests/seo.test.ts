import { describe, expect, it } from 'vitest';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

describe('SEO helpers', () => {
  it('builds metadata with overrides', () => {
    const metadata = buildMetadata({
      title: 'Test Page',
      description: 'Test description',
      slug: '/blog/test-page',
      type: 'article',
      image: '/images/test.png',
      publishedTime: '2024-03-01',
      updatedTime: '2024-03-05',
      tags: ['nextjs']
    });

    expect(metadata.title).toBe('Test Page');
    expect(metadata.description).toBe('Test description');
    expect(metadata.alternates?.canonical).toBe(`${siteConfig.url}/blog/test-page`);

    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.type).toBe('article');
    expect(og?.url).toBe(`${siteConfig.url}/blog/test-page`);

    const ogImages = Array.isArray(og?.images) ? og.images : [og?.images];
    expect(ogImages[0]).toBe(`${siteConfig.url}/images/test.png`);
    expect(og?.publishedTime).toBe('2024-03-01');
    expect(og?.modifiedTime).toBe('2024-03-05');
    expect(og?.tags).toEqual(['nextjs']);

    const twitterImages = Array.isArray(metadata.twitter?.images)
      ? metadata.twitter.images
      : [metadata.twitter?.images];
    expect(twitterImages[0]).toBe(`${siteConfig.url}/images/test.png`);
  });

  it('creates article structured data', () => {
    const jsonLd = articleJsonLd({
      title: 'Structured Data',
      description: 'Structured data test',
      datePublished: '2024-02-01',
      slug: '/blog/structured-data'
    });

    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.headline).toBe('Structured Data');
    expect(jsonLd.dateModified).toBe('2024-02-01');
    expect(jsonLd.url).toBe(`${siteConfig.url}/blog/structured-data`);
  });

  it('maps breadcrumb items with positional indices', () => {
    const breadcrumbs = breadcrumbJsonLd([
      { name: 'Home', url: `${siteConfig.url}/` },
      { name: 'Projects', url: `${siteConfig.url}/projects` }
    ]);

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement).toHaveLength(2);
    expect(breadcrumbs.itemListElement[1]).toMatchObject({
      position: 2,
      name: 'Projects',
      item: `${siteConfig.url}/projects`
    });
  });
});
