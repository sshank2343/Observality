import { describe, it, expect } from 'vitest';
import { formatCost, formatLatency, truncate, formatDate } from './formatters';

describe('formatCost', () => {
  it('formats a number as a dollar string with 5 decimals', () => {
    expect(formatCost(0.00012)).toBe('$0.00012');
  });

  it('handles zero', () => {
    expect(formatCost(0)).toBe('$0.00000');
  });
});

describe('formatLatency', () => {
  it('rounds and appends ms', () => {
    expect(formatLatency(452.7)).toBe('453ms');
  });
});

describe('truncate', () => {
  it('returns text unchanged if under the limit', () => {
    expect(truncate('short text', 60)).toBe('short text');
  });

  it('truncates and adds ellipsis if over the limit', () => {
    const longText = 'a'.repeat(100);
    const result = truncate(longText, 60);
    expect(result.length).toBe(63); // 60 chars + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('handles empty/null input', () => {
    expect(truncate(null)).toBe('');
    expect(truncate('')).toBe('');
  });
});

describe('formatDate', () => {
  it('returns a non-empty formatted string', () => {
    const result = formatDate('2026-08-14T10:30:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});