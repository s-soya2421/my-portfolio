export const REQUEST_ID_HEADER = 'x-request-id';

const DEFAULT_REQUEST_ID_BYTES = 16;

const fillRandomBytes = (bytes: Uint8Array) => {
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return;
  }

  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
};

export const generateRequestId = (bytes = DEFAULT_REQUEST_ID_BYTES): string => {
  const buffer = new Uint8Array(bytes);
  fillRandomBytes(buffer);
  return Array.from(buffer, (value) => value.toString(16).padStart(2, '0')).join('');
};

export const getRequestIdFromHeaders = (headers: Headers): string | null =>
  headers.get(REQUEST_ID_HEADER);
