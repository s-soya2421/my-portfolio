import type { NextRequest } from 'next/server';

export type RequestContext = {
  requestId: string;
  method: string;
  path: string;
  clientIp: string | null;
  proxyIp: string | null;
  destIp: string | null;
  host: string | null;
  protocol: string | null;
  userAgent: string | null;
  referrer: string | null;
};

export const getRequestContext = (request: NextRequest, requestId: string): RequestContext => {
  const forwardedFor = request.headers.get('x-forwarded-for') ?? '';
  const forwardedIps = forwardedFor
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const clientIp = forwardedIps[0] ?? request.headers.get('x-real-ip') ?? null;
  const proxyIp = forwardedIps.length > 1 ? forwardedIps.slice(1).join(',') : null;
  const destIp =
    request.headers.get('x-forwarded-server') ??
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    null;
  const protocol =
    request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '');

  return {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    clientIp,
    proxyIp,
    destIp,
    host: request.headers.get('host'),
    protocol,
    userAgent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
  };
};
