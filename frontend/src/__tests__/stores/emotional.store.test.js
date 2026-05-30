import { describe, it, expect, beforeEach } from 'vitest';
import { useEmotionalStore } from '../../stores/emotional.store';

describe('emotional store', () => {
  beforeEach(() => {
    useEmotionalStore.setState({ todayEntry: null, weeklyTrend: [], recentEntries: [] });
  });

  it('setTodayEntry actualiza el estado', () => {
    useEmotionalStore.getState().setTodayEntry({ mood: 4, note: 'bien' });
    expect(useEmotionalStore.getState().todayEntry.mood).toBe(4);
  });

  it('setWeeklyTrend guarda el array', () => {
    const trend = [{ date: '2026-05-27', mood: 3 }];
    useEmotionalStore.getState().setWeeklyTrend(trend);
    expect(useEmotionalStore.getState().weeklyTrend).toHaveLength(1);
  });

  it('setRecentEntries guarda las entradas', () => {
    useEmotionalStore.getState().setRecentEntries([{ mood: 2 }, { mood: 5 }]);
    expect(useEmotionalStore.getState().recentEntries).toHaveLength(2);
  });
});
