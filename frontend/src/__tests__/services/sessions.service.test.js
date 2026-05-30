import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn().mockResolvedValue({ data: { data: {} } });
const mockGet = vi.fn().mockResolvedValue({ data: { data: [] } });
const mockDelete = vi.fn().mockResolvedValue({});
const mockPut = vi.fn().mockResolvedValue({ data: { data: {} } });

vi.mock('../../services/api', () => ({
  default: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
    delete: (...args) => mockDelete(...args),
    put: (...args) => mockPut(...args),
  },
}));

let sessionsService;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../services/sessions.service');
  sessionsService = mod.sessionsService;
});

describe('sessionsService', () => {
  it('listTypes llama GET /sessions/types', async () => {
    await sessionsService.listTypes();
    expect(mockGet).toHaveBeenCalledWith('/sessions/types');
  });

  it('getAvailableSlots llama GET con params', async () => {
    await sessionsService.getAvailableSlots('2026-06-01', 'psychology');
    expect(mockGet).toHaveBeenCalledWith('/sessions/available-slots', {
      params: { date: '2026-06-01', sessionType: 'psychology' },
    });
  });

  it('createSession llama POST /sessions', async () => {
    await sessionsService.createSession({
      professionalId: 'p1',
      sessionType: 'psychology',
      scheduledAt: '2026-06-01T10:00:00Z',
    });
    expect(mockPost).toHaveBeenCalledWith('/sessions', expect.any(Object));
  });

  it('cancel llama DELETE /sessions/:id', async () => {
    await sessionsService.cancel('s1');
    expect(mockDelete).toHaveBeenCalledWith('/sessions/s1');
  });

  it('reschedule llama PUT /sessions/:id', async () => {
    await sessionsService.reschedule('s1', '2026-06-02T10:00:00Z');
    expect(mockPut).toHaveBeenCalledWith('/sessions/s1', { scheduledAt: '2026-06-02T10:00:00Z' });
  });
});
