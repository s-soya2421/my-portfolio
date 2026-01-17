import type { NextRequest } from 'next/server';
import { logger } from './logger';
import { getRequestContext } from './request-context';
import { generateRequestId, getRequestIdFromHeaders, REQUEST_ID_HEADER } from './request-id';

type RequestHandler<Context = unknown> = (
  request: NextRequest,
  context: Context
) => Response | Promise<Response>;

type RequestLogOptions = {
  trace?: string;
};

const DEFAULT_BODY_MAX_LEN = 2000;
const REDACT_KEYS = new Set([
  'authorization',
  'cookie',
  'password',
  'token',
  'secret',
  'set-cookie',
]);

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

const getBodyMaxLen = () => parsePositiveInt(getEnv('LOG_BODY_MAX_LEN'), DEFAULT_BODY_MAX_LEN);

const truncate = (value: string, maxLen: number): string => {
  if (value.length <= maxLen) {
    return value;
  }
  return `${value.slice(0, maxLen)}...`;
};

const redactObject = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => redactObject(item));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (REDACT_KEYS.has(key.toLowerCase())) {
        return [key, '[REDACTED]'];
      }
      return [key, redactObject(nestedValue)];
    })
  );
};

const buildQueryObject = (url: URL): Record<string, string | string[]> | undefined => {
  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    if (key in query) {
      const existing = query[key];
      query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      query[key] = value;
    }
  });

  return Object.keys(query).length > 0 ? query : undefined;
};

const readRequestBody = async (request: NextRequest): Promise<unknown | undefined> => {
  try {
    const maxLen = getBodyMaxLen();
    const contentType = request.headers.get('content-type') ?? '';
    const text = await request.clone().text();
    if (!text) {
      return undefined;
    }

    if (contentType.includes('application/json') && text.length <= maxLen) {
      try {
        return redactObject(JSON.parse(text));
      } catch {
        return truncate(text, maxLen);
      }
    }

    return truncate(text, maxLen);
  } catch {
    return undefined;
  }
};

const buildDebugContext = async (request: NextRequest) => {
  const headers = redactObject(Object.fromEntries(request.headers.entries())) as Record<
    string,
    unknown
  >;
  const body = await readRequestBody(request);
  const query = buildQueryObject(request.nextUrl);

  return {
    headers,
    body,
    query,
  };
};

const buildTrace = (request: NextRequest, options?: RequestLogOptions) =>
  options?.trace ?? `handler:${request.method} ${request.nextUrl.pathname}`;

export const withRequestLogging =
  <Context>(handler: RequestHandler<Context>, options?: RequestLogOptions) =>
  async (request: NextRequest, context: Context): Promise<Response> => {
    const start = Date.now();
    const requestId = getRequestIdFromHeaders(request.headers) ?? generateRequestId();
    const baseContext = getRequestContext(request, requestId);
    const debugContext = logger.isEnabled('debug') ? await buildDebugContext(request) : undefined;

    logger.info('request start', {
      event: 'request.start',
      ...baseContext,
      ...(debugContext ?? {}),
    });

    try {
      const response = await handler(request, context);
      const durationMs = Date.now() - start;
      try {
        response.headers.set(REQUEST_ID_HEADER, requestId);
      } catch {
        // Ignore immutable response headers (e.g. passthrough fetch responses).
      }

      logger.info('request end', {
        event: 'request.end',
        ...baseContext,
        status: response.status,
        durationMs,
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - start;
      logger.error('request error', {
        event: 'request.error',
        ...baseContext,
        durationMs,
        error,
        trace: buildTrace(request, options),
        ...(debugContext ?? {}),
      });
      throw error;
    }
  };
