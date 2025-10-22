import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers';
import { baseMetadata, websiteJsonLd, personJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const sans = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#09090b' }, { color: '#ffffff' }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.defaultLocale} suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} font-sans min-h-screen bg-background text-foreground`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Script id="structured-data-website" type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </Script>
        <Script id="structured-data-person" type="application/ld+json">
          {JSON.stringify(personJsonLd)}
        </Script>
      </body>
    </html>
  );
}
