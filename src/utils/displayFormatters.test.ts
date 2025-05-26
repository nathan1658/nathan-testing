// src/utils/displayFormatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, truncateUserId } from './displayFormatters';

describe('formatDate', () => {
  it('should format a valid ISO date string', () => {
    // Note: toLocaleDateString() is locale-dependent. 
    // For consistency in tests, you might want to mock it or test against a specific format.
    // For this example, we'll assume the environment's default locale is consistent.
    expect(formatDate('2023-10-26T10:00:00.000Z')).toBe(new Date('2023-10-26T10:00:00.000Z').toLocaleDateString());
  });

  it('should format a Date object', () => {
    const date = new Date(2023, 9, 26); // Month is 0-indexed (9 is October)
    expect(formatDate(date)).toBe(date.toLocaleDateString());
  });

  it('should return "Invalid Date" for an invalid date string', () => {
    // The implementation in displayFormatters.ts returns 'Invalid Date' for 'not-a-date'
    // due to the isNaN(date.getTime()) check.
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });
  
  it('should return empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('should handle null or undefined input gracefully (as per implementation)', () => {
    // @ts-expect-error testing invalid input
    expect(formatDate(null)).toBe('');
    // @ts-expect-error testing invalid input
    expect(formatDate(undefined)).toBe('');
  });
});

describe('truncateUserId', () => {
  it('should not truncate a short user ID', () => {
    expect(truncateUserId('user123', 15)).toBe('user123');
  });

  it('should truncate a long user ID with default length (15)', () => {
    expect(truncateUserId('auth0|verylonguseridstringexample', 15)).toBe('auth0|verylongu...');
  });

  it('should truncate a long user ID with specified length', () => {
    expect(truncateUserId('auth0|verylonguseridstringexample', 10)).toBe('auth0|very...');
  });
  
  it('should return empty string for empty input', () => {
    expect(truncateUserId('', 15)).toBe('');
  });

  it('should handle null or undefined input gracefully (as per implementation)', () => {
    // @ts-expect-error testing invalid input
    expect(truncateUserId(null)).toBe('');
    // @ts-expect-error testing invalid input
    expect(truncateUserId(undefined)).toBe('');
  });

  it('should handle custom length correctly', () => {
    expect(truncateUserId('short', 10)).toBe('short');
    expect(truncateUserId('thisislongerthan10', 10)).toBe('thisislong...');
  });
});
