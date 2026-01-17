import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BlogFrontmatter, getBlogPostBySlug, loadCollection } from '@/lib/content';
import { logger } from '@/lib/logger';
import { buildBreadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await loadCollection<BlogFrontmatter>('blog', 'en');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter } = await getBlogPostBySlug(slug, 'en');
    return buildMetadata({
      title: frontmatter.title,
      description: frontmatter.description,
      slug: `/en/blog/${slug}`,
      type: 'article',
      image: frontmatter.cover,
      publishedTime: frontmatter.date,
      updatedTime: frontmatter.updated,
      tags: frontmatter.tags,
      locale: 'en',
    });
  } catch (error) {
    logger.error('Failed to generate metadata for blog post', { slug, error });
    return buildMetadata({
      title: 'Blog',
      description: 'Notes and learnings',
      slug: '/en/blog',
      locale: 'en',
    });
  }
}

export default async function EnglishBlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter, content, jsonLd } = await getBlogPostBySlug(slug, 'en');
    const breadcrumb = buildBreadcrumbJsonLd({
      slug: `/en/blog/${slug}`,
      items: [
        { name: 'Home', url: '/en' },
        { name: 'Blog', url: '/en/blog' },
        { name: frontmatter.title, url: `/en/blog/${slug}` },
      ],
    });
    const blogDetailWebPage = webPageJsonLd({
      slug: `/en/blog/${slug}`,
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'Article',
      includeBreadcrumb: true,
      locale: 'en',
    });

    return (
      <article className="container space-y-8 pb-16 pt-12">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/en/blog" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to posts
          </Link>
        </Button>
        <header className="space-y-4">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">{frontmatter.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{frontmatter.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{formatDate(frontmatter.date, 'en-US')}</span>
            {frontmatter.updated && frontmatter.updated !== frontmatter.date ? (
              <span>Updated: {formatDate(frontmatter.updated, 'en-US')}</span>
            ) : null}
            {frontmatter.readingTime ? <span>{frontmatter.readingTime}</span> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-border/80">
                {tag}
              </Badge>
            ))}
          </div>
        </header>
        <div className="prose max-w-none dark:prose-invert">{content}</div>
        <Script id="blog-detail-webpage-json" type="application/ld+json">
          {JSON.stringify(blogDetailWebPage)}
        </Script>
        <Script id="blog-detail-breadcrumb-json" type="application/ld+json">
          {JSON.stringify(breadcrumb)}
        </Script>
        {jsonLd ? (
          <Script id="blog-detail-article-jsonld" type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </Script>
        ) : null}
      </article>
    );
  } catch (error) {
    logger.error('Failed to render blog page', { slug, error });
    notFound();
  }
}
