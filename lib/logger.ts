export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

type LogMeta = {
  error?: unknown;
  trace?: string;
  stack?: string;
  [key: string]: unknown;
};

type LogConfig = {
  level: LogLevel;
  stackMaxLen: number;
  traceMaxLen: number;
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const CONSOLE_METHODS: Record<LogLevel, 'debug' | 'log' | 'warn' | 'error'> = {
  debug: 'debug',
  info: 'log',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
};

const getEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') {
    return undefined;
  }
  return process.env?.[key];
};

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getCurrentLogLevel = (): LogLevel => {
  const level = getEnv('LOG_LEVEL')?.toLowerCase() as LogLevel | undefined;
  return level && level in LOG_LEVELS ? level : 'info';
};

const getLogConfig = (): LogConfig => ({
  level: getCurrentLogLevel(),
  stackMaxLen: parsePositiveInt(getEnv('LOG_STACK_MAX_LEN'), 200),
  traceMaxLen: parsePositiveInt(getEnv('LOG_TRACE_MAX_LEN'), 200),
});

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getCurrentLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const truncate = (value: string, maxLen: number): string => {
  if (value.length <= maxLen) {
    return value;
  }
  return `${value.slice(0, maxLen)}...`;
};

const formatError = (
  error: unknown,
  trace: string | undefined,
  stackOverride: string | undefined,
  config: LogConfig
): Record<string, string> | undefined => {
  if (!error && !trace && !stackOverride) {
    return undefined;
  }

  let name = 'Error';
  let message = 'Unknown error';
  let stack: string | undefined;

  if (error instanceof Error) {
    name = error.name || name;
    message = error.message || message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    const maybeName = (error as { name?: string }).name;
    const maybeMessage = (error as { message?: string }).message;
    const maybeStack = (error as { stack?: string }).stack;
    if (maybeName) {
      name = maybeName;
    }
    if (maybeMessage) {
      message = maybeMessage;
    }
    if (typeof maybeStack === 'string') {
      stack = maybeStack;
    }
  }

  const formatted: Record<string, string> = {
    name,
    message,
  };

  const stackValue = stackOverride ?? stack;
  if (stackValue) {
    formatted.stack = truncate(stackValue, config.stackMaxLen);
  }
  if (trace) {
    formatted.trace = truncate(trace, config.traceMaxLen);
  }

  return formatted;
};

const buildLogEntry = (
  level: LogLevel,
  message: string,
  meta?: LogMeta
): Record<string, unknown> => {
  const config = getLogConfig();
  const { error, trace, stack, ...rest } = meta ?? {};
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    message,
  };

  const env = getEnv('NODE_ENV');
  if (env) {
    entry.env = env;
  }

  Object.assign(entry, rest);

  const errorPayload = formatError(error, trace, stack, config);
  if (errorPayload) {
    entry.error = errorPayload;
  }

  return entry;
};

const emitLog = (level: LogLevel, message: string, meta?: LogMeta): void => {
  if (!shouldLog(level)) {
    return;
  }
  const entry = buildLogEntry(level, message, meta);
  const line = JSON.stringify(entry);
  console[CONSOLE_METHODS[level]](line);
};

export const logger = {
  isEnabled: (level: LogLevel) => shouldLog(level),
  debug: (message: string, meta?: LogMeta) => emitLog('debug', message, meta),
  info: (message: string, meta?: LogMeta) => emitLog('info', message, meta),
  warn: (message: string, meta?: LogMeta) => emitLog('warn', message, meta),
  error: (message: string, meta?: LogMeta) => emitLog('error', message, meta),
  fatal: (message: string, meta?: LogMeta) => emitLog('fatal', message, meta),
};
