'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { type Dictionary, FALLBACK_LOCALE, getDictionary } from '@/lib/i18n';
import { getLocaleFromPath } from '@/lib/locale';
import type { SiteLocale } from '@/lib/site';

const I18N_STORAGE_KEY = 'portfolio-locale';

type I18nContextValue = {
  locale: SiteLocale;
  dictionary: Dictionary;
  setLocale: (locale: SiteLocale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? '/';
  const routeLocale = getLocaleFromPath(pathname);
  const [locale, setLocaleState] = useState<SiteLocale>(() => routeLocale ?? FALLBACK_LOCALE);
  const [dictionary, setDictionary] = useState<Dictionary>(() => getDictionary(routeLocale));

  useEffect(() => {
    setLocaleState(routeLocale);
    setDictionary(getDictionary(routeLocale));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(I18N_STORAGE_KEY, routeLocale);
      document.documentElement.lang = routeLocale;
    }
  }, [routeLocale]);

  const setLocale = (value: SiteLocale) => {
    setLocaleState(value);
    setDictionary(getDictionary(value));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(I18N_STORAGE_KEY, value);
      document.documentElement.lang = value;
    }
  };

  const value: I18nContextValue = {
    locale,
    dictionary,
    setLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
