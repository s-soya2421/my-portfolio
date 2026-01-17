'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { buildLocalePath } from '@/lib/locale';
import { siteConfig } from '@/lib/site';

export const Hero = () => {
  const { dictionary, locale } = useI18n();
  const projectsPath = buildLocalePath('/projects', locale);

  return (
    <section className="container pb-16 pt-12">
      <div className="max-w-3xl">
        <p className="reveal-rise text-sm text-primary/80">{dictionary.hero.greeting}</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl reveal-rise reveal-delay-1">
          {dictionary.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl reveal-rise reveal-delay-2">
          {dictionary.hero.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 reveal-rise reveal-delay-3">
          <Button asChild size="lg">
            <Link href={projectsPath}>{dictionary.hero.ctaSecondary}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
