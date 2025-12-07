import Script from 'next/script';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@/components/sections/section-header';
import { PostCard } from '@/components/cards/post-card';
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
    title: `${BLOG_TITLE} | ページ ${pageNumber}`,
    description: `${BLOG_META_DESCRIPTION}（ページ ${pageNumber}）`,
    slug,
  });
};

export default async function BlogPaginationPage({ params }: BlogPageProps) {
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
      { name: 'ホーム', url: '/' },
      { name: BLOG_TITLE, url: BLOG_SLUG },
    ],
  });

  const blogPageJson = webPageJsonLd({
    slug,
    title: `${BLOG_TITLE} | ページ ${pageNumber}`,
    description: BLOG_META_DESCRIPTION,
    type: 'CollectionPage',
    includeBreadcrumb: true,
  });

  const postsListJson = pagePosts.length
    ? buildItemListJsonLd({
        slug,
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
        {pagePosts.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {pagePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination basePath={BLOG_SLUG} currentPage={pageNumber} totalPages={totalPages} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">記事を執筆中です。</p>
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
