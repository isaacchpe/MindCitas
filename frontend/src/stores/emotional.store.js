import { create } from 'zustand';

export const useEmotionalStore = create((set) => ({
  todayEntry: null,
  weeklyTrend: [],
  recentEntries: [],
  setTodayEntry: (entry) => set({ todayEntry: entry }),
  setWeeklyTrend: (trend) => set({ weeklyTrend: trend }),
  setRecentEntries: (entries) => set({ recentEntries: entries }),
}));
