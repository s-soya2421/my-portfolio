'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { BlogFrontmatter } from '@/lib/content';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/components/providers/i18n-provider';
import { buildLocalePath } from '@/lib/locale';
import { formatDate } from '@/lib/utils';

export const PostCard = ({ post }: { post: BlogFrontmatter & { slug: string } }) => {
  const { locale } = useI18n();
  const postPath = buildLocalePath(`/blog/${post.slug}`, locale);
  const dateLocale = locale === 'en' ? 'en-US' : 'ja-JP';
  const readLabel = locale === 'en' ? `Read ${post.title}` : `${post.title} を読む`;

  return (
    <Card className="group flex h-full flex-col justify-between">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-balance text-xl font-semibold">
            <Link href={postPath}>{post.title}</Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(post.date, dateLocale)} ・ {post.readingTime ?? ''}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground md:text-base">{post.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="border-border/80">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={postPath}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:text-primary"
          aria-label={readLabel}
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </CardFooter>
    </Card>
  );
};
