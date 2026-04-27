import type { MetadataRoute } from 'next';
import {
  type BlogFrontmatter,
  loadCollection,
  type PageFrontmatter,
  type ProjectFrontmatter,
} from '@/lib/content';
import { BLOG_POSTS_PER_PAGE } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

type SitemapContent = {
  date?: string;
  updated?: string;
  slug: string;
};

const getLastModified = (content: { date?: string; updated?: string }) =>
  new Date(content.updated ?? content.date ?? Date.now());

const getLatestModified = (items: { date?: string; updated?: string }[]) => {
  if (items.length === 0) {
    return new Date();
  }
  return new Date(Math.max(...items.map((item) => getLastModified(item).getTime())));
};

const getPageLastModified = (pages: SitemapContent[], slug: string) => {
  const page = pages.find((item) => item.slug === slug);
  return page ? getLastModified(page) : new Date();
};

const getPaginatedRoutes = (
  base: string,
  blogPath: string,
  posts: SitemapContent[]
): MetadataRoute.Sitemap => {
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_POSTS_PER_PAGE));
  if (totalPages <= 1) {
    return [];
  }

  const lastModified = getLatestModified(posts);

  return Array.from({ length: totalPages - 1 }, (_, index) => {
    const page = index + 2;
    return {
      url: `${base}${blogPath}/page/${page}`,
      lastModified,
    };
  });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [pages, projects, posts, enPages, enProjects, enPosts] = await Promise.all([
    loadCollection<PageFrontmatter>('pages'),
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog'),
    loadCollection<PageFrontmatter>('pages', 'en'),
    loadCollection<ProjectFrontmatter>('projects', 'en'),
    loadCollection<BlogFrontmatter>('blog', 'en'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', lastModified: getLatestModified([...pages, ...projects, ...posts]) },
    { path: '/about', lastModified: getPageLastModified(pages, 'about') },
    { path: '/projects', lastModified: getLatestModified(projects) },
    { path: '/blog', lastModified: getLatestModified(posts) },
    { path: '/en', lastModified: getLatestModified([...enPages, ...enProjects, ...enPosts]) },
    { path: '/en/about', lastModified: getPageLastModified(enPages, 'about') },
    { path: '/en/projects', lastModified: getLatestModified(enProjects) },
    { path: '/en/blog', lastModified: getLatestModified(enPosts) },
  ].map((route) => ({
    url: `${base}${route.path}`,
    lastModified: route.lastModified,
  }));

  const projectRoutes = projects.map((project) => {
    return {
      url: `${base}/projects/${project.slug}`,
      lastModified: getLastModified(project),
    };
  });

  const blogRoutes = posts.map((post) => {
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: getLastModified(post),
    };
  });

  const enProjectRoutes = enProjects.map((project) => {
    return {
      url: `${base}/en/projects/${project.slug}`,
      lastModified: getLastModified(project),
    };
  });

  const enBlogRoutes = enPosts.map((post) => {
    return {
      url: `${base}/en/blog/${post.slug}`,
      lastModified: getLastModified(post),
    };
  });

  return [
    ...staticRoutes,
    ...getPaginatedRoutes(base, '/blog', posts),
    ...getPaginatedRoutes(base, '/en/blog', enPosts),
    ...projectRoutes,
    ...blogRoutes,
    ...enProjectRoutes,
    ...enBlogRoutes,
  ];
}
