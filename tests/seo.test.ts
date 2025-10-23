import { describe, expect, it } from 'vitest';
import {
  articleJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd
} from '@/lib/seo';
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
      slug: '/blog/structured-data',
      image: '/images/article.png'
    });

    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.headline).toBe('Structured Data');
    expect(jsonLd.dateModified).toBe('2024-02-01');
    expect(jsonLd.url).toBe(`${siteConfig.url}/blog/structured-data`);
    expect(jsonLd.mainEntityOfPage).toEqual({
      '@id': `${siteConfig.url}/blog/structured-data#webpage`
    });
    expect(jsonLd.image).toBe(`${siteConfig.url}/images/article.png`);
    expect(jsonLd.inLanguage).toBe(siteConfig.defaultLocale);
    expect(Array.isArray(jsonLd.author)).toBe(true);
    expect(jsonLd.author[0]).toMatchObject({
      '@id': `${siteConfig.url}#person`
    });
  });

  it('maps breadcrumb items with positional indices', () => {
    const breadcrumbs = buildBreadcrumbJsonLd({
      slug: '/projects/sample',
      items: [
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Sample', url: '/projects/sample' }
      ]
    });

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs['@id']).toBe(`${siteConfig.url}/projects/sample#breadcrumb`);
    expect(breadcrumbs.itemListElement).toHaveLength(3);
    expect(breadcrumbs.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'Sample',
      item: `${siteConfig.url}/projects/sample`
    });
  });

  it('links webpage structured data with breadcrumb list', () => {
    const webPage = webPageJsonLd({
      slug: '/projects/sample',
      title: 'Sample Project',
      description: 'Sample project description',
      type: 'Article',
      includeBreadcrumb: true
    });

    expect(webPage['@type']).toBe('Article');
    expect(webPage.breadcrumb).toEqual({
      '@id': `${siteConfig.url}/projects/sample#breadcrumb`
    });
    expect(webPage.isPartOf).toEqual({
      '@id': `${siteConfig.url}#website`
    });
  });

  it('builds item list structured data', () => {
    const itemList = buildItemListJsonLd({
      slug: '/projects',
      items: [
        { name: 'Project A', url: '/projects/project-a', description: 'Project A summary' },
        { name: 'Project B', url: '/projects/project-b' }
      ]
    });

    expect(itemList['@type']).toBe('ItemList');
    expect(itemList.itemListElement).toHaveLength(2);
    expect(itemList.itemListElement[0]).toMatchObject({
      position: 1,
      name: 'Project A',
      item: `${siteConfig.url}/projects/project-a`
    });
  });
});
