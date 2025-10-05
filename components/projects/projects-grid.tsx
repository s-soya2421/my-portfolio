'use client';

import { useState, useMemo } from 'react';
import type { ProjectFrontmatter } from '@/lib/content';
import { ProjectCard } from '@/components/cards/project-card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

export const ProjectsGrid = ({
  projects,
  tags
}: {
  projects: (ProjectFrontmatter & { slug: string })[];
  tags: string[];
}) => {
  const { dictionary } = useI18n();
  const [activeTag, setActiveTag] = useState<string>('');

  const filtered = useMemo(() => {
    if (!activeTag) return projects;
    return projects.filter((project) => project.tags.includes(activeTag));
  }, [projects, activeTag]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={activeTag === '' ? 'default' : 'outline'}
          onClick={() => setActiveTag('')}
        >
          {dictionary.projects.filterAll}
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag}
            type="button"
            variant={activeTag === tag ? 'default' : 'outline'}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {!filtered.length ? (
        <p className="text-sm text-muted-foreground">該当するプロジェクトはありません。</p>
      ) : null}
    </div>
  );
};
