'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { buildLocalePath, stripLocaleFromPath } from '@/lib/locale';
import { navigationItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export const SiteHeader = () => {
  const pathname = usePathname();
  const currentPath = stripLocaleFromPath(pathname ?? '/');
  const { dictionary, locale } = useI18n();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={buildLocalePath('/', locale)}
            className="flex items-center gap-2"
            onClick={close}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
              SS
            </div>
            <span className="hidden text-sm font-semibold leading-tight md:flex">
              {dictionary.hero.title}
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={buildLocalePath(item.href, locale)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                currentPath === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {dictionary.navigation[item.key]}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-border/60"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background/95 md:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={buildLocalePath(item.href, locale)}
                className={cn(
                  'rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-accent/60',
                  currentPath === item.href ? 'bg-primary/10 text-primary' : 'text-foreground'
                )}
                onClick={close}
              >
                {dictionary.navigation[item.key]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
