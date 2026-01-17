import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getDictionary } from '@/lib/i18n';
import { ProjectsGrid } from './projects-grid';

const dictionary = getDictionary('en');

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ dictionary }),
}));

vi.mock('@/components/cards/project-card', () => ({
  ProjectCard: ({ project }: { project: { title: string } }) => (
    <article data-testid="project-card">{project.title}</article>
  ),
}));

const projects = [
  {
    title: 'Alpha',
    description: 'Alpha project',
    tags: ['React'],
    role: 'Personal',
    tech: ['React'],
    slug: 'alpha',
  },
  {
    title: 'Beta',
    description: 'Beta project',
    tags: ['Next'],
    role: 'Personal',
    tech: ['Next.js'],
    slug: 'beta',
  },
];

describe('ProjectsGrid', () => {
  it('filters projects by tag selection', () => {
    render(<ProjectsGrid projects={projects} tags={['React', 'Next', 'Vue']} />);

    expect(screen.getAllByTestId('project-card')).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.getAllByTestId('project-card')).toHaveLength(1);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('shows the empty state when no projects match', () => {
    render(<ProjectsGrid projects={projects} tags={['React', 'Next', 'Vue']} />);

    fireEvent.click(screen.getByRole('button', { name: 'Vue' }));
    expect(screen.queryAllByTestId('project-card')).toHaveLength(0);
    expect(screen.getByText(dictionary.projects.empty)).toBeInTheDocument();
  });
});
