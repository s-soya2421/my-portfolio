import fs from 'fs/promises';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { siteConfig } from '@/lib/site';
import { loadCollection, type ProjectFrontmatter, type BlogFrontmatter } from '@/lib/content';
import { logger } from '@/lib/logger';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og');
const DEFAULT_OUTPUT = path.join(process.cwd(), 'public', 'images', 'og-default.png');

const ensureDir = async (dir: string) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    logger.error('Failed to create directory', { dir, error });
    throw error;
  }
};

const escapeXml = (unsafe: string) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const createSvg = (title: string, subtitle: string) => `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)" rx="48" />
  <text x="100" y="220" font-family="'Noto Sans JP', 'Inter', 'Helvetica', sans-serif" font-size="54" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
  <text x="100" y="320" font-family="'Noto Sans JP', 'Inter', 'Helvetica', sans-serif" font-size="32" fill="rgba(255,255,255,0.82)">${escapeXml(subtitle)}</text>
  <text x="100" y="400" font-family="'Noto Sans JP', 'Inter', 'Helvetica', sans-serif" font-size="26" fill="rgba(255,255,255,0.72)">${escapeXml(siteConfig.tagline)}</text>
  <text x="100" y="520" font-family="'Noto Sans JP', 'Inter', 'Helvetica', sans-serif" font-size="28" fill="rgba(255,255,255,0.85)">${escapeXml(siteConfig.url.replace('https://', ''))}</text>
</svg>`;

const renderPng = async (svg: string) => {
  const renderer = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  return renderer.render().asPng();
};

const generateForItem = async (title: string, description: string, filename: string) => {
  const svg = createSvg(title, description);
  const png = await renderPng(svg);
  await fs.writeFile(filename, png);
};

const run = async () => {
  await ensureDir(OUTPUT_DIR);
  await generateForItem(siteConfig.name, siteConfig.description, DEFAULT_OUTPUT);

  const [projects, posts] = await Promise.all([
    loadCollection<ProjectFrontmatter>('projects'),
    loadCollection<BlogFrontmatter>('blog'),
  ]);

  for (const project of projects) {
    const filename = path.join(OUTPUT_DIR, `project-${project.slug}.png`);
    await generateForItem(project.title, project.description, filename);
  }

  for (const post of posts) {
    const filename = path.join(OUTPUT_DIR, `blog-${post.slug}.png`);
    await generateForItem(post.title, post.description, filename);
  }

  logger.info('Generated OG images', { outputDir: OUTPUT_DIR });
};

run();
