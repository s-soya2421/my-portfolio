import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogPage from './page';

const mockGetAllBlogPosts = vi.fn();
const mockPaginateBlogPosts = vi.fn();

vi.mock('./utils', () => ({
  getAllBlogPosts: () => mockGetAllBlogPosts(),
  paginateBlogPosts: (...args: unknown[]) => mockPaginateBlogPosts(...args),
}));

vi.mock('@/components/blog/blog-post-list', () => ({
  BlogPostList: ({
    allPosts,
    currentPage,
    postsPerPage,
  }: {
    allPosts: { title: string; slug: string }[];
    currentPage: number;
    postsPerPage: number;
  }) => (
    <div data-testid="blog-post-list">
      {allPosts.slice(0, postsPerPage).map((p) => (
        <article key={p.slug} data-testid="post-card">
          {p.title}
        </article>
      ))}
      {allPosts.length > postsPerPage && (
        <div data-testid="pagination">{`${currentPage}/${Math.ceil(allPosts.length / postsPerPage)}`}</div>
      )}
    </div>
  ),
}));

const posts = [
  {
    title: 'Post One',
    description: 'First post',
    date: '2024-01-01',
    tags: ['nextjs'],
    slug: 'post-one',
  },
  {
    title: 'Post Two',
    description: 'Second post',
    date: '2024-01-02',
    tags: ['react'],
    slug: 'post-two',
  },
];

describe('BlogPage', () => {
  beforeEach(() => {
    mockGetAllBlogPosts.mockReset();
    mockPaginateBlogPosts.mockReset();
  });

  it('renders posts and pagination when posts exist', async () => {
    mockGetAllBlogPosts.mockResolvedValue(posts);
    mockPaginateBlogPosts.mockReturnValue({
      pagePosts: posts,
      totalPages: 1,
      isValidPage: true,
    });

    const ui = await BlogPage();
    render(ui);

    expect(screen.getByTestId('blog-post-list')).toBeTruthy();
    expect(screen.getAllByTestId('post-card')).toHaveLength(2);
  });

  it('shows the empty state when there are no posts', async () => {
    mockGetAllBlogPosts.mockResolvedValue([]);
    mockPaginateBlogPosts.mockReturnValue({
      pagePosts: [],
      totalPages: 1,
      isValidPage: true,
    });

    const ui = await BlogPage();
    render(ui);

    expect(screen.getByTestId('blog-post-list')).toBeTruthy();
    expect(screen.queryAllByTestId('post-card')).toHaveLength(0);
  });
});
