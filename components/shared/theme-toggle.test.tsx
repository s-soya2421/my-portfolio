import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

let currentTheme: 'light' | 'dark' = 'light';
const setTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: currentTheme, setTheme }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    setTheme.mockClear();
  });

  it('toggles from light to dark', async () => {
    currentTheme = 'light';
    render(<ThemeToggle />);

    const button = await screen.findByRole('button', { name: 'Toggle theme' });
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light', async () => {
    currentTheme = 'dark';
    render(<ThemeToggle />);

    const button = await screen.findByRole('button', { name: 'Toggle theme' });
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});
