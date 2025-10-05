import { buildMetadata } from '@/lib/seo';
import { getPageBySlug } from '@/lib/content';

export const metadata = buildMetadata({
  title: 'About',
  description: '略歴・スキルセット・価値観・登壇歴などをまとめています。',
  slug: '/about'
});

export default async function AboutPage() {
  const { frontmatter, content } = await getPageBySlug('about');

  return (
    <section className="container space-y-8 pb-16 pt-12">
      <header className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">About</span>
        <h1 className="text-3xl font-bold md:text-4xl">{frontmatter.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{frontmatter.description}</p>
      </header>
      <div className="prose max-w-none dark:prose-invert">{content}</div>
    </section>
  );
}
