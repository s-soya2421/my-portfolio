import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.*',
        'app/**/page.tsx',
        'app/**/layout.tsx',
        'app/robots.ts',
        'app/sitemap.ts',
        'components/layout/**',
        'components/providers/**',
        'components/analytics/**',
        'components/blog/**',
        'components/sections/blog-preview.tsx',
        'components/sections/projects-preview.tsx',
        'components/shared/tag.tsx',
        'lib/analytics.ts',
        'lib/data.ts',
        'lib/navigation.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
