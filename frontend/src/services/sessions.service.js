import api from './api';

export const sessionsService = {
  listTypes: () => api.get('/sessions/types'),
  getAvailableSlots: (date, sessionType) =>
    api.get('/sessions/available-slots', { params: { date, sessionType } }),
  createSession: (data) => api.post('/sessions', data),
  listMine: (status) => api.get('/sessions/mine', { params: { status } }),
  cancel: (sessionId) => api.delete(`/sessions/${sessionId}`),
  reschedule: (sessionId, scheduledAt) => api.put(`/sessions/${sessionId}`, { scheduledAt }),
};
