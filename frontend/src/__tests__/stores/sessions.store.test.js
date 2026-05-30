import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionsStore } from '../../stores/sessions.store';

vi.mock('../../services/sessions.service', () => ({
  sessionsService: {
    listTypes: vi
      .fn()
      .mockResolvedValue({ data: { data: [{ code: 'psychology', name: 'Psicologia' }] } }),
    listMine: vi.fn().mockResolvedValue({ data: { data: [{ _id: 's1', status: 'scheduled' }] } }),
    createSession: vi
      .fn()
      .mockResolvedValue({
        data: { data: { _id: 's2', confirmationCode: 'MC-123456', status: 'scheduled' } },
      }),
    cancel: vi.fn().mockResolvedValue({}),
  },
}));

describe('sessions store', () => {
  beforeEach(() => {
    useSessionsStore.setState({ types: [], mySessions: [], loading: false, error: null });
  });

  it('fetchTypes carga los tipos', async () => {
    await useSessionsStore.getState().fetchTypes();
    expect(useSessionsStore.getState().types).toHaveLength(1);
  });

  it('fetchMySessions carga sesiones', async () => {
    await useSessionsStore.getState().fetchMySessions();
    expect(useSessionsStore.getState().mySessions).toHaveLength(1);
  });

  it('createSession agrega al array', async () => {
    const session = await useSessionsStore
      .getState()
      .createSession({
        professionalId: 'p1',
        sessionType: 'psychology',
        scheduledAt: '2026-06-01T10:00:00Z',
      });
    expect(session.confirmationCode).toBe('MC-123456');
    expect(useSessionsStore.getState().mySessions).toHaveLength(1);
  });

  it('cancelSession cambia status', async () => {
    useSessionsStore.setState({ mySessions: [{ _id: 's1', status: 'scheduled' }] });
    await useSessionsStore.getState().cancelSession('s1');
    expect(useSessionsStore.getState().mySessions[0].status).toBe('canceled');
  });
});
