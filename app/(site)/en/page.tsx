import Script from 'next/script';
import { BlogPreview } from '@/components/sections/blog-preview';
import { ChallengesSection } from '@/components/sections/challenges';
import { Hero } from '@/components/sections/hero';
import { ProjectsPreview } from '@/components/sections/projects-preview';
import { type BlogFrontmatter, loadCollection, type ProjectFrontmatter } from '@/lib/content';
import { challengesEn } from '@/lib/data';
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd,
} from '@/lib/seo';
import { siteConfig } from '@/lib/site';

const EN_SITE_DESCRIPTION =
  'Portfolio of Soya. Full-stack development and DevOps with a focus on UX and performance.';

export const metadata = buildMetadata({
  title: siteConfig.name,
  description: EN_SITE_DESCRIPTION,
  slug: '/en',
  locale: 'en',
});

export default async function EnglishHomePage() {
  const [projects, posts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects', 'en'),
    loadCollection<BlogFrontmatter>('blog', 'en'),
  ]);
  const personalProjects = projects.filter((project) => project.role === 'Personal project');

  const homepageBreadcrumb = buildBreadcrumbJsonLd({
    slug: '/en',
    items: [{ name: 'Home', url: '/en' }],
  });

  const homepageWebPage = webPageJsonLd({
    slug: '/en',
    title: siteConfig.name,
    description: EN_SITE_DESCRIPTION,
    type: 'ProfilePage',
    includeBreadcrumb: true,
    locale: 'en',
  });

  const highlightItems = [
    ...personalProjects.slice(0, 2).map((project) => ({
      name: project.title,
      url: `/en/projects/${project.slug}`,
      description: project.description,
      image: project.cover,
    })),
    ...posts.slice(0, 2).map((post) => ({
      name: post.title,
      url: `/en/blog/${post.slug}`,
      description: post.description,
    })),
  ];

  const highlightList = highlightItems.length
    ? buildItemListJsonLd({ slug: '/en', items: highlightItems })
    : null;

  return (
    <>
      <Hero />
      <ChallengesSection items={challengesEn} />
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
