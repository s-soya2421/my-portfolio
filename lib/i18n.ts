import { type SiteLocale, siteConfig } from './site';

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
    challengesTitle: string;
    challengesDescription: string;
    featuredProjects: string;
    featuredProjectsTitle: string;
    featuredProjectsDescription: string;
    recentPosts: string;
    recentPostsTitle: string;
    recentPostsDescription: string;
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
    empty: string;
    preparingProjects: string;
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
      blog: 'ブログ',
    },
    hero: {
      greeting: 'こんにちは、',
      title: siteConfig.name,
      subtitle: siteConfig.tagline,
      ctaPrimary: '相談してみる',
      ctaSecondary: 'プロジェクト一覧',
    },
    sections: {
      now: '今取り組んでいること',
      challenges: 'チャレンジ中',
      challengesTitle: '取り組んでいるチャレンジ',
      challengesDescription:
        '継続的な改善を目指して、プロダクトづくりと働き方の両面で試行錯誤しています。',
      featuredProjects: '注目のプロジェクト',
      featuredProjectsTitle: '個人開発',
      featuredProjectsDescription: '自主開発で検証を進めているプロダクトをピックアップ。',
      recentPosts: '最近の投稿',
      recentPostsTitle: 'ブログ & ノート',
      recentPostsDescription: '設計検討や学びを軽量にまとめています。',
    },
    actions: {
      viewAllProjects: 'すべてのプロジェクトを見る',
      viewAllPosts: 'すべての記事を見る',
    },
    footer: {
      madeIn: 'Powered by Next.js & Tailwind CSS',
      rights: 'All rights reserved.',
      source: 'ソースコードを見る',
    },
    projects: {
      filterAll: 'すべて',
      technologies: '使用技術',
      empty: '該当するプロジェクトはありません。',
      preparingProjects: 'プロジェクト準備中です。',
    },
    blog: {
      empty: 'まだ記事はありません。',
      readMore: '続きを読む',
    },
  },
  en: {
    navigation: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      blog: 'Blog',
    },
    hero: {
      greeting: 'Hi,',
      title: siteConfig.name,
      subtitle: 'Full-stack engineer focused on developer velocity and performance.',
      ctaPrimary: 'Request a chat',
      ctaSecondary: 'Browse projects',
    },
    sections: {
      now: 'Current focus',
      challenges: 'Current challenges',
      challengesTitle: 'Current Challenges',
      challengesDescription:
        'Continuously improving product development and work practices through experimentation.',
      featuredProjects: 'Featured projects',
      featuredProjectsTitle: 'Personal Projects',
      featuredProjectsDescription: 'Selected products in development and validation.',
      recentPosts: 'Latest posts',
      recentPostsTitle: 'Blog & Notes',
      recentPostsDescription: 'Lightweight summaries of design considerations and learnings.',
    },
    actions: {
      viewAllProjects: 'View all projects',
      viewAllPosts: 'View all posts',
    },
    footer: {
      madeIn: 'Powered by Next.js & Tailwind CSS',
      rights: 'All rights reserved.',
      source: 'View source on GitHub',
    },
    projects: {
      filterAll: 'All',
      technologies: 'Tech stack',
      empty: 'No matching projects found.',
      preparingProjects: 'Projects coming soon.',
    },
    blog: {
      empty: 'No posts yet.',
      readMore: 'Read more',
    },
  },
};

export const getDictionary = (locale: SiteLocale): Dictionary => dictionaries[locale];

export const isValidLocale = (locale: string): locale is SiteLocale =>
  siteConfig.locales.includes(locale as SiteLocale);

export const FALLBACK_LOCALE: SiteLocale = siteConfig.defaultLocale;
