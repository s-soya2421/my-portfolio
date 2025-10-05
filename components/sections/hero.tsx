'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';
import { siteConfig } from '@/lib/site';

export const Hero = () => {
  const { dictionary } = useI18n();

  return (
    <section className="container pb-16 pt-12">
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm text-primary/80">{dictionary.hero.greeting}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {dictionary.hero.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/projects">{dictionary.hero.ctaSecondary}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
