import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

const resolveHref = (href: unknown) => {
  if (typeof href === 'string') return href;
  if (href && typeof href === 'object' && 'pathname' in href) {
    const pathname = (href as { pathname?: string }).pathname;
    return typeof pathname === 'string' ? pathname : '';
  }
  return href ? String(href) : '';
};

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch: _prefetch,
    ...props
  }: {
    href: unknown;
    children: React.ReactNode;
    prefetch?: boolean;
  }) =>
    React.createElement('a', { href: resolveHref(href), ...props }, children),
}));

vi.mock('next/script', () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
  }) => React.createElement('script', props, children),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
  }) => React.createElement('img', { src, alt, ...props }),
}));
