import { type NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';
import { getRequestContext } from './lib/request-context';
import { generateRequestId, getRequestIdFromHeaders, REQUEST_ID_HEADER } from './lib/request-id';

export const middleware = (request: NextRequest) => {
  const requestId = getRequestIdFromHeaders(request.headers) ?? generateRequestId();
  const headers = new Headers(request.headers);
  headers.set(REQUEST_ID_HEADER, requestId);

  logger.info('request received', {
    event: 'request.middleware',
    ...getRequestContext(request, requestId),
  });

  const response = NextResponse.next({ request: { headers } });
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
};

export const config = {
  matcher: ['/:path*'],
};
