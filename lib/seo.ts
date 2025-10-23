import type { Metadata } from 'next';
import { siteConfig } from './site';

export type BreadcrumbItem = {
  name: string;
  url: string;
};

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

const breadcrumbIdFor = (slug: string) => `${absoluteUrl(slug || '/')}#breadcrumb`;

const webPageIdFor = (slug: string) => `${absoluteUrl(slug || '/')}#webpage`;

const defaultOgImage = absoluteUrl('/images/og-default.png');

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.social.github }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  alternates: {
    canonical: siteConfig.url
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOgImage],
    locale: 'ja_JP'
  },
  twitter: {
    card: 'summary_large_image',
    creator: '',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [defaultOgImage]
  },
  icons: {
    shortcut: '/favicon.ico'
  }
};

export type MetadataInput = {
  title: string;
  description: string;
  slug?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  updatedTime?: string;
  tags?: string[];
};

export const buildMetadata = ({
  title,
  description,
  slug,
  type = 'website',
  image,
  publishedTime,
  updatedTime,
  tags
}: MetadataInput): Metadata => {
  const url = slug ? `${siteConfig.url}${slug}` : siteConfig.url;
  const ogImage = image ? `${siteConfig.url}${image}` : defaultOgImage;
  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type,
      url,
      title,
      description,
      images: [ogImage],
      ...(publishedTime && {
        publishedTime
      }),
      ...(updatedTime && {
        modifiedTime: updatedTime
      }),
      ...(tags && { tags })
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [ogImage]
    }
  };
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: siteConfig.defaultLocale,
  publisher: {
    '@id': `${siteConfig.url}#person`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
};

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteConfig.url}#person`,
  name: siteConfig.author,
  email: siteConfig.email,
  url: siteConfig.url,
  sameAs: [siteConfig.social.github, siteConfig.social.x, siteConfig.social.linkedin]
};

export const articleJsonLd = (params: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  tags?: string[];
  image?: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: params.title,
  description: params.description,
  datePublished: params.datePublished,
  dateModified: params.dateModified ?? params.datePublished,
  url: `${siteConfig.url}${params.slug}`,
  mainEntityOfPage: {
    '@id': webPageIdFor(params.slug)
  },
  author: [
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author
    }
  ],
  publisher: {
    '@type': 'Person',
    '@id': `${siteConfig.url}#person`,
    name: siteConfig.author
  },
  keywords: params.tags ?? [],
  inLanguage: siteConfig.defaultLocale,
  ...(params.image
    ? {
        image: absoluteUrl(params.image)
      }
    : {})
});

export const breadcrumbJsonLd = (items: BreadcrumbItem[]) =>
  buildBreadcrumbJsonLd({ slug: '/', items });

export const webPageJsonLd = (params: {
  slug?: string;
  title: string;
  description: string;
  type?: string;
  includeBreadcrumb?: boolean;
}) => {
  const slug = params.slug ?? '/';
  const url = absoluteUrl(slug);
  return {
    '@context': 'https://schema.org',
    '@type': params.type ?? 'WebPage',
    '@id': webPageIdFor(slug),
    url,
    name: params.title,
    description: params.description,
    inLanguage: siteConfig.defaultLocale,
    isPartOf: {
      '@id': `${siteConfig.url}#website`
    },
    ...(params.includeBreadcrumb
      ? {
          breadcrumb: {
            '@id': breadcrumbIdFor(slug)
          }
        }
      : {})
  };
};

export const buildBreadcrumbJsonLd = (params: { slug: string; items: BreadcrumbItem[] }) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': breadcrumbIdFor(params.slug),
  itemListElement: params.items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.url)
  }))
});

export const buildItemListJsonLd = (params: {
  slug: string;
  items: Array<{ name: string; url: string; description?: string; image?: string }>;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${absoluteUrl(params.slug)}#itemlist`,
  itemListElement: params.items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.url),
    ...(item.description ? { description: item.description } : {}),
    ...(item.image ? { image: absoluteUrl(item.image) } : {})
  }))
});
