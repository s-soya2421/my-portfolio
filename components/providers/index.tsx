'use client';

import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { I18nProvider } from './i18n-provider';
import { ThemeProvider } from './theme-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <I18nProvider>
        {children}
        <GoogleAnalytics />
      </I18nProvider>
    </ThemeProvider>
  );
};
