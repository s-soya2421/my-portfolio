export const siteConfig = {
  name: 'Soya — Full-Stack-ish Engineer',
  author: 'Soya',
  email: 'your-email@example.com', // TODO: 実際のメールアドレスに変更してください
  description:
    'Soyaのポートフォリオ。フルスタック開発とDevOpsを組み合わせ、ユーザー体験とパフォーマンスを高水準で実現します。',
  tagline: 'フルスタック × パフォーマンス最適化',
  url: 'https://s-soya.tech',
  social: {
    github: 'https://github.com/s-soya2421',
    x: 'https://x.com/your-username', // TODO: 実際のXアカウントに変更してください
    linkedin: 'https://www.linkedin.com/in/your-profile' // TODO: 実際のLinkedInプロフィールに変更してください
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
