'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogFrontmatter } from '@/lib/content';
import { PostCard } from '@/components/cards/post-card';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';
import { buildLocalePath } from '@/lib/locale';

export const BlogPreview = ({ posts }: { posts: (BlogFrontmatter & { slug: string })[] }) => {
  const { dictionary, locale } = useI18n();
  const blogPath = buildLocalePath('/blog', locale);

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
        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </motion.div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">{dictionary.blog.empty}</p>
      )}
    </section>
  );
};
