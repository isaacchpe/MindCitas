import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn().mockResolvedValue({ data: { data: {} } });
const mockGet = vi.fn().mockResolvedValue({ data: { data: {} }, headers: {} });

vi.mock('../../services/api', () => ({
  default: { post: (...args) => mockPost(...args), get: (...args) => mockGet(...args) },
}));

let emotionalService;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../services/emotional.service');
  emotionalService = mod.emotionalService;
});

describe('emotionalService', () => {
  it('createEntry llama POST /emotional-entries', async () => {
    await emotionalService.createEntry({ mood: 4 });
    expect(mockPost).toHaveBeenCalledWith('/emotional-entries', { mood: 4 });
  });

  it('getByDate llama GET con la fecha', async () => {
    await emotionalService.getByDate('2026-05-27');
    expect(mockGet).toHaveBeenCalledWith('/emotional-entries/by-date/2026-05-27');
  });

  it('getWeeklyTrend llama GET /emotional-entries/weekly-trend', async () => {
    await emotionalService.getWeeklyTrend();
    expect(mockGet).toHaveBeenCalledWith('/emotional-entries/weekly-trend');
  });

  it('getMonthlyTrend llama GET /emotional-entries/monthly-trend', async () => {
    await emotionalService.getMonthlyTrend();
    expect(mockGet).toHaveBeenCalledWith('/emotional-entries/monthly-trend');
  });

  it('checkAlert llama GET /emotional-entries/check-alert', async () => {
    await emotionalService.checkAlert();
    expect(mockGet).toHaveBeenCalledWith('/emotional-entries/check-alert');
  });

  it('getRecentEntries llama GET con params', async () => {
    await emotionalService.getRecentEntries(5);
    expect(mockGet).toHaveBeenCalledWith('/emotional-entries/recent', { params: { limit: 5 } });
  });
});
