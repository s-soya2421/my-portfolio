'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BlogFrontmatter } from '@/lib/content';
import { PostCard } from '@/components/cards/post-card';
import { SectionHeader } from '@/components/sections/section-header';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

export const BlogPreview = ({ posts }: { posts: (BlogFrontmatter & { slug: string })[] }) => {
  const { dictionary } = useI18n();

  return (
    <section className="container py-12">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeader
          eyebrow={dictionary.sections.recentPosts}
          title="ブログ & ノート"
          description="設計検討や学びを軽量にまとめています。"
        />
        <Button asChild variant="ghost">
          <Link href="/blog">{dictionary.actions.viewAllPosts}</Link>
        </Button>
      </div>
      {posts.length ? (
        <motion.div
          // @ts-ignore - framer-motion v11 type issue
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
