import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { loadCollection, type ProjectFrontmatter, type BlogFrontmatter } from '@/lib/content';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/projects',
    '/blog'
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));

  const [projects, posts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog')
  ]);

  const projectRoutes = projects.map((project) => {
    const lastModifiedSource = project.updated ?? project.date;
    return {
      url: `${base}/projects/${project.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date()
    };
  });

  const blogRoutes = posts.map((post) => {
    const lastModifiedSource = post.updated ?? post.date;
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: lastModifiedSource ? new Date(lastModifiedSource) : new Date()
    };
  });

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
