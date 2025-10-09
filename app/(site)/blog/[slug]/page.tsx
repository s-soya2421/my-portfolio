import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft } from 'lucide-react';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { getBlogPostBySlug, loadCollection, type BlogFrontmatter } from '@/lib/content';
import { logger } from '@/lib/logger';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await loadCollection<BlogFrontmatter>('blog');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter } = await getBlogPostBySlug(slug);
    return buildMetadata({
      title: frontmatter.title,
      description: frontmatter.description,
      slug: `/blog/${slug}`,
      type: 'article',
      image: frontmatter.cover,
      publishedTime: frontmatter.date,
      updatedTime: frontmatter.updated,
      tags: frontmatter.tags
    });
  } catch (error) {
    logger.error('Failed to generate metadata for blog post', { slug, error });
    return buildMetadata({
      title: 'Blog',
      description: '学びと検証の記録',
      slug: '/blog'
    });
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter, content, jsonLd } = await getBlogPostBySlug(slug);

    return (
      <article className="container space-y-8 pb-16 pt-12">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/blog" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> 記事一覧に戻る
          </Link>
        </Button>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-balance md:text-4xl">{frontmatter.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{frontmatter.description}</p>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>{formatDate(frontmatter.date)}</span>
            {frontmatter.updated && frontmatter.updated !== frontmatter.date ? (
              <span>更新日: {formatDate(frontmatter.updated)}</span>
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
        <Script id="blog-breadcrumb-json" type="application/ld+json">
          {JSON.stringify(
            breadcrumbJsonLd([
              { name: 'ホーム', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: frontmatter.title, url: `/blog/${slug}` }
            ])
          )}
        </Script>
        {jsonLd ? (
          <Script id="blog-article-jsonld" type="application/ld+json">
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
