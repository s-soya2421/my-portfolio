'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
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

type TagLabels = {
  showAll: string;
  showLess: string;
};

type Props = {
  allPosts: BlogListItem[];
  currentPage: number;
  postsPerPage: number;
  basePath: string;
  emptyMessage?: string;
  paginationLabels?: PaginationLabels;
  tagLabels?: TagLabels;
};

export const BlogPostList = ({
  allPosts,
  currentPage,
  postsPerPage,
  basePath,
  emptyMessage = '記事を執筆中です。',
  paginationLabels,
  tagLabels = { showAll: 'すべて表示', showLess: '折りたたむ' },
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTag = searchParams.get('tag');
  const [showAllTags, setShowAllTags] = useState(false);

  const { allTags, popularTags } = useMemo(() => {
    const tagCounts = new Map<string, number>();
    for (const post of allPosts) {
      post.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    }
    const all = Array.from(tagCounts.keys()).sort();
    const popular = all.filter((tag) => (tagCounts.get(tag) ?? 0) >= 2);
    return { allTags: all, popularTags: popular };
  }, [allPosts]);

  const visibleTags = showAllTags ? allTags : popularTags;
  const hasHiddenTags = popularTags.length < allTags.length;

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
        <div className="flex flex-wrap items-center gap-2">
          {visibleTags.map((tag) => (
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
          {hasHiddenTags && (
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAllTags ? tagLabels.showLess : tagLabels.showAll}
            </button>
          )}
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
