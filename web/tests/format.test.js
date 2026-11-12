/* format.test.js - teste pentru shared/format.js (R v2.2.0) */
import { describe, expect, it } from 'vitest';
import { detailFields, formatLocalTime, formatLocation } from '../../shared/format';

describe('formatLocation', () => {
  it('uneste orasul, regiunea si tara', () => {
    const place = { city: 'Ashburn', region: 'Virginia', country: 'United States' };
    expect(formatLocation(place)).toBe('Ashburn, Virginia, United States');
  });

  it('sare peste campurile lipsa', () => {
    expect(formatLocation({ city: '', region: '', country: 'Romania' })).toBe('Romania');
    expect(formatLocation({})).toBe('Necunoscuta');
  });
});

describe('formatLocalTime', () => {
  it('afiseaza ora din fusul orar dat', () => {
    const noon = new Date('2026-01-15T12:00:00Z');
    expect(formatLocalTime('UTC', noon)).toContain('12:00:00');
    expect(formatLocalTime('Europe/Bucharest', noon)).toContain('14:00:00');
  });

  it('intoarce text gol pentru un fus orar lipsa sau invalid', () => {
    expect(formatLocalTime('')).toBe('');
    expect(formatLocalTime('Nu/Exista')).toBe('');
  });
});

describe('detailFields', () => {
  it('pune textele de rezerva pentru campurile lipsa', () => {
    const values = detailFields({ ip: '1.1.1.1', city: 'Sydney' }, '').map((field) => field.value);
    expect(values).toEqual(['Indisponibil', 'Necunoscut', 'Sydney', 'Necunoscut', 'Necunoscuta']);
  });

  it('da fiecarui camp o iconita si un ton', () => {
    const fields = detailFields({}, '');
    expect(fields.every((field) => field.icon && field.tone)).toBe(true);
  });
});
