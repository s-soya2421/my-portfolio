import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REQUEST_ID_HEADER } from '@/lib/request-id';
import { withRequestLogging } from '@/lib/request-logger';

const { mockLogger } = vi.hoisted(() => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    isEnabled: vi.fn().mockReturnValue(false),
  };
  return { mockLogger };
});

vi.mock('@/lib/logger', () => ({
  logger: mockLogger,
}));

const createMockRequest = (
  options: {
    method?: string;
    pathname?: string;
    headers?: Record<string, string>;
    body?: string;
  } = {}
) => {
  const { method = 'GET', pathname = '/test', headers = {}, body = '' } = options;
  return {
    method,
    headers: new Headers(headers),
    nextUrl: { pathname, protocol: 'https:' },
    clone: () => ({ text: async () => body }),
  } as unknown as import('next/server').NextRequest;
};

describe('withRequestLogging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger.isEnabled.mockReturnValue(false);
  });

  it('calls the wrapped handler and returns its response', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const wrapped = withRequestLogging(handler);

    const response = await wrapped(createMockRequest(), {});

    expect(handler).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
  });

  it('passes context argument to handler', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK'));
    const wrapped = withRequestLogging(handler);
    const context = { params: { id: '42' } };

    await wrapped(createMockRequest(), context);

    expect(handler).toHaveBeenCalledWith(expect.anything(), context);
  });

  it('logs request.start before calling handler', async () => {
    const order: string[] = [];
    const handler = vi.fn().mockImplementation(async () => {
      order.push('handler');
      return new Response('OK');
    });
    mockLogger.info.mockImplementation((_msg: string, meta: Record<string, unknown>) => {
      if (meta?.event) order.push(meta.event as string);
    });

    const wrapped = withRequestLogging(handler);
    await wrapped(createMockRequest(), {});

    expect(order[0]).toBe('request.start');
    expect(order[1]).toBe('handler');
    expect(order[2]).toBe('request.end');
  });

  it('logs request.start with method and path', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK'));
    const wrapped = withRequestLogging(handler);

    await wrapped(createMockRequest({ method: 'POST', pathname: '/api/data' }), {});

    const startMeta = mockLogger.info.mock.calls[0][1] as Record<string, unknown>;
    expect(startMeta.event).toBe('request.start');
    expect(startMeta.method).toBe('POST');
    expect(startMeta.path).toBe('/api/data');
  });

  it('logs request.end with status and durationMs', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK', { status: 201 }));
    const wrapped = withRequestLogging(handler);

    await wrapped(createMockRequest(), {});

    const endMeta = mockLogger.info.mock.calls[1][1] as Record<string, unknown>;
    expect(endMeta.event).toBe('request.end');
    expect(endMeta.status).toBe(201);
    expect(typeof endMeta.durationMs).toBe('number');
    expect(endMeta.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('sets REQUEST_ID_HEADER on response', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK'));
    const wrapped = withRequestLogging(handler);

    const response = await wrapped(createMockRequest(), {});

    expect(response.headers.get(REQUEST_ID_HEADER)).toBeTruthy();
  });

  it('uses existing request ID from incoming header', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK'));
    const wrapped = withRequestLogging(handler);
    const request = createMockRequest({ headers: { [REQUEST_ID_HEADER]: 'existing-id-123' } });

    const response = await wrapped(request, {});

    expect(response.headers.get(REQUEST_ID_HEADER)).toBe('existing-id-123');
  });

  it('generates a new request ID when header is absent', async () => {
    const handler = vi.fn().mockResolvedValue(new Response('OK'));
    const wrapped = withRequestLogging(handler);

    const response = await wrapped(createMockRequest(), {});
    const id = response.headers.get(REQUEST_ID_HEADER);

    expect(id).toBeTruthy();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('logs request.error and rethrows when handler throws', async () => {
    const error = new Error('handler failed');
    const handler = vi.fn().mockRejectedValue(error);
    const wrapped = withRequestLogging(handler);

    await expect(wrapped(createMockRequest(), {})).rejects.toThrow('handler failed');

    expect(mockLogger.error).toHaveBeenCalledOnce();
    const [, meta] = mockLogger.error.mock.calls[0] as [string, Record<string, unknown>];
    expect(meta.event).toBe('request.error');
    expect(meta.error).toBe(error);
    expect(typeof meta.durationMs).toBe('number');
  });

  it('does not call logger.info for request.end when handler throws', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('oops'));
    const wrapped = withRequestLogging(handler);

    await expect(wrapped(createMockRequest(), {})).rejects.toThrow();

    const endCalls = mockLogger.info.mock.calls.filter(
      ([, meta]) => (meta as Record<string, unknown>)?.event === 'request.end'
    );
    expect(endCalls).toHaveLength(0);
  });
});
