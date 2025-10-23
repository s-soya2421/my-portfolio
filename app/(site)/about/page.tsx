import Script from 'next/script';
import { getPageBySlug } from '@/lib/content';
import { buildBreadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About',
  description: '略歴・スキルセット・価値観・登壇歴などをまとめています。',
  slug: '/about'
});

export default async function AboutPage() {
  const { frontmatter, content } = await getPageBySlug('about');

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: '/about',
    items: [
      { name: 'ホーム', url: '/' },
      { name: frontmatter.title, url: '/about' }
    ]
  });

  const aboutPageJson = webPageJsonLd({
    slug: '/about',
    title: frontmatter.title,
    description: frontmatter.description,
    type: 'AboutPage',
    includeBreadcrumb: true
  });

  return (
    <>
      <section className="container space-y-8 pb-16 pt-12">
        <header className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">About</span>
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
