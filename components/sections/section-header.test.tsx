import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  it('renders eyebrow, title, and description', () => {
    render(<SectionHeader eyebrow="Projects" title="My Projects" description="A list of projects" />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My Projects' })).toBeInTheDocument();
    expect(screen.getByText('A list of projects')).toBeInTheDocument();
  });

  it('omits the description paragraph when not provided', () => {
    render(<SectionHeader eyebrow="Blog" title="Recent Posts" />);

    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent Posts' })).toBeInTheDocument();
    expect(screen.queryByText('A list of projects')).not.toBeInTheDocument();
  });

  it('applies additional className to root element', () => {
    const { container } = render(
      <SectionHeader eyebrow="Blog" title="Posts" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
