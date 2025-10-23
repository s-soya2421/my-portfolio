import Script from 'next/script';
import { SectionHeader } from '@/components/sections/section-header';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { getAllTags, loadCollection, type ProjectFrontmatter } from '@/lib/content';

export const metadata = buildMetadata({
  title: 'Projects',
  description: '課題発見から施策実行まで伴走した案件のアーカイブです。',
  slug: '/projects'
});

export default async function ProjectsPage() {
  const [projects, tags] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    getAllTags()
  ]);

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: '/projects',
    items: [
      { name: 'ホーム', url: '/' },
      { name: 'Projects', url: '/projects' }
    ]
  });

  const projectsPageJson = webPageJsonLd({
    slug: '/projects',
    title: 'Projects',
    description: '課題発見から施策実行まで伴走した案件のアーカイブです。',
    type: 'CollectionPage',
    includeBreadcrumb: true
  });

  const projectsListJson = projects.length
    ? buildItemListJsonLd({
        slug: '/projects',
        items: projects.map((project) => ({
          name: project.title,
          url: `/projects/${project.slug}`,
          description: project.description,
          image: project.cover
        }))
      })
    : null;

  return (
    <>
      <section className="container space-y-10 pb-16 pt-12">
        <SectionHeader
          eyebrow="Projects"
          title="課題と向き合ったプロジェクトたち"
          description="価値検証・高速リリース・改善サイクルの各フェーズで実践したプロジェクトをまとめています。"
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
