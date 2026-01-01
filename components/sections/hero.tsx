'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';
import { buildLocalePath } from '@/lib/locale';
import { siteConfig } from '@/lib/site';

export const Hero = () => {
  const { dictionary, locale } = useI18n();
  const projectsPath = buildLocalePath('/projects', locale);

  return (
    <section className="container pb-16 pt-12">
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm text-primary/80">{dictionary.hero.greeting}</p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {dictionary.hero.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={projectsPath}>{dictionary.hero.ctaSecondary}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
