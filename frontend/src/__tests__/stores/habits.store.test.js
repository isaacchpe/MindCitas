import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHabitsStore } from '../../stores/habits.store';

vi.mock('../../services/habits.service', () => ({
  habitsService: {
    listMine: vi
      .fn()
      .mockResolvedValue({
        data: {
          data: [
            { _id: 'h1', name: 'Test', currentStreak: 0, bestStreak: 0, completedToday: false },
          ],
        },
      }),
    createHabit: vi
      .fn()
      .mockResolvedValue({ data: { data: { _id: 'h2', name: 'New', habitType: 'custom' } } }),
    check: vi
      .fn()
      .mockResolvedValue({
        data: { data: { currentStreak: 1, bestStreak: 1, awardedBadge: null } },
      }),
    deleteHabit: vi.fn().mockResolvedValue({}),
    listBadges: vi.fn().mockResolvedValue({ data: { data: [] } }),
  },
}));

describe('habits store', () => {
  beforeEach(() => {
    useHabitsStore.setState({ habits: [], badges: [], loading: false, error: null });
  });

  it('fetchHabits carga los habitos', async () => {
    await useHabitsStore.getState().fetchHabits();
    expect(useHabitsStore.getState().habits).toHaveLength(1);
    expect(useHabitsStore.getState().loading).toBe(false);
  });

  it('createHabit agrega al array', async () => {
    await useHabitsStore.getState().createHabit({ habitType: 'custom', name: 'New' });
    expect(useHabitsStore.getState().habits).toHaveLength(1);
  });

  it('checkHabit actualiza streak y completedToday', async () => {
    useHabitsStore.setState({
      habits: [{ _id: 'h1', currentStreak: 0, bestStreak: 0, completedToday: false }],
    });
    await useHabitsStore.getState().checkHabit('h1');
    const h = useHabitsStore.getState().habits[0];
    expect(h.completedToday).toBe(true);
    expect(h.currentStreak).toBe(1);
  });

  it('deleteHabit remueve del array', async () => {
    useHabitsStore.setState({ habits: [{ _id: 'h1' }] });
    await useHabitsStore.getState().deleteHabit('h1');
    expect(useHabitsStore.getState().habits).toHaveLength(0);
  });
});
