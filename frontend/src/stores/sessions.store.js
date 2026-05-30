import { create } from 'zustand';
import { sessionsService } from '../services/sessions.service';

export const useSessionsStore = create((set) => ({
  types: [],
  mySessions: [],
  loading: false,
  error: null,

  fetchTypes: async () => {
    try {
      const { data } = await sessionsService.listTypes();
      set({ types: data.data });
    } catch (_e) {
      /* noop */
    }
  },

  fetchMySessions: async (statusFilter = 'all') => {
    set({ loading: true, error: null });
    try {
      const { data } = await sessionsService.listMine(statusFilter);
      set({ mySessions: data.data, loading: false });
    } catch (_e) {
      set({ error: 'No se pudieron cargar las sesiones', loading: false });
    }
  },

  createSession: async (payload) => {
    const { data } = await sessionsService.createSession(payload);
    set((s) => ({ mySessions: [data.data, ...s.mySessions] }));
    return data.data;
  },

  cancelSession: async (sessionId) => {
    await sessionsService.cancel(sessionId);
    set((s) => ({
      mySessions: s.mySessions.map((sess) =>
        sess._id === sessionId ? { ...sess, status: 'canceled' } : sess
      ),
    }));
  },

  rescheduleSession: async (sessionId, newDate) => {
    const { data } = await sessionsService.reschedule(sessionId, newDate);
    set((s) => ({
      mySessions: s.mySessions.map((sess) => (sess._id === sessionId ? data.data : sess)),
    }));
  },
}));
