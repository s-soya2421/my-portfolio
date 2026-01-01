import Script from 'next/script';
import { getPageBySlug } from '@/lib/content';
import { buildBreadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About',
  description: 'A summary of my background, skill set, and values.',
  slug: '/en/about',
  locale: 'en',
});

export default async function EnglishAboutPage() {
  const { frontmatter, content } = await getPageBySlug('about', 'en');

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: '/en/about',
    items: [
      { name: 'Home', url: '/en' },
      { name: frontmatter.title, url: '/en/about' },
    ],
  });

  const aboutPageJson = webPageJsonLd({
    slug: '/en/about',
    title: frontmatter.title,
    description: frontmatter.description,
    type: 'AboutPage',
    includeBreadcrumb: true,
    locale: 'en',
  });

  return (
    <>
      <section className="container space-y-8 pb-16 pt-12">
        <header className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            About
          </span>
          <h1 className="text-3xl font-bold md:text-4xl">{frontmatter.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{frontmatter.description}</p>
        </header>
        <div className="prose max-w-none dark:prose-invert">{content}</div>
      </section>
      <Script id="about-webpage-json" type="application/ld+json">
        {JSON.stringify(aboutPageJson)}
      </Script>
      <Script id="about-breadcrumb-json" type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>
    </>
  );
}
