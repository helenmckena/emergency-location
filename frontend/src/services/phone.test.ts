import { describe, expect, it } from 'vitest';

import { isValidPhone, normalizePhone } from './phone';

describe('normalizePhone', () => {
  it('rewrites a national 8 prefix to +7', () => {
    expect(normalizePhone('87001234567')).toBe(
      '+77001234567',
    );
  });

  it('strips the separators the backend would choke on', () => {
    expect(normalizePhone('8 (700) 123-45-67')).toBe(
      '+77001234567',
    );
  });

  it('leaves an international number alone', () => {
    expect(normalizePhone('+7 700 123 45 67')).toBe(
      '+77001234567',
    );
  });

  it('does not touch an 8 that is not a national prefix', () => {
    expect(normalizePhone('812345')).toBe('812345');
  });
});

describe('isValidPhone', () => {
  it('accepts a number typed with the national 8 prefix', () => {
    expect(isValidPhone('87001234567')).toBe(true);
  });

  it('accepts an international number', () => {
    expect(isValidPhone('+77001234567')).toBe(true);
  });

  it('rejects a number that stays without a country code', () => {
    expect(isValidPhone('8700123')).toBe(false);
  });

  it('rejects a country code starting with zero', () => {
    expect(isValidPhone('+07001234567')).toBe(false);
  });
});
