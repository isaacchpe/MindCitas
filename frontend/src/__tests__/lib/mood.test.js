import { describe, it, expect } from 'vitest';
import { MOODS, MOOD_LIST } from '../../lib/mood';

describe('mood config', () => {
  it('MOOD_LIST tiene 5 niveles', () => {
    expect(MOOD_LIST).toEqual([1, 2, 3, 4, 5]);
  });

  it('cada mood tiene emoji, label, bg y text', () => {
    for (const level of MOOD_LIST) {
      const m = MOODS[level];
      expect(m).toHaveProperty('emoji');
      expect(m).toHaveProperty('label');
      expect(m).toHaveProperty('bg');
      expect(m).toHaveProperty('text');
    }
  });

  it('labels son los esperados', () => {
    expect(MOODS[1].label).toBe('Muy mal');
    expect(MOODS[3].label).toBe('Regular');
    expect(MOODS[5].label).toBe('Muy bien');
  });
});
