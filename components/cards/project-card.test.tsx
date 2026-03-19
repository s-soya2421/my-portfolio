import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectCard } from './project-card';

let currentLocale: 'ja' | 'en' = 'ja';

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ locale: currentLocale }),
}));

const project = {
  title: 'Sample Project',
  description: 'Project description',
  role: 'Personal',
  tags: ['react', 'nextjs', 'typescript', 'tailwind', 'extra-tag'],
  tech: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Vercel', 'Prisma', 'extra-tech'],
  slug: 'sample-project',
};

describe('ProjectCard', () => {
  beforeEach(() => {
    currentLocale = 'ja';
  });

  it('renders project title, role, and description', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Sample Project')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Project description')).toBeInTheDocument();
  });

  it('shows up to 4 tags and omits the rest', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('tailwind')).toBeInTheDocument();
    expect(screen.queryByText('extra-tag')).not.toBeInTheDocument();
  });

  it('shows up to 6 tech items and omits the rest', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.queryByText('extra-tech')).not.toBeInTheDocument();
  });

  it('renders cover image when provided', () => {
    render(<ProjectCard project={{ ...project, cover: '/images/project.png' }} />);

    expect(screen.getByRole('img', { name: 'Sample Project' })).toBeInTheDocument();
  });

  it('omits cover image when not provided', () => {
    render(<ProjectCard project={project} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders demo and repo links when provided', () => {
    render(
      <ProjectCard
        project={{
          ...project,
          links: { demo: 'https://demo.example.com', repo: 'https://github.com/example' },
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute(
      'href',
      'https://demo.example.com'
    );
    expect(screen.getByRole('link', { name: 'Repo' })).toHaveAttribute(
      'href',
      'https://github.com/example'
    );
  });

  it('omits demo/repo links when not provided', () => {
    render(<ProjectCard project={project} />);

    expect(screen.queryByRole('link', { name: 'Demo' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Repo' })).not.toBeInTheDocument();
  });

  it('renders impact metrics when provided', () => {
    render(<ProjectCard project={{ ...project, impact_metrics: { users: 1000, uptime: 99.9 } }} />);

    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('99.9')).toBeInTheDocument();
  });

  it('links to locale-prefixed path for en locale', () => {
    currentLocale = 'en';
    render(<ProjectCard project={project} />);

    expect(screen.getByLabelText('View details for Sample Project')).toHaveAttribute(
      'href',
      '/en/projects/sample-project'
    );
  });

  it('links to default path for ja locale', () => {
    currentLocale = 'ja';
    render(<ProjectCard project={project} />);

    expect(screen.getByLabelText('Sample Project 詳細を見る')).toHaveAttribute(
      'href',
      '/projects/sample-project'
    );
  });
});
