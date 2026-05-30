import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/cn';

describe('cn', () => {
  it('combina clases', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('filtra valores falsy', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('retorna string vacio sin argumentos', () => {
    expect(cn()).toBe('');
  });
});
