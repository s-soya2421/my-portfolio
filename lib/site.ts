export const siteConfig = {
  name: 'Soya — Engineer Portfolio',
  author: 'Soya',
  email: '',
  description:
    'Soyaのポートフォリオ。フルスタック開発とDevOpsを組み合わせ、ユーザー体験とパフォーマンスを高水準で実現します。',
  tagline: 'フルスタック × パフォーマンス最適化',
  url: 'https://s-soya.tech',
  social: {
    github: 'https://github.com/s-soya2421',
    x: 'https://x.com/',
    linkedin: 'https://www.linkedin.com'
  },
  defaultLocale: 'ja' as const,
  locales: ['ja', 'en'] as const,
  keywords: [
    'Next.js',
    'TypeScript',
    'Portfolio',
    'Frontend Engineer',
    'Performance Optimization'
  ]
};

export type SiteLocale = (typeof siteConfig.locales)[number];
