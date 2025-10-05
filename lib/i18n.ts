import { siteConfig, type SiteLocale } from './site';

type SectionCopy = {
  navigation: {
    home: string;
    about: string;
    projects: string;
    blog: string;
  };
  hero: {
    greeting: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  sections: {
    now: string;
    challenges: string;
    featuredProjects: string;
    recentPosts: string;
  };
  actions: {
    viewAllProjects: string;
    viewAllPosts: string;
  };
  footer: {
    madeIn: string;
    rights: string;
    source: string;
  };
  projects: {
    filterAll: string;
    technologies: string;
  };
  blog: {
    empty: string;
    readMore: string;
  };
};

export type Dictionary = SectionCopy;

const dictionaries: Record<SiteLocale, Dictionary> = {
  ja: {
    navigation: {
      home: 'ホーム',
      about: 'プロフィール',
      projects: 'プロジェクト',
      blog: 'ブログ'
    },
    hero: {
      greeting: 'こんにちは、',
      title: siteConfig.name,
      subtitle: siteConfig.tagline,
      ctaPrimary: '相談してみる',
      ctaSecondary: 'プロジェクト一覧'
    },
    sections: {
      now: '今取り組んでいること',
      challenges: 'チャレンジ中',
      featuredProjects: '注目のプロジェクト',
      recentPosts: '最近の投稿'
    },
    actions: {
      viewAllProjects: 'すべてのプロジェクトを見る',
      viewAllPosts: 'すべての記事を見る'
    },
    footer: {
      madeIn: 'Made with Next.js & Tailwind CSS',
      rights: 'All rights reserved.',
      source: 'ソースコードを見る'
    },
    projects: {
      filterAll: 'すべて',
      technologies: '使用技術'
    },
    blog: {
      empty: 'まだ記事はありません。',
      readMore: '続きを読む'
    }
  },
  en: {
    navigation: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      blog: 'Blog'
    },
    hero: {
      greeting: 'Hi,',
      title: siteConfig.name,
      subtitle: 'Full-stack engineer focused on developer velocity and performance.',
      ctaPrimary: 'Request a chat',
      ctaSecondary: 'Browse projects'
    },
    sections: {
      now: 'Current focus',
      challenges: 'Current challenges',
      featuredProjects: 'Featured projects',
      recentPosts: 'Latest posts'
    },
    actions: {
      viewAllProjects: 'View all projects',
      viewAllPosts: 'View all posts'
    },
    footer: {
      madeIn: 'Made with Next.js & Tailwind CSS',
      rights: 'All rights reserved.',
      source: 'View source on GitHub'
    },
    projects: {
      filterAll: 'All',
      technologies: 'Tech stack'
    },
    blog: {
      empty: 'No posts yet.',
      readMore: 'Read more'
    }
  }
};

export const getDictionary = (locale: SiteLocale): Dictionary => dictionaries[locale];

export const isValidLocale = (locale: string): locale is SiteLocale =>
  siteConfig.locales.includes(locale as SiteLocale);

export const FALLBACK_LOCALE: SiteLocale = siteConfig.defaultLocale;
