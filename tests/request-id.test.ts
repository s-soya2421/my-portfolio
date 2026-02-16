import { describe, expect, it } from 'vitest';
import { REQUEST_ID_HEADER, generateRequestId, getRequestIdFromHeaders } from '@/lib/request-id';

describe('REQUEST_ID_HEADER', () => {
  it('equals x-request-id', () => {
    expect(REQUEST_ID_HEADER).toBe('x-request-id');
  });
});

describe('generateRequestId', () => {
  it('returns a 32-char hex string by default (16 bytes)', () => {
    const id = generateRequestId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('returns hex string with length matching bytes * 2', () => {
    const id = generateRequestId(8);
    expect(id).toMatch(/^[0-9a-f]{16}$/);
  });

  it('produces unique values on each call', () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateRequestId()));
    expect(ids.size).toBe(20);
  });
});

describe('getRequestIdFromHeaders', () => {
  it('returns header value when present', () => {
    const headers = new Headers({ [REQUEST_ID_HEADER]: 'abc-123' });
    expect(getRequestIdFromHeaders(headers)).toBe('abc-123');
  });

  it('returns null when header is missing', () => {
    const headers = new Headers();
    expect(getRequestIdFromHeaders(headers)).toBeNull();
  });
});
