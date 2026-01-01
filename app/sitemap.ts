import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { loadCollection, type ProjectFrontmatter, type BlogFrontmatter } from '@/lib/content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes: MetadataRoute.Sitemap = ['', '/about', '/projects', '/blog'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
  const enStaticRoutes: MetadataRoute.Sitemap = [
    '/en',
    '/en/about',
    '/en/projects',
    '/en/blog',
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const [projects, posts, enProjects, enPosts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog'),
    loadCollection<ProjectFrontmatter>('projects', 'en'),
    loadCollection<BlogFrontmatter>('blog', 'en'),
  ]);

  const projectRoutes = projects.map((project) => {
    const lastModifiedSource = project.updated ?? project.date;
    return {
      url: `${base}/projects/${project.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date(),
    };
  });

  const blogRoutes = posts.map((post) => {
    const lastModifiedSource = post.updated ?? post.date;
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date(),
    };
  });

  const enProjectRoutes = enProjects.map((project) => {
    const lastModifiedSource = project.updated ?? project.date;
    return {
      url: `${base}/en/projects/${project.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date(),
    };
  });

  const enBlogRoutes = enPosts.map((post) => {
    const lastModifiedSource = post.updated ?? post.date;
    return {
      url: `${base}/en/blog/${post.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date(),
    };
  });

  return [
    ...staticRoutes,
    ...enStaticRoutes,
    ...projectRoutes,
    ...blogRoutes,
    ...enProjectRoutes,
    ...enBlogRoutes,
  ];
}
