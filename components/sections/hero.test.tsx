import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from './hero';
import { getDictionary } from '@/lib/i18n';

let currentLocale: 'ja' | 'en' = 'ja';
let currentDictionary = getDictionary('en');

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ dictionary: currentDictionary, locale: currentLocale }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      React.createElement('div', props, children),
  },
}));

describe('Hero', () => {
  it('renders hero copy and project link for default locale', () => {
    currentLocale = 'ja';
    currentDictionary = getDictionary('en');
    render(<Hero />);

    expect(screen.getByText(currentDictionary.hero.greeting)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: currentDictionary.hero.title })
    ).toBeInTheDocument();
    expect(screen.getByText(currentDictionary.hero.subtitle)).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: currentDictionary.hero.ctaSecondary,
    });
    expect(link).toHaveAttribute('href', '/projects');
  });

  it('builds locale-aware links when in English', () => {
    currentLocale = 'en';
    currentDictionary = getDictionary('en');
    render(<Hero />);

    const link = screen.getByRole('link', {
      name: currentDictionary.hero.ctaSecondary,
    });
    expect(link).toHaveAttribute('href', '/en/projects');
  });
});
