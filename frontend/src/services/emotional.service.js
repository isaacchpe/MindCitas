import api from './api';

export const emotionalService = {
  createEntry: (data) => api.post('/emotional-entries', data),
  getByDate: (date) => api.get(`/emotional-entries/by-date/${date}`),
  getWeeklyTrend: () => api.get('/emotional-entries/weekly-trend'),
  getMonthlyTrend: () => api.get('/emotional-entries/monthly-trend'),
  getRecentEntries: (limit = 7) => api.get('/emotional-entries/recent', { params: { limit } }),
  checkAlert: () => api.get('/emotional-entries/check-alert'),
  exportCsv: async () => {
    const response = await api.get('/emotional-entries/export-csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    a.download = match ? match[1] : 'mindcitas-export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
