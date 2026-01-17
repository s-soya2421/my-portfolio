'use client';

import Link from 'next/link';
import { PostCard } from '@/components/cards/post-card';
import { useI18n } from '@/components/providers/i18n-provider';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import type { BlogFrontmatter } from '@/lib/content';
import { buildLocalePath } from '@/lib/locale';
import { cn } from '@/lib/utils';

export const BlogPreview = ({ posts }: { posts: (BlogFrontmatter & { slug: string })[] }) => {
  const { dictionary, locale } = useI18n();
  const blogPath = buildLocalePath('/blog', locale);
  const delayClasses = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];

  return (
    <section className="container py-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={dictionary.sections.recentPosts}
          title={dictionary.sections.recentPostsTitle}
          description={dictionary.sections.recentPostsDescription}
        />
        <Button asChild variant="ghost">
          <Link href={blogPath}>{dictionary.actions.viewAllPosts}</Link>
        </Button>
      </div>
      {posts.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <div
              key={post.slug}
              className={cn('reveal-rise', delayClasses[index] ?? 'reveal-delay-4')}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">{dictionary.blog.empty}</p>
      )}
    </section>
  );
};
