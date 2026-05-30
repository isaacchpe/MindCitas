import { describe, it, expect } from 'vitest';
import {
  formatDateShort,
  formatDateLong,
  getToday,
  getTodayISO,
  getLast7Days,
  getDayShort,
} from '../../lib/date';

describe('date helpers', () => {
  it('formatDateShort formatea correctamente', () => {
    const result = formatDateShort('2026-05-27T00:00:00.000Z');
    expect(result).toContain('27');
    expect(result).toContain('may');
  });

  it('formatDateLong incluye dia de la semana y mes', () => {
    const result = formatDateLong(new Date(2026, 4, 27));
    expect(result).toContain('27');
    expect(result).toContain('mayo');
  });

  it('getToday retorna medianoche UTC', () => {
    const today = getToday();
    expect(today.getUTCHours()).toBe(0);
    expect(today.getUTCMinutes()).toBe(0);
    expect(today.getUTCSeconds()).toBe(0);
  });

  it('getTodayISO retorna formato ISO', () => {
    const iso = getTodayISO();
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('getLast7Days retorna 7 dias', () => {
    const days = getLast7Days();
    expect(days).toHaveLength(7);
    expect(days[0]).toHaveProperty('date');
    expect(days[0]).toHaveProperty('short');
    expect(days[0]).toHaveProperty('long');
  });

  it('getDayShort retorna abreviatura del dia', () => {
    const result = getDayShort('2026-05-25T00:00:00.000Z');
    expect(['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']).toContain(result);
  });
});
