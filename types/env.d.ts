declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GA_ID?: string;
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
      LOG_STACK_MAX_LEN?: string;
      LOG_TRACE_MAX_LEN?: string;
      LOG_BODY_MAX_LEN?: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
