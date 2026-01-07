import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { cache } from 'react';
import { mdxComponents } from '@/components/mdx/mdx-components';
import type { ReactElement } from 'react';
import { articleJsonLd } from './seo';
import { logger } from './logger';
import { siteConfig, type SiteLocale } from './site';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type BaseFrontmatter = {
  title: string;
  description: string;
  date?: string;
  updated?: string;
  tags: string[];
  cover?: string;
  draft?: boolean;
};

export type ProjectFrontmatter = BaseFrontmatter & {
  role: string;
  tech: string[];
  links?: {
    demo?: string;
    repo?: string;
  };
  impact_metrics?: Record<string, number>;
};

export type BlogFrontmatter = BaseFrontmatter & {
  date: string;
  readingTime?: string;
};

export type PageFrontmatter = BaseFrontmatter;

export type ContentCollection = 'projects' | 'blog' | 'pages';
export type ContentLocale = SiteLocale;

type ListItem<T extends BaseFrontmatter> = T & {
  slug: string;
};

type CompileResult<T extends BaseFrontmatter> = {
  frontmatter: T;
  content: ReactElement;
  slug: string;
  jsonLd?: Record<string, unknown>;
};

const getDir = (collection: ContentCollection, locale: ContentLocale) => {
  if (locale === siteConfig.defaultLocale) {
    return path.join(CONTENT_ROOT, collection);
  }
  return path.join(CONTENT_ROOT, locale, collection);
};

const estimateReadingTime = (markdown: string) => {
  const words = markdown.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const getEntries = async (dir: string) => {
  try {
    return await fs.readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      logger.warn('Content directory not found', { dir });
      return [];
    }
    throw error;
  }
};

const loadCollectionInternal = async <T extends BaseFrontmatter>(
  collection: ContentCollection,
  locale: ContentLocale = siteConfig.defaultLocale
): Promise<ListItem<T>[]> => {
  const dir = getDir(collection, locale);
  const entries = await getEntries(dir);
  const list: ListItem<T>[] = [];

  for (const file of entries) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(dir, file);
    const source = await fs.readFile(filePath, 'utf8');
    const { data } = matter(source);
    const frontmatter = data as T;
    if (frontmatter.draft) continue;
    if (collection === 'blog') {
      if (!frontmatter.date) {
        logger.error('Blog post missing required date frontmatter', { slug });
        throw new Error(`Blog post ${slug} is missing required date frontmatter.`);
      }
      (frontmatter as BlogFrontmatter).readingTime = estimateReadingTime(source);
    }
    list.push({ ...(frontmatter as T), slug });
  }

  return list.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateA === dateB) {
      return a.title.localeCompare(b.title);
    }
    return dateB - dateA;
  });
};

export const loadCollection = cache(loadCollectionInternal) as typeof loadCollectionInternal;

export const getAllTags = async (locale: ContentLocale = siteConfig.defaultLocale) => {
  const projects = await loadCollection<ProjectFrontmatter>('projects', locale);
  const tags = new Set<string>();
  projects.forEach((project) => project.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
};

const compileContentInternal = async <T extends BaseFrontmatter>(
  collection: ContentCollection,
  slug: string,
  locale: ContentLocale = siteConfig.defaultLocale
): Promise<CompileResult<T>> => {
  const filePath = path.join(getDir(collection, locale), `${slug}.mdx`);
  try {
    const source = await fs.readFile(filePath, 'utf8');

    const { content, frontmatter } = await compileMDX<T>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
        },
      },
      components: mdxComponents,
    });

    const fm = frontmatter as T;

    let jsonLd: Record<string, unknown> | undefined;
    if (collection !== 'pages' && fm.date) {
      const localePrefix = locale === siteConfig.defaultLocale ? '' : `/${locale}`;
      jsonLd = articleJsonLd({
        title: fm.title,
        description: fm.description,
        datePublished: fm.date,
        dateModified: fm.updated,
        slug: `${localePrefix}/${collection}/${slug}`,
        tags: fm.tags,
        image: fm.cover,
        locale,
      });
    }

    if (collection === 'blog') {
      (fm as BlogFrontmatter).readingTime = estimateReadingTime(source);
    }

    return { frontmatter: fm, content, slug, jsonLd };
  } catch (error) {
    logger.error('Failed to compile content', { collection, slug, error });
    throw error;
  }
};

export const compileContent = cache(compileContentInternal) as typeof compileContentInternal;

export const getProjectBySlug = async (
  slug: string,
  locale: ContentLocale = siteConfig.defaultLocale
) => compileContent<ProjectFrontmatter>('projects', slug, locale);

export const getBlogPostBySlug = async (
  slug: string,
  locale: ContentLocale = siteConfig.defaultLocale
) => compileContent<BlogFrontmatter>('blog', slug, locale);

export const getPageBySlug = async (
  slug: string,
  locale: ContentLocale = siteConfig.defaultLocale
) => compileContent<PageFrontmatter>('pages', slug, locale);
