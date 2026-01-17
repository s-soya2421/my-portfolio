import { notFound } from 'next/navigation';
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
import { BLOG_META_DESCRIPTION, BLOG_SECTION_COPY, BLOG_SLUG, BLOG_TITLE } from '../../constants';
import {
  getAllBlogPosts,
  getBlogPagePath,
  getTotalBlogPages,
  paginateBlogPosts,
} from '../../utils';

type BlogPageProps = {
  params: Promise<{ page: string }>;
};

const paginationLabels = {
  nav: 'Pagination',
  prev: 'Prev',
  next: 'Next',
  prevAria: 'Go to previous page',
  nextAria: 'Go to next page',
  pageLabel: (page: number) => `Page ${page}`,
};

const parsePageNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : NaN;
};

export const generateStaticParams = async () => {
  const posts = await getAllBlogPosts();
  const totalPages = getTotalBlogPages(posts.length);
  if (totalPages <= 1) {
    return [];
  }
  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
};

export const generateMetadata = async ({ params }: BlogPageProps) => {
  const { page } = await params;
  const pageNumber = parsePageNumber(page);
  if (!Number.isFinite(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const posts = await getAllBlogPosts();
  const { isValidPage } = paginateBlogPosts(posts, pageNumber);

  if (!isValidPage) {
    notFound();
  }

  const slug = getBlogPagePath(pageNumber);

  return buildMetadata({
    title: `${BLOG_TITLE} | Page ${pageNumber}`,
    description: `${BLOG_META_DESCRIPTION} (Page ${pageNumber})`,
    slug,
    locale: 'en',
  });
};

export default async function EnglishBlogPaginationPage({ params }: BlogPageProps) {
  const { page } = await params;
  const pageNumber = parsePageNumber(page);
  if (!Number.isFinite(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const posts = await getAllBlogPosts();
  const { pagePosts, totalPages, isValidPage } = paginateBlogPosts(posts, pageNumber);

  if (!isValidPage) {
    notFound();
  }

  const slug = getBlogPagePath(pageNumber);

  const breadcrumb = buildBreadcrumbJsonLd({
    slug,
    items: [
      { name: 'Home', url: '/en' },
      { name: BLOG_TITLE, url: BLOG_SLUG },
    ],
  });

  const blogPageJson = webPageJsonLd({
    slug,
    title: `${BLOG_TITLE} | Page ${pageNumber}`,
    description: BLOG_META_DESCRIPTION,
    type: 'CollectionPage',
    includeBreadcrumb: true,
    locale: 'en',
  });

  const postsListJson = pagePosts.length
    ? buildItemListJsonLd({
        slug,
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
              currentPage={pageNumber}
              totalPages={totalPages}
              labels={paginationLabels}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Posts are in progress.</p>
        )}
      </section>
      <Script id={`blog-webpage-json-page-${pageNumber}`} type="application/ld+json">
        {JSON.stringify(blogPageJson)}
      </Script>
      <Script id={`blog-breadcrumb-json-page-${pageNumber}`} type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </Script>
      {postsListJson ? (
        <Script id={`blog-itemlist-json-page-${pageNumber}`} type="application/ld+json">
          {JSON.stringify(postsListJson)}
        </Script>
      ) : null}
    </>
  );
}
