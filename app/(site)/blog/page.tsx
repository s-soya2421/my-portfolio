import Script from 'next/script';
import { Suspense } from 'react';
import { BlogPostList } from '@/components/blog/blog-post-list';
import { SectionHeader } from '@/components/sections/section-header';
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd,
} from '@/lib/seo';
import {
  BLOG_META_DESCRIPTION,
  BLOG_POSTS_PER_PAGE,
  BLOG_SECTION_COPY,
  BLOG_SLUG,
  BLOG_TITLE,
} from './constants';
import { getAllBlogPosts, paginateBlogPosts } from './utils';

export const metadata = buildMetadata({
  title: BLOG_TITLE,
  description: BLOG_META_DESCRIPTION,
  slug: BLOG_SLUG,
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const { pagePosts } = paginateBlogPosts(posts, 1);

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: BLOG_SLUG,
    items: [
      { name: 'ホーム', url: '/' },
      { name: BLOG_TITLE, url: BLOG_SLUG },
    ],
  });

  const blogPageJson = webPageJsonLd({
    slug: BLOG_SLUG,
    title: BLOG_TITLE,
    description: BLOG_META_DESCRIPTION,
    type: 'CollectionPage',
    includeBreadcrumb: true,
  });

  const postsListJson = pagePosts.length
    ? buildItemListJsonLd({
        slug: BLOG_SLUG,
        items: pagePosts.map((post) => ({
          name: post.title,
          url: `/blog/${post.slug}`,
          description: post.description,
        })),
      })
    : null;

  return (
    <>
      <section className="container space-y-10 pb-16 pt-12">
        <SectionHeader
          eyebrow={BLOG_SECTION_COPY.eyebrow}
          title={BLOG_SECTION_COPY.title}
          description={BLOG_SECTION_COPY.description}
        />
        <Suspense>
          <BlogPostList
            allPosts={posts}
            currentPage={1}
            postsPerPage={BLOG_POSTS_PER_PAGE}
            basePath={BLOG_SLUG}
          />
        </Suspense>
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
