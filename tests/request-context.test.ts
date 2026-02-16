import { describe, expect, it } from 'vitest';
import { type RequestContext, getRequestContext } from '@/lib/request-context';

const createMockRequest = (
  headers: Record<string, string> = {},
  options: { method?: string; pathname?: string; protocol?: string } = {}
) => {
  const { method = 'GET', pathname = '/test', protocol = 'https:' } = options;
  return {
    method,
    headers: new Headers(headers),
    nextUrl: { pathname, protocol },
  } as unknown as import('next/server').NextRequest;
};

describe('getRequestContext', () => {
  it('extracts client IP from x-forwarded-for', () => {
    const req = createMockRequest({ 'x-forwarded-for': '1.2.3.4' });
    const ctx = getRequestContext(req, 'req-1');
    expect(ctx.clientIp).toBe('1.2.3.4');
    expect(ctx.proxyIp).toBeNull();
  });

  it('extracts client and proxy IPs from multi-hop x-forwarded-for', () => {
    const req = createMockRequest({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1, 10.0.0.2' });
    const ctx = getRequestContext(req, 'req-2');
    expect(ctx.clientIp).toBe('1.2.3.4');
    expect(ctx.proxyIp).toBe('10.0.0.1,10.0.0.2');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const req = createMockRequest({ 'x-real-ip': '5.6.7.8' });
    const ctx = getRequestContext(req, 'req-3');
    expect(ctx.clientIp).toBe('5.6.7.8');
  });

  it('returns null clientIp when no IP headers exist', () => {
    const req = createMockRequest();
    const ctx = getRequestContext(req, 'req-4');
    expect(ctx.clientIp).toBeNull();
    expect(ctx.proxyIp).toBeNull();
  });

  it('resolves destIp with priority: x-forwarded-server > x-forwarded-host > host', () => {
    const req = createMockRequest({
      'x-forwarded-server': 'server.internal',
      'x-forwarded-host': 'host.example.com',
      host: 'fallback.example.com',
    });
    expect(getRequestContext(req, 'req-5').destIp).toBe('server.internal');
  });

  it('falls back to host header for destIp', () => {
    const req = createMockRequest({ host: 'example.com' });
    expect(getRequestContext(req, 'req-6').destIp).toBe('example.com');
  });

  it('extracts protocol from x-forwarded-proto', () => {
    const req = createMockRequest({ 'x-forwarded-proto': 'https' });
    expect(getRequestContext(req, 'req-7').protocol).toBe('https');
  });

  it('falls back to nextUrl.protocol when x-forwarded-proto is absent', () => {
    const req = createMockRequest({}, { protocol: 'http:' });
    expect(getRequestContext(req, 'req-8').protocol).toBe('http');
  });

  it('maps method, path, requestId, userAgent, and referrer', () => {
    const req = createMockRequest(
      { 'user-agent': 'TestBot/1.0', referer: 'https://google.com' },
      { method: 'POST', pathname: '/api/data' }
    );
    const ctx = getRequestContext(req, 'req-9');
    expect(ctx.requestId).toBe('req-9');
    expect(ctx.method).toBe('POST');
    expect(ctx.path).toBe('/api/data');
    expect(ctx.userAgent).toBe('TestBot/1.0');
    expect(ctx.referrer).toBe('https://google.com');
  });

  it('returns null for missing optional headers', () => {
    const req = createMockRequest();
    const ctx = getRequestContext(req, 'req-10');
    expect(ctx.userAgent).toBeNull();
    expect(ctx.referrer).toBeNull();
    expect(ctx.destIp).toBeNull();
  });
});
