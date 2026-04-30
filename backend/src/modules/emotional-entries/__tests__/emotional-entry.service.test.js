import { EmotionalEntryService } from '../emotional-entry.service.js';

const createMockRepo = () => ({
  upsertByDate: async (data) => data,
  findByUserAndDate: async () => null,
  findRange: async () => [],
  findRecent: async ({ limit }) =>
    Array.from({ length: limit }, () => ({ date: new Date(), mood: 3, note: null })),
});

describe('EmotionalEntryService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new EmotionalEntryService(mockRepo);
  });

  describe('createOrUpdateToday', () => {
    it('llama al repo con la fecha normalizada', async () => {
      let captured;
      mockRepo.upsertByDate = async (data) => {
        captured = data;
        return data;
      };

      await service.createOrUpdateToday({ userId: 'u1', mood: 4, note: 'test' });

      expect(captured.userId).toBe('u1');
      expect(captured.mood).toBe(4);
      expect(captured.date.getUTCHours()).toBe(0);
      expect(captured.date.getUTCMinutes()).toBe(0);
      expect(captured.date.getUTCSeconds()).toBe(0);
      expect(captured.date.getUTCMilliseconds()).toBe(0);
    });
  });

  describe('getWeeklyTrend', () => {
    it('rellena con null los dias sin datos', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      mockRepo.findRange = async () => [{ date: new Date(today), mood: 4, note: 'hoy' }];

      const trend = await service.getWeeklyTrend({ userId: 'u1' });

      expect(trend).toHaveLength(7);
      const withData = trend.filter((t) => t.mood !== null);
      expect(withData).toHaveLength(1);
      expect(withData[0].mood).toBe(4);
      expect(trend.filter((t) => t.mood === null)).toHaveLength(6);
    });

    it('ordena cronologicamente', async () => {
      mockRepo.findRange = async () => [];

      const trend = await service.getWeeklyTrend({ userId: 'u1' });

      expect(trend).toHaveLength(7);
      for (let i = 1; i < trend.length; i++) {
        expect(trend[i].date.getTime()).toBeGreaterThan(trend[i - 1].date.getTime());
      }
    });
  });

  describe('getRecentEntries', () => {
    it('respeta el limite', async () => {
      let capturedLimit;
      mockRepo.findRecent = async ({ limit }) => {
        capturedLimit = limit;
        return Array.from({ length: limit }, () => ({ mood: 3 }));
      };

      const result = await service.getRecentEntries({ userId: 'u1', limit: 5 });

      expect(capturedLimit).toBe(5);
      expect(result).toHaveLength(5);
    });
  });
});
