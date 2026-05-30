import api from './api';

export const habitsService = {
  listPredefined: () => api.get('/habits/predefined'),
  createHabit: (data) => api.post('/habits', data),
  listMine: () => api.get('/habits/mine'),
  getStreak: (habitId) => api.get(`/habits/${habitId}/streak`),
  check: (habitId) => api.post(`/habits/${habitId}/check`),
  deleteHabit: (habitId) => api.delete(`/habits/${habitId}`),
  listBadges: () => api.get('/badges'),
};
