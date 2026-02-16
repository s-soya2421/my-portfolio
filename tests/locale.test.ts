import { describe, expect, it } from 'vitest';
import { buildLocalePath, getLocaleFromPath, stripLocaleFromPath } from '@/lib/locale';
import { siteConfig } from '@/lib/site';

describe('getLocaleFromPath', () => {
  it('extracts locale from path with locale prefix', () => {
    expect(getLocaleFromPath('/en/blog')).toBe('en');
  });

  it('returns default locale when path has no locale prefix', () => {
    expect(getLocaleFromPath('/blog')).toBe(siteConfig.defaultLocale);
  });

  it('returns default locale for root path', () => {
    expect(getLocaleFromPath('/')).toBe(siteConfig.defaultLocale);
  });

  it('returns default locale for empty string', () => {
    expect(getLocaleFromPath('')).toBe(siteConfig.defaultLocale);
  });

  it('returns default locale for invalid locale prefix', () => {
    expect(getLocaleFromPath('/fr/about')).toBe(siteConfig.defaultLocale);
  });

  it('handles path without leading slash', () => {
    expect(getLocaleFromPath('en/blog')).toBe('en');
  });
});

describe('stripLocaleFromPath', () => {
  it('strips locale prefix from path', () => {
    expect(stripLocaleFromPath('/en/blog')).toBe('/blog');
  });

  it('strips locale prefix with nested path', () => {
    expect(stripLocaleFromPath('/en/blog/my-post')).toBe('/blog/my-post');
  });

  it('returns root when path is only locale', () => {
    expect(stripLocaleFromPath('/en')).toBe('/');
  });

  it('returns path as-is when no locale prefix', () => {
    expect(stripLocaleFromPath('/blog')).toBe('/blog');
  });

  it('returns root path as-is', () => {
    expect(stripLocaleFromPath('/')).toBe('/');
  });
});

describe('buildLocalePath', () => {
  it('returns base path for default locale', () => {
    expect(buildLocalePath('/en/blog', siteConfig.defaultLocale)).toBe('/blog');
  });

  it('prepends locale for non-default locale', () => {
    expect(buildLocalePath('/blog', 'en')).toBe('/en/blog');
  });

  it('returns /{locale} for root path with non-default locale', () => {
    expect(buildLocalePath('/', 'en')).toBe('/en');
  });

  it('returns root for root path with default locale', () => {
    expect(buildLocalePath('/', siteConfig.defaultLocale)).toBe('/');
  });
});
