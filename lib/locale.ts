import { siteConfig, type SiteLocale } from './site';

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const getLocaleFromPath = (path: string): SiteLocale => {
  const normalized = normalizePath(path);
  const [first] = normalized.split('/').filter(Boolean);
  if (first && siteConfig.locales.includes(first as SiteLocale)) {
    return first as SiteLocale;
  }
  return siteConfig.defaultLocale;
};

export const stripLocaleFromPath = (path: string) => {
  const normalized = normalizePath(path);
  const segments = normalized.split('/').filter(Boolean);
  const [first, ...rest] = segments;
  if (first && siteConfig.locales.includes(first as SiteLocale)) {
    return rest.length ? `/${rest.join('/')}` : '/';
  }
  return normalized;
};

export const buildLocalePath = (path: string, locale: SiteLocale) => {
  const basePath = stripLocaleFromPath(path);
  if (locale === siteConfig.defaultLocale) {
    return basePath;
  }
  return basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
};
