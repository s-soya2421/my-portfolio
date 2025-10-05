export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const isAnalyticsEnabled = () => Boolean(GA_ID);
