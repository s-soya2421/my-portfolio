import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  const labels = {
    nav: 'Pagination',
    prev: 'Prev',
    next: 'Next',
    prevAria: 'Previous page',
    nextAria: 'Next page',
    pageLabel: (page: number) => `Page ${page}`,
  };

  it('returns null when there is only one page', () => {
    const { container } = render(
      <Pagination basePath="/blog" currentPage={1} totalPages={1} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders page links with the current page marked', () => {
    render(
      <Pagination basePath="/blog" currentPage={2} totalPages={3} labels={labels} />
    );

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/blog');

    const current = screen.getByRole('link', { name: 'Page 2' });
    expect(current).toHaveAttribute('href', '/blog/page/2');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('disables previous/next controls at the ends', () => {
    render(
      <Pagination basePath="/blog" currentPage={1} totalPages={2} labels={labels} />
    );

    expect(screen.getByLabelText('Previous page')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('Next page')).toHaveAttribute('href', '/blog/page/2');
  });
});
