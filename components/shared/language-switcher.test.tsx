import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

let currentLocale: 'ja' | 'en' = 'ja';
let currentPathname = '/projects';
const setLocale = vi.fn();
const push = vi.fn();

vi.mock('@/components/providers/i18n-provider', () => ({
  useI18n: () => ({ locale: currentLocale, setLocale, dictionary: {} }),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ push }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    setLocale.mockClear();
    push.mockClear();
    currentLocale = 'ja';
    currentPathname = '/projects';
  });

  it('switches locale and updates the path', () => {
    render(<LanguageSwitcher />);

    const enButton = screen.getByRole('button', { name: 'en' });
    fireEvent.click(enButton);

    expect(setLocale).toHaveBeenCalledWith('en');
    expect(push).toHaveBeenCalledWith('/en/projects');
  });

  it('does nothing when selecting the current locale', () => {
    render(<LanguageSwitcher />);

    const jaButton = screen.getByRole('button', { name: 'ja' });
    fireEvent.click(jaButton);

    expect(setLocale).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(jaButton).toHaveAttribute('aria-pressed', 'true');
  });
});
