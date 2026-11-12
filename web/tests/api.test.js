/* api.test.js - teste pentru validarea cautarii din shared/api.js (M v2.1.0) */
import { describe, expect, it } from 'vitest';
import { classifyQuery, cleanQuery } from '../../shared/api';

describe('cleanQuery', () => {
  it('scoate protocolul, portul si calea', () => {
    expect(cleanQuery(' https://github.com:443/user?tab=1 ')).toBe('github.com');
  });

  it('scoate parantezele unui IPv6', () => {
    expect(cleanQuery('[::1]')).toBe('::1');
  });
});

describe('classifyQuery', () => {
  it('recunoaste IP-uri, domenii si IP-ul propriu', () => {
    expect(classifyQuery('8.8.8.8')).toEqual({ type: 'ip', value: '8.8.8.8' });
    expect(classifyQuery('2001:db8::1')).toEqual({ type: 'ip', value: '2001:db8::1' });
    expect(classifyQuery('https://github.com/user')).toEqual({ type: 'domain', value: 'github.com' });
    expect(classifyQuery('localhost')).toEqual({ type: 'current', value: '' });
  });

  it('respinge formatele invalide', () => {
    expect(classifyQuery('256.1.1.1')).toBeNull();
    expect(classifyQuery('nu este domeniu')).toBeNull();
  });
});
