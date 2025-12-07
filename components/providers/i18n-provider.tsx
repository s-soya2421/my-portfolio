'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FALLBACK_LOCALE, getDictionary, isValidLocale, type Dictionary } from '@/lib/i18n';
import type { SiteLocale } from '@/lib/site';

const I18N_STORAGE_KEY = 'portfolio-locale';

type I18nContextValue = {
  locale: SiteLocale;
  dictionary: Dictionary;
  setLocale: (locale: SiteLocale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<SiteLocale>(() => FALLBACK_LOCALE);
  const [dictionary, setDictionary] = useState<Dictionary>(() => getDictionary(FALLBACK_LOCALE));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(I18N_STORAGE_KEY);
    if (stored && isValidLocale(stored)) {
      setLocale(stored as SiteLocale);
    }
  }, []);

  const setLocale = (value: SiteLocale) => {
    setLocaleState(value);
    setDictionary(getDictionary(value));
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(I18N_STORAGE_KEY, value);
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
