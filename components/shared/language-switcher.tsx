'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background p-1 text-xs font-semibold">
      {siteConfig.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            'rounded-full px-2 py-1 uppercase transition-colors',
            locale === code ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
          )}
          aria-pressed={locale === code}
        >
          {code}
        </button>
      ))}
    </div>
  );
};
