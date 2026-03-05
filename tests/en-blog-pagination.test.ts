import { describe, expect, it } from 'vitest';
import { getBlogPagePath, getTotalBlogPages, paginateBlogPosts } from '@/app/(site)/en/blog/utils';
import type { BlogFrontmatter } from '@/lib/content';

type BlogListItem = BlogFrontmatter & { slug: string };

const createPost = (index: number): BlogListItem => ({
  title: `Post ${index + 1}`,
  description: 'Test description',
  date: `2024-01-${String(index + 1).padStart(2, '0')}`,
  tags: [],
  slug: `post-${index + 1}`,
});

describe('EN blog: getTotalBlogPages', () => {
  it('returns at least one page even when there are no posts', () => {
    expect(getTotalBlogPages(0)).toBe(1);
  });

  it('calculates pages using six posts per page', () => {
    expect(getTotalBlogPages(6)).toBe(1);
    expect(getTotalBlogPages(7)).toBe(2);
    expect(getTotalBlogPages(12)).toBe(2);
    expect(getTotalBlogPages(13)).toBe(3);
  });
});

describe('EN blog: paginateBlogPosts', () => {
  const posts = Array.from({ length: 7 }, (_, i) => createPost(i));

  it('returns the first six posts on page 1', () => {
    const { pagePosts, totalPages, isValidPage } = paginateBlogPosts(posts, 1);
    expect(isValidPage).toBe(true);
    expect(totalPages).toBe(2);
    expect(pagePosts).toHaveLength(6);
    expect(pagePosts[0].slug).toBe('post-1');
  });

  it('returns the remaining posts on page 2', () => {
    const { pagePosts, isValidPage } = paginateBlogPosts(posts, 2);
    expect(isValidPage).toBe(true);
    expect(pagePosts).toHaveLength(1);
    expect(pagePosts[0].slug).toBe('post-7');
  });

  it('marks out-of-range pages as invalid and returns an empty array', () => {
    const { pagePosts, isValidPage } = paginateBlogPosts(posts, 99);
    expect(isValidPage).toBe(false);
    expect(pagePosts).toHaveLength(0);
  });
});

describe('EN blog: getBlogPagePath', () => {
  it('returns /en/blog for page 1', () => {
    expect(getBlogPagePath(1)).toBe('/en/blog');
  });

  it('returns paginated path with /en/blog prefix for page 2 and above', () => {
    expect(getBlogPagePath(2)).toBe('/en/blog/page/2');
    expect(getBlogPagePath(5)).toBe('/en/blog/page/5');
  });
});
