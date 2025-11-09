import { cache } from 'react';
import { loadCollection, type BlogFrontmatter } from '@/lib/content';
import { BLOG_POSTS_PER_PAGE, BLOG_SLUG } from './constants';

export type BlogListItem = BlogFrontmatter & { slug: string };

export const getAllBlogPosts = cache(async () => loadCollection<BlogFrontmatter>('blog'));

export const getTotalBlogPages = (totalPosts: number) =>
  Math.max(1, Math.ceil(totalPosts / BLOG_POSTS_PER_PAGE));

export const paginateBlogPosts = (posts: BlogListItem[], page: number) => {
  const totalPages = getTotalBlogPages(posts.length);
  const isValidPage = page >= 1 && page <= totalPages;
  let pagePosts: BlogListItem[] = [];

  if (isValidPage) {
    const start = (page - 1) * BLOG_POSTS_PER_PAGE;
    pagePosts = posts.slice(start, start + BLOG_POSTS_PER_PAGE);
  }

  return { pagePosts, totalPages, isValidPage };
};

export const getBlogPagePath = (page: number) => (page <= 1 ? BLOG_SLUG : `${BLOG_SLUG}/page/${page}`);
