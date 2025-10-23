import Script from 'next/script';
import { SectionHeader } from '@/components/sections/section-header';
import { PostCard } from '@/components/cards/post-card';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { loadCollection, type BlogFrontmatter } from '@/lib/content';

export const metadata = buildMetadata({
  title: 'Blog',
  description: '学習メモや登壇資料から、設計の試行錯誤まで残しています。',
  slug: '/blog'
});

export default async function BlogPage() {
  const posts = await loadCollection<BlogFrontmatter>('blog');

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: '/blog',
    items: [
      { name: 'ホーム', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]
  });

  const blogPageJson = webPageJsonLd({
    slug: '/blog',
    title: 'Blog',
    description: '学習メモや登壇資料から、設計の試行錯誤まで残しています。',
    type: 'CollectionPage',
    includeBreadcrumb: true
  });

  const postsListJson = posts.length
    ? buildItemListJsonLd({
        slug: '/blog',
        items: posts.map((post) => ({
          name: post.title,
          url: `/blog/${post.slug}`,
          description: post.description
        }))
      })
    : null;

  return (
    <>
      <section className="container space-y-10 pb-16 pt-12">
        <SectionHeader
          eyebrow="Blog"
          title="学びと検証の記録"
          description="設計プロセスやツール導入の知見をライトに綴っています。"
        />
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">記事を執筆中です。</p>
        )}
      </section>
      <Script id="blog-webpage-json" type="application/ld+json">
        {JSON.stringify(blogPageJson)}
      </Script>
      <Script id="blog-breadcrumb-json" type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>
      {postsListJson ? (
        <Script id="blog-itemlist-json" type="application/ld+json">
          {JSON.stringify(postsListJson)}
        </Script>
      ) : null}
    </>
  );
}
