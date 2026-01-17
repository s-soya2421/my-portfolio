'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { SectionHeader } from '@/components/sections/section-header';

export type ChallengeItem = {
  title: string;
  description: string;
  status?: ReactNode;
};

export const ChallengesSection = ({ items }: { items: ChallengeItem[] }) => {
  const { dictionary } = useI18n();
  const delayClasses = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];

  return (
    <section className="container py-12">
      <SectionHeader
        eyebrow={dictionary.sections.challenges}
        title={dictionary.sections.challengesTitle}
        description={dictionary.sections.challengesDescription}
      />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.title}
            className={`reveal-rise ${delayClasses[index] ?? 'reveal-delay-4'}`}
          >
            <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                <span>{item.status ?? dictionary.sections.challenges}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
