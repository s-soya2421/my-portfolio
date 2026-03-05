import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostCard } from './post-card';

let currentLocale: 'ja' | 'en' = 'ja';

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ locale: currentLocale }),
}));

const post = {
  title: 'Sample Post',
  description: 'Post description',
  date: '2024-03-01',
  tags: ['nextjs', 'react', 'typescript', 'extra-tag'],
  slug: 'sample-post',
};

describe('PostCard', () => {
  beforeEach(() => {
    currentLocale = 'ja';
  });

  it('renders the post title and description', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText('Sample Post')).toBeInTheDocument();
    expect(screen.getByText('Post description')).toBeInTheDocument();
  });

  it('shows up to 3 tags and omits the rest', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText('nextjs')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.queryByText('extra-tag')).not.toBeInTheDocument();
  });

  it('links to correct path for ja locale', () => {
    currentLocale = 'ja';
    render(<PostCard post={post} />);

    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.getAttribute('href') === '/blog/sample-post')).toBe(true);
  });

  it('links to locale-prefixed path for en locale', () => {
    currentLocale = 'en';
    render(<PostCard post={post} />);

    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.getAttribute('href') === '/en/blog/sample-post')).toBe(true);
  });

  it('sets Japanese read aria-label for ja locale', () => {
    currentLocale = 'ja';
    render(<PostCard post={post} />);

    expect(screen.getByLabelText('Sample Post を読む')).toBeInTheDocument();
  });

  it('sets English read aria-label for en locale', () => {
    currentLocale = 'en';
    render(<PostCard post={post} />);

    expect(screen.getByLabelText('Read Sample Post')).toBeInTheDocument();
  });

  it('renders the formatted date', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renders readingTime when provided', () => {
    render(<PostCard post={{ ...post, readingTime: '3 min read' }} />);

    expect(screen.getByText(/3 min read/)).toBeInTheDocument();
  });
});
