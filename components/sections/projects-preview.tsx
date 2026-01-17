'use client';

import Link from 'next/link';
import { ProjectCard } from '@/components/cards/project-card';
import { useI18n } from '@/components/providers/i18n-provider';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import type { ProjectFrontmatter } from '@/lib/content';
import { buildLocalePath } from '@/lib/locale';
import { cn } from '@/lib/utils';

export const ProjectsPreview = ({
  projects,
}: {
  projects: (ProjectFrontmatter & { slug: string })[];
}) => {
  const { dictionary, locale } = useI18n();
  const projectsPath = buildLocalePath('/projects', locale);
  const delayClasses = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];

  return (
    <section className="container py-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={dictionary.sections.featuredProjects}
          title={dictionary.sections.featuredProjectsTitle}
          description={dictionary.sections.featuredProjectsDescription}
        />
        <Button asChild variant="ghost">
          <Link href={projectsPath}>{dictionary.actions.viewAllProjects}</Link>
        </Button>
      </div>
      {projects.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              className={cn('reveal-rise', delayClasses[index] ?? 'reveal-delay-4')}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          {dictionary.projects.preparingProjects}
        </p>
      )}
    </section>
  );
};
