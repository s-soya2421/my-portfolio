'use client';

import { ThemeProvider } from './theme-provider';
import { I18nProvider } from './i18n-provider';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

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
