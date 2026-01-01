import Image from 'next/image';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { buildBreadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { getProjectBySlug, loadCollection, type ProjectFrontmatter } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await loadCollection<ProjectFrontmatter>('projects', 'en');
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter } = await getProjectBySlug(slug, 'en');
    return buildMetadata({
      title: frontmatter.title,
      description: frontmatter.description,
      slug: `/en/projects/${slug}`,
      type: 'article',
      image: frontmatter.cover,
      publishedTime: frontmatter.date,
      updatedTime: frontmatter.updated,
      tags: frontmatter.tags,
      locale: 'en',
    });
  } catch (error) {
    logger.error('Failed to generate metadata for project', { slug, error });
    return buildMetadata({
      title: 'Project',
      description: 'Project details',
      slug: '/en/projects',
      locale: 'en',
    });
  }
}

export default async function EnglishProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  try {
    const { frontmatter, content, jsonLd } = await getProjectBySlug(slug, 'en');
    const breadcrumb = buildBreadcrumbJsonLd({
      slug: `/en/projects/${slug}`,
      items: [
        { name: 'Home', url: '/en' },
        { name: 'Projects', url: '/en/projects' },
        { name: frontmatter.title, url: `/en/projects/${slug}` },
      ],
    });
    const projectDetailWebPage = webPageJsonLd({
      slug: `/en/projects/${slug}`,
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'Article',
      includeBreadcrumb: true,
      locale: 'en',
    });

    return (
      <article className="container space-y-8 pb-16 pt-12">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/en/projects" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </Button>
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">{frontmatter.title}</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{frontmatter.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {frontmatter.cover ? (
          <div className="relative overflow-hidden rounded-3xl border border-border/60">
            <Image
              src={frontmatter.cover}
              alt={frontmatter.title}
              width={1280}
              height={720}
              className="w-full object-cover"
              priority={false}
            />
          </div>
        ) : null}
        <div className="grid gap-6 rounded-3xl border border-border/60 bg-muted/40 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Role</h2>
            <p className="mt-2 text-sm text-muted-foreground">{frontmatter.role}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tech Stack</h2>
            <p className="mt-2 text-sm text-muted-foreground">{frontmatter.tech.join(', ')}</p>
          </div>
          {frontmatter.links?.demo ? (
            <div>
              <h2 className="text-lg font-semibold">Demo</h2>
              <Link
                href={frontmatter.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary"
              >
                {frontmatter.links.demo}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          {frontmatter.links?.repo ? (
            <div>
              <h2 className="text-lg font-semibold">Repository</h2>
              <Link
                href={frontmatter.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary"
              >
                {frontmatter.links.repo}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          {frontmatter.impact_metrics ? (
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold">Impact Metrics</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {Object.entries(frontmatter.impact_metrics).map(([key, value]) => (
                  <div key={key} className="rounded-3xl border border-border/60 bg-card px-4 py-3">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {key.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="prose max-w-none dark:prose-invert">{content}</div>
        <Script id="project-detail-webpage-json" type="application/ld+json">
          {JSON.stringify(projectDetailWebPage)}
        </Script>
        <Script id="project-detail-breadcrumb-json" type="application/ld+json">
          {JSON.stringify(breadcrumb)}
        </Script>
        {jsonLd ? (
          <Script id="project-detail-article-jsonld" type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </Script>
        ) : null}
      </article>
    );
  } catch (error) {
    logger.error('Failed to render project page', { slug, error });
    notFound();
  }
}
