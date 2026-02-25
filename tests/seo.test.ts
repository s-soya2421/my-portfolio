import { describe, expect, it } from 'vitest';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd,
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
      tags: ['nextjs'],
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
      image: '/images/article.png',
    });

    expect(jsonLd['@type']).toBe('BlogPosting');
    expect(jsonLd.headline).toBe('Structured Data');
    expect(jsonLd.dateModified).toBe('2024-02-01');
    expect(jsonLd.url).toBe(`${siteConfig.url}/blog/structured-data`);
    expect(jsonLd.mainEntityOfPage).toEqual({
      '@id': `${siteConfig.url}/blog/structured-data#webpage`,
    });
    expect(jsonLd.image).toBe(`${siteConfig.url}/images/article.png`);
    expect(jsonLd.inLanguage).toBe(siteConfig.defaultLocale);
    const author = (jsonLd as { author?: unknown }).author;
    expect(Array.isArray(author)).toBe(true);
    if (Array.isArray(author)) {
      expect(author[0]).toMatchObject({
        '@id': `${siteConfig.url}#person`,
      });
    }
  });

  it('maps breadcrumb items with positional indices', () => {
    const breadcrumbs = buildBreadcrumbJsonLd({
      slug: '/projects/sample',
      items: [
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Sample', url: '/projects/sample' },
      ],
    });

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs['@id']).toBe(`${siteConfig.url}/projects/sample#breadcrumb`);
    expect(breadcrumbs.itemListElement).toHaveLength(3);
    expect(breadcrumbs.itemListElement[2]).toMatchObject({
      position: 3,
      name: 'Sample',
      item: `${siteConfig.url}/projects/sample`,
    });
  });

  it('links webpage structured data with breadcrumb list', () => {
    const webPage = webPageJsonLd({
      slug: '/projects/sample',
      title: 'Sample Project',
      description: 'Sample project description',
      type: 'Article',
      includeBreadcrumb: true,
    });

    expect(webPage['@type']).toBe('Article');
    expect(webPage.breadcrumb).toEqual({
      '@id': `${siteConfig.url}/projects/sample#breadcrumb`,
    });
    expect(webPage.isPartOf).toEqual({
      '@id': `${siteConfig.url}#website`,
    });
  });

  it('builds item list structured data', () => {
    const itemList = buildItemListJsonLd({
      slug: '/projects',
      items: [
        { name: 'Project A', url: '/projects/project-a', description: 'Project A summary' },
        { name: 'Project B', url: '/projects/project-b' },
      ],
    });

    expect(itemList['@type']).toBe('ItemList');
    expect(itemList.itemListElement).toHaveLength(2);
    expect(itemList.itemListElement[0]).toMatchObject({
      position: 1,
      name: 'Project A',
      item: `${siteConfig.url}/projects/project-a`,
    });
  });

  it('buildMetadata: uses site URL when slug is not provided', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page' });
    expect(metadata.alternates?.canonical).toBe(siteConfig.url);
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.url).toBe(siteConfig.url);
  });

  it('buildMetadata: uses default OG image when image is not provided', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page' });
    const og = metadata.openGraph as Record<string, unknown>;
    const images = Array.isArray(og?.images) ? og.images : [og?.images];
    expect(String(images[0])).toContain('og-default.png');
  });

  it('buildMetadata: uses default locale when locale is not provided', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page' });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.locale).toBeDefined();
  });

  it('buildMetadata: sets locale from explicit locale parameter', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page', locale: 'en' });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.locale).toBe('en_US');
  });

  it('buildMetadata: omits publishedTime when not provided', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page', type: 'article' });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.publishedTime).toBeUndefined();
  });

  it('buildMetadata: omits modifiedTime when updatedTime is not provided', () => {
    const metadata = buildMetadata({
      title: 'Top',
      description: 'top page',
      publishedTime: '2024-01-01',
    });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.modifiedTime).toBeUndefined();
  });

  it('buildMetadata: omits tags when not provided', () => {
    const metadata = buildMetadata({ title: 'Top', description: 'top page' });
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og?.tags).toBeUndefined();
  });

  it('articleJsonLd: uses datePublished as dateModified when dateModified is not provided', () => {
    const jsonLd = articleJsonLd({
      title: 'Post',
      description: 'desc',
      datePublished: '2024-01-01',
      slug: '/blog/post',
    });
    expect(jsonLd.dateModified).toBe('2024-01-01');
  });

  it('articleJsonLd: omits image when not provided', () => {
    const jsonLd = articleJsonLd({
      title: 'Post',
      description: 'desc',
      datePublished: '2024-01-01',
      slug: '/blog/post',
    });
    expect(jsonLd.image).toBeUndefined();
  });

  it('articleJsonLd: uses default locale when locale is not provided', () => {
    const jsonLd = articleJsonLd({
      title: 'Post',
      description: 'desc',
      datePublished: '2024-01-01',
      slug: '/blog/post',
    });
    expect(jsonLd.inLanguage).toBe(siteConfig.defaultLocale);
  });

  it('webPageJsonLd: omits breadcrumb when includeBreadcrumb is not set', () => {
    const webPage = webPageJsonLd({
      slug: '/about',
      title: 'About',
      description: 'About page',
    });
    expect(webPage.breadcrumb).toBeUndefined();
  });

  it('webPageJsonLd: uses default slug and locale when not provided', () => {
    const webPage = webPageJsonLd({ title: 'Home', description: 'Home page' });
    expect(webPage['@id']).toContain('#webpage');
    expect(webPage.inLanguage).toBe(siteConfig.defaultLocale);
  });

  it('breadcrumbJsonLd: delegates to buildBreadcrumbJsonLd with root slug', () => {
    const result = breadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ]);
    expect(result['@type']).toBe('BreadcrumbList');
    expect(result['@id']).toContain('#breadcrumb');
    expect(result.itemListElement).toHaveLength(2);
  });

  it('buildItemListJsonLd: includes image when item has image', () => {
    const itemList = buildItemListJsonLd({
      slug: '/projects',
      items: [{ name: 'Project A', url: '/projects/a', image: '/images/a.png' }],
    });
    expect((itemList.itemListElement[0] as Record<string, unknown>).image).toBe(
      `${siteConfig.url}/images/a.png`
    );
  });
});
