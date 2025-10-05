declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GA_ID?: string;
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
