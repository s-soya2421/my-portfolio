'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ProjectFrontmatter } from '@/lib/content';
import { ProjectCard } from '@/components/cards/project-card';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

export const ProjectsPreview = ({
  projects,
}: {
  projects: (ProjectFrontmatter & { slug: string })[];
}) => {
  const { dictionary } = useI18n();

  return (
    <section className="container py-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={dictionary.sections.featuredProjects}
          title={dictionary.sections.featuredProjectsTitle}
          description={dictionary.sections.featuredProjectsDescription}
        />
        <Button asChild variant="ghost">
          <Link href="/projects">{dictionary.actions.viewAllProjects}</Link>
        </Button>
      </div>
      {projects.length ? (
        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </motion.div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          {dictionary.projects.preparingProjects}
        </p>
      )}
    </section>
  );
};
