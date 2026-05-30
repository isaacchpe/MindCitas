import { create } from 'zustand';
import { habitsService } from '../services/habits.service';

export const useHabitsStore = create((set) => ({
  habits: [],
  badges: [],
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await habitsService.listMine();
      set({ habits: data.data, loading: false });
    } catch (_e) {
      set({ error: 'No se pudieron cargar los habitos', loading: false });
    }
  },

  fetchBadges: async () => {
    try {
      const { data } = await habitsService.listBadges();
      set({ badges: data.data });
    } catch (_e) {
      /* noop */
    }
  },

  createHabit: async (payload) => {
    const { data } = await habitsService.createHabit(payload);
    set((s) => ({
      habits: [
        { ...data.data, currentStreak: 0, bestStreak: 0, completedToday: false },
        ...s.habits,
      ],
    }));
    return data.data;
  },

  checkHabit: async (habitId) => {
    const { data } = await habitsService.check(habitId);
    const result = data.data;

    set((s) => ({
      habits: s.habits.map((h) =>
        h._id === habitId
          ? {
              ...h,
              currentStreak: result.currentStreak,
              bestStreak: result.bestStreak,
              completedToday: true,
            }
          : h
      ),
      badges: result.awardedBadge ? [...s.badges, result.awardedBadge] : s.badges,
    }));

    return result;
  },

  deleteHabit: async (habitId) => {
    await habitsService.deleteHabit(habitId);
    set((s) => ({ habits: s.habits.filter((h) => h._id !== habitId) }));
  },
}));
