'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/components/providers/i18n-provider';
import { buildLocalePath } from '@/lib/locale';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

export const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  const handleSwitch = (code: (typeof siteConfig.locales)[number]) => {
    if (code === locale) return;
    setLocale(code);
    router.push(buildLocalePath(pathname, code));
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background p-1 text-xs font-semibold">
      {siteConfig.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSwitch(code)}
          className={cn(
            'rounded-full px-2 py-1 uppercase transition-colors',
            locale === code
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground'
          )}
          aria-pressed={locale === code}
        >
          {code}
        </button>
      ))}
    </div>
  );
};
