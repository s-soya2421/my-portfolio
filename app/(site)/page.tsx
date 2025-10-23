import Script from 'next/script';
import { Hero } from '@/components/sections/hero';
import { ProjectsPreview } from '@/components/sections/projects-preview';
import { BlogPreview } from '@/components/sections/blog-preview';
import { ChallengesSection } from '@/components/sections/challenges';
import { loadCollection, type ProjectFrontmatter, type BlogFrontmatter } from '@/lib/content';
import { challenges } from '@/lib/data';
import { siteConfig } from '@/lib/site';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, webPageJsonLd } from '@/lib/seo';

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog')
  ]);
  const personalProjects = projects.filter((project) => project.role === '個人開発');

  const homepageBreadcrumb = buildBreadcrumbJsonLd({
    slug: '/',
    items: [{ name: 'ホーム', url: '/' }]
  });

  const homepageWebPage = webPageJsonLd({
    slug: '/',
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'ProfilePage',
    includeBreadcrumb: true
  });

  const highlightItems = [
    ...personalProjects.slice(0, 2).map((project) => ({
      name: project.title,
      url: `/projects/${project.slug}`,
      description: project.description,
      image: project.cover
    })),
    ...posts.slice(0, 2).map((post) => ({
      name: post.title,
      url: `/blog/${post.slug}`,
      description: post.description
    }))
  ];

  const highlightList = highlightItems.length
    ? buildItemListJsonLd({ slug: '/', items: highlightItems })
    : null;

  return (
    <>
      <Hero />
      <ChallengesSection items={challenges} />
      <ProjectsPreview projects={personalProjects.slice(0, 2)} />
      <BlogPreview posts={posts.slice(0, 2)} />
      <Script id="home-webpage-json" type="application/ld+json">
        {JSON.stringify(homepageWebPage)}
      </Script>
      <Script id="home-breadcrumb-json" type="application/ld+json">
        {JSON.stringify(homepageBreadcrumb)}
      </Script>
      {highlightList ? (
        <Script id="home-highlight-itemlist-json" type="application/ld+json">
          {JSON.stringify(highlightList)}
        </Script>
      ) : null}
    </>
  );
}
