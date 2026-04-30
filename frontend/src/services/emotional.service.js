import api from './api';

export const emotionalService = {
  createEntry: (data) => api.post('/emotional-entries', data),
  getByDate: (date) => api.get(`/emotional-entries/by-date/${date}`),
  getWeeklyTrend: () => api.get('/emotional-entries/weekly-trend'),
  getRecentEntries: (limit = 7) => api.get('/emotional-entries/recent', { params: { limit } }),
};
