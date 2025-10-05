import { SectionHeader } from '@/components/sections/section-header';
import { ProjectsGrid } from '@/components/projects/projects-grid';
import { buildMetadata } from '@/lib/seo';
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

  return (
    <section className="container space-y-10 pb-16 pt-12">
      <SectionHeader
        eyebrow="Projects"
        title="課題と向き合ったプロジェクトたち"
        description="価値検証・高速リリース・改善サイクルの各フェーズで実践したプロジェクトをまとめています。"
      />
      <ProjectsGrid projects={projects} tags={tags} />
    </section>
  );
}
