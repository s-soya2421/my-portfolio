'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PostCard } from '@/components/cards/post-card';
import { Pagination } from '@/components/shared/pagination';
import type { BlogFrontmatter } from '@/lib/content';
import { cn } from '@/lib/utils';

type BlogListItem = BlogFrontmatter & { slug: string };

type PaginationLabels = {
  nav: string;
  prev: string;
  next: string;
  prevAria: string;
  nextAria: string;
  pageLabel: string;
};

type Props = {
  allPosts: BlogListItem[];
  currentPage: number;
  postsPerPage: number;
  basePath: string;
  emptyMessage?: string;
  paginationLabels?: PaginationLabels;
};

export const BlogPostList = ({
  allPosts,
  currentPage,
  postsPerPage,
  basePath,
  emptyMessage = '記事を執筆中です。',
  paginationLabels,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = searchParams.get('tag');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of allPosts) {
      post.tags?.forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet).sort();
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return allPosts;
    return allPosts.filter((post) => post.tags?.includes(selectedTag));
  }, [allPosts, selectedTag]);

  const displayPosts = useMemo(() => {
    if (selectedTag) return filteredPosts;
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, selectedTag, currentPage, postsPerPage]);

  const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage));

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      router.push(basePath);
    } else {
      router.push(`${basePath}?tag=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="space-y-8">
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                selectedTag === tag
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {displayPosts.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {displayPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {!selectedTag && (
            <Pagination
              basePath={basePath}
              currentPage={currentPage}
              totalPages={totalPages}
              labels={paginationLabels}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
};
