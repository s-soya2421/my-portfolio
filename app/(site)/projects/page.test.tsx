import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectsPage from './page';

const mockLoadCollection = vi.fn();
const mockGetAllTags = vi.fn();

vi.mock('@/lib/content', () => ({
  loadCollection: (...args: unknown[]) => mockLoadCollection(...args),
  getAllTags: (...args: unknown[]) => mockGetAllTags(...args),
}));

vi.mock('@/components/projects/projects-grid', () => ({
  ProjectsGrid: ({ projects, tags }: { projects: Array<{ title: string }>; tags: string[] }) => (
    <div data-testid="projects-grid">{`${projects.length}:${tags.length}`}</div>
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

describe('ProjectsPage', () => {
  beforeEach(() => {
    mockLoadCollection.mockReset();
    mockGetAllTags.mockReset();
  });

  it('renders the projects grid and heading', async () => {
    mockLoadCollection.mockResolvedValue(projects);
    mockGetAllTags.mockResolvedValue(['React', 'Next']);

    const ui = await ProjectsPage();
    render(ui);

    expect(mockLoadCollection).toHaveBeenCalledWith('projects');
    expect(mockGetAllTags).toHaveBeenCalled();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toBeEmptyDOMElement();
    expect(screen.getByTestId('projects-grid')).toHaveTextContent('2:2');
  });
});
