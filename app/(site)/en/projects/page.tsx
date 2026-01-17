import Script from 'next/script';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { SectionHeader } from '@/components/sections/section-header';
import { getAllTags, loadCollection, type ProjectFrontmatter } from '@/lib/content';
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd,
} from '@/lib/seo';

const PROJECTS_DESCRIPTION =
  'An archive of projects where I partnered from discovery through implementation.';

export const metadata = buildMetadata({
  title: 'Projects',
  description: PROJECTS_DESCRIPTION,
  slug: '/en/projects',
  locale: 'en',
});

export default async function EnglishProjectsPage() {
  const [projects, tags] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects', 'en'),
    getAllTags('en'),
  ]);

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: '/en/projects',
    items: [
      { name: 'Home', url: '/en' },
      { name: 'Projects', url: '/en/projects' },
    ],
  });

  const projectsPageJson = webPageJsonLd({
    slug: '/en/projects',
    title: 'Projects',
    description: PROJECTS_DESCRIPTION,
    type: 'CollectionPage',
    includeBreadcrumb: true,
    locale: 'en',
  });

  const projectsListJson = projects.length
    ? buildItemListJsonLd({
        slug: '/en/projects',
        items: projects.map((project) => ({
          name: project.title,
          url: `/en/projects/${project.slug}`,
          description: project.description,
          image: project.cover,
        })),
      })
    : null;

  return (
    <>
      <section className="container space-y-10 pb-16 pt-12">
        <SectionHeader
          eyebrow="Projects"
          title="Projects that tackled real problems"
          description="A selection of work across value validation, rapid release, and iteration cycles."
        />
        <ProjectsGrid projects={projects} tags={tags} />
      </section>
      <Script id="projects-webpage-json" type="application/ld+json">
        {JSON.stringify(projectsPageJson)}
      </Script>
      <Script id="projects-breadcrumb-json" type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>
      {projectsListJson ? (
        <Script id="projects-itemlist-json" type="application/ld+json">
          {JSON.stringify(projectsListJson)}
        </Script>
      ) : null}
    </>
  );
}
