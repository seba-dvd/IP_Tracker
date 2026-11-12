/* history.test.js - teste pentru shared/history.js (D v2.3.0) */
import { describe, expect, it } from 'vitest';
import { addQuery, parseHistory } from '../../shared/history';

describe('addQuery', () => {
  it('pune cautarea noua prima', () => {
    expect(addQuery(['1.1.1.1'], '8.8.8.8')).toEqual(['8.8.8.8', '1.1.1.1']);
  });

  it('muta o cautare repetata in fata, fara dubluri', () => {
    expect(addQuery(['a.com', 'b.com', 'c.com'], 'c.com')).toEqual(['c.com', 'a.com', 'b.com']);
  });

  it('pastreaza cel mult 5 cautari', () => {
    expect(addQuery(['1', '2', '3', '4', '5'], '6')).toEqual(['6', '1', '2', '3', '4']);
  });
});

describe('parseHistory', () => {
  it('citeste o lista salvata corect', () => {
    expect(parseHistory('["github.com","8.8.8.8"]')).toEqual(['github.com', '8.8.8.8']);
  });

  it('ignora datele lipsa sau stricate', () => {
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory('{nu este json')).toEqual([]);
    expect(parseHistory('[1, "ok", null]')).toEqual(['ok']);
  });
});