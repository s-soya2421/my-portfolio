import { Hero } from '@/components/sections/hero';
import { ProjectsPreview } from '@/components/sections/projects-preview';
import { BlogPreview } from '@/components/sections/blog-preview';
import { ChallengesSection } from '@/components/sections/challenges';
import { loadCollection, type ProjectFrontmatter, type BlogFrontmatter } from '@/lib/content';
import { challenges } from '@/lib/data';

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog')
  ]);
  const personalProjects = projects.filter((project) => project.role === '個人開発');

  return (
    <>
      <Hero />
      <ChallengesSection items={challenges} />
      <ProjectsPreview projects={personalProjects.slice(0, 2)} />
      <BlogPreview posts={posts.slice(0, 2)} />
    </>
  );
}
