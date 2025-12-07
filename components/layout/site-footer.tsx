'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';
import { siteConfig } from '@/lib/site';

const social = [
  { icon: Github, href: siteConfig.social.github, label: 'GitHub' },
  { icon: Twitter, href: siteConfig.social.x, label: 'X (Twitter)' },
];

export const SiteFooter = () => {
  const { dictionary } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{dictionary.footer.madeIn}</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {dictionary.footer.rights}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {social.map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon className="h-5 w-5 text-muted-foreground transition hover:text-primary" />
            </Link>
          ))}
          <Link
            href="https://github.com/s-soya2421"
            className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dictionary.footer.source}
          </Link>
        </div>
      </div>
    </footer>
  );
};
