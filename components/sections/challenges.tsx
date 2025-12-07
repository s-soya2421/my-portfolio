'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/sections/section-header';
import { useI18n } from '@/components/providers/i18n-provider';

export type ChallengeItem = {
  title: string;
  description: string;
  status?: ReactNode;
};

export const ChallengesSection = ({ items }: { items: ChallengeItem[] }) => {
  const { dictionary } = useI18n();

  return (
    <section className="container py-12">
      <SectionHeader
        eyebrow={dictionary.sections.challenges}
        title={dictionary.sections.challengesTitle}
        description={dictionary.sections.challengesDescription}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                <span>{item.status ?? dictionary.sections.challenges}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
