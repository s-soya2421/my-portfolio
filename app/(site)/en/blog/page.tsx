import Script from 'next/script';
import { PostCard } from '@/components/cards/post-card';
import { SectionHeader } from '@/components/sections/section-header';
import { Pagination } from '@/components/shared/pagination';
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  webPageJsonLd,
} from '@/lib/seo';
import { BLOG_META_DESCRIPTION, BLOG_SECTION_COPY, BLOG_SLUG, BLOG_TITLE } from './constants';
import { getAllBlogPosts, paginateBlogPosts } from './utils';

const paginationLabels = {
  nav: 'Pagination',
  prev: 'Prev',
  next: 'Next',
  prevAria: 'Go to previous page',
  nextAria: 'Go to next page',
  pageLabel: (page: number) => `Page ${page}`,
};

export const metadata = buildMetadata({
  title: BLOG_TITLE,
  description: BLOG_META_DESCRIPTION,
  slug: BLOG_SLUG,
  locale: 'en',
});

export default async function EnglishBlogPage() {
  const posts = await getAllBlogPosts();
  const { pagePosts, totalPages } = paginateBlogPosts(posts, 1);

  const breadcrumb = buildBreadcrumbJsonLd({
    slug: BLOG_SLUG,
    items: [
      { name: 'Home', url: '/en' },
      { name: BLOG_TITLE, url: BLOG_SLUG },
    ],
  });

  const blogPageJson = webPageJsonLd({
    slug: BLOG_SLUG,
    title: BLOG_TITLE,
    description: BLOG_META_DESCRIPTION,
    type: 'CollectionPage',
    includeBreadcrumb: true,
    locale: 'en',
  });

  const postsListJson = pagePosts.length
    ? buildItemListJsonLd({
        slug: BLOG_SLUG,
        items: pagePosts.map((post) => ({
          name: post.title,
          url: `/en/blog/${post.slug}`,
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
        {pagePosts.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {pagePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              basePath={BLOG_SLUG}
              currentPage={1}
              totalPages={totalPages}
              labels={paginationLabels}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Posts are in progress.</p>
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
