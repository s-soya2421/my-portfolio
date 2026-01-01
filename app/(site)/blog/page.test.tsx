import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogPage from './page';

const mockGetAllBlogPosts = vi.fn();
const mockPaginateBlogPosts = vi.fn();

vi.mock('./utils', () => ({
  getAllBlogPosts: () => mockGetAllBlogPosts(),
  paginateBlogPosts: (...args: unknown[]) => mockPaginateBlogPosts(...args),
}));

vi.mock('@/components/cards/post-card', () => ({
  PostCard: ({ post }: { post: { title: string } }) => (
    <article data-testid="post-card">{post.title}</article>
  ),
}));

vi.mock('@/components/shared/pagination', () => ({
  Pagination: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <div data-testid="pagination">{`${currentPage}/${totalPages}`}</div>
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
      totalPages: 2,
      isValidPage: true,
    });

    const ui = await BlogPage();
    render(ui);

    expect(mockPaginateBlogPosts).toHaveBeenCalledWith(posts, 1);
    expect(screen.getAllByTestId('post-card')).toHaveLength(2);
    expect(screen.getByTestId('pagination')).toHaveTextContent('1/2');
  });

  it('shows the empty state when there are no posts', async () => {
    mockGetAllBlogPosts.mockResolvedValue([]);
    mockPaginateBlogPosts.mockReturnValue({
      pagePosts: [],
      totalPages: 1,
      isValidPage: true,
    });

    const ui = await BlogPage();
    const { container } = render(ui);

    expect(screen.queryAllByTestId('post-card')).toHaveLength(0);
    expect(screen.queryByTestId('pagination')).toBeNull();
    expect(container.querySelectorAll('p.text-muted-foreground')).toHaveLength(2);
  });
});
