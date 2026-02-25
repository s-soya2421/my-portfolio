import { describe, expect, it } from 'vitest';
import { cn, formatDate, uniqueArray } from '@/lib/utils';

describe('cn', () => {
  it('returns empty string when no inputs', () => {
    expect(cn()).toBe('');
  });

  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });
});

describe('formatDate', () => {
  it('formats date with default ja-JP locale', () => {
    const result = formatDate('2024-03-01');
    expect(result).toMatch(/2024/);
  });

  it('formats date with explicit en-US locale', () => {
    const result = formatDate('2024-03-01', 'en-US');
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/Mar/);
  });

  it('formats date with explicit ja-JP locale', () => {
    const result = formatDate('2024-03-01', 'ja-JP');
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/3/);
  });
});

describe('uniqueArray', () => {
  it('removes duplicate values', () => {
    expect(uniqueArray([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it('returns same array when no duplicates', () => {
    expect(uniqueArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('returns empty array for empty input', () => {
    expect(uniqueArray([])).toEqual([]);
  });
});
