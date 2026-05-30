import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn().mockResolvedValue({ data: { data: {} } });
const mockGet = vi.fn().mockResolvedValue({ data: { data: [] } });
const mockDelete = vi.fn().mockResolvedValue({});

vi.mock('../../services/api', () => ({
  default: {
    post: (...args) => mockPost(...args),
    get: (...args) => mockGet(...args),
    delete: (...args) => mockDelete(...args),
  },
}));

let habitsService;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../services/habits.service');
  habitsService = mod.habitsService;
});

describe('habitsService', () => {
  it('listPredefined llama GET /habits/predefined', async () => {
    await habitsService.listPredefined();
    expect(mockGet).toHaveBeenCalledWith('/habits/predefined');
  });

  it('createHabit llama POST /habits', async () => {
    await habitsService.createHabit({ habitType: 'custom', name: 'Test' });
    expect(mockPost).toHaveBeenCalledWith('/habits', { habitType: 'custom', name: 'Test' });
  });

  it('listMine llama GET /habits/mine', async () => {
    await habitsService.listMine();
    expect(mockGet).toHaveBeenCalledWith('/habits/mine');
  });

  it('check llama POST /habits/:id/check', async () => {
    await habitsService.check('h1');
    expect(mockPost).toHaveBeenCalledWith('/habits/h1/check');
  });

  it('deleteHabit llama DELETE /habits/:id', async () => {
    await habitsService.deleteHabit('h1');
    expect(mockDelete).toHaveBeenCalledWith('/habits/h1');
  });

  it('listBadges llama GET /badges', async () => {
    await habitsService.listBadges();
    expect(mockGet).toHaveBeenCalledWith('/badges');
  });
});
