import { describe, expect, it } from 'vitest';
import { FALLBACK_LOCALE, getDictionary, isValidLocale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site';

describe('i18n helpers', () => {
  it('returns localized copy for the ja locale', () => {
    const dictionary = getDictionary('ja');
    expect(dictionary.hero.title).toBe(siteConfig.name);
    expect(dictionary.actions.viewAllProjects).toMatch(/プロジェクト/);
  });

  it('uses the configured default locale as fallback', () => {
    expect(FALLBACK_LOCALE).toBe(siteConfig.defaultLocale);
  });

  it('validates locales', () => {
    expect(isValidLocale('ja')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('fr')).toBe(false);
  });
});
