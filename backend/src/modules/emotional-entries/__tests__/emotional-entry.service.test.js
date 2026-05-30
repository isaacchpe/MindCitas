import { EmotionalEntryService } from '../emotional-entry.service.js';

const createMockRepo = () => ({
  upsertByDate: async (data) => data,
  findByUserAndDate: async () => null,
  findRange: async () => [],
  findRecent: async ({ limit }) =>
    Array.from({ length: limit }, () => ({ date: new Date(), mood: 3, note: null })),
  findAllByUser: async () => [],
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

  describe('getMonthlyTrend', () => {
    it('retorna 30 puntos con null para dias sin registro', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      mockRepo.findRange = async () => [{ date: new Date(today), mood: 3, note: null }];

      const trend = await service.getMonthlyTrend({ userId: 'u1' });

      expect(trend).toHaveLength(30);
      const withData = trend.filter((t) => t.moodLevel !== null);
      expect(withData).toHaveLength(1);
      expect(withData[0].moodLevel).toBe(3);
      expect(trend.filter((t) => t.moodLevel === null)).toHaveLength(29);
    });
  });

  describe('exportCsv', () => {
    it('genera header correcto y respeta el orden cronologico', async () => {
      const d1 = new Date('2026-05-01T00:00:00Z');
      const d2 = new Date('2026-05-02T00:00:00Z');
      mockRepo.findAllByUser = async () => [
        { date: d1, mood: 3, note: 'dia uno' },
        { date: d2, mood: 4, note: 'dia dos' },
      ];

      const csv = await service.exportCsv({ userId: 'u1' });
      const lines = csv.split('\n');

      expect(lines[0]).toBe('date,mood_level,reflection');
      expect(lines[1]).toContain('2026-05-01');
      expect(lines[2]).toContain('2026-05-02');
    });

    it('escapa comillas dobles en reflexiones', async () => {
      mockRepo.findAllByUser = async () => [
        { date: new Date('2026-05-01T00:00:00Z'), mood: 2, note: 'dijo "hola"' },
      ];

      const csv = await service.exportCsv({ userId: 'u1' });

      expect(csv).toContain('""hola""');
    });

    it('envuelve en comillas dobles las reflexiones con comas', async () => {
      mockRepo.findAllByUser = async () => [
        { date: new Date('2026-05-01T00:00:00Z'), mood: 4, note: 'bien, tranquilo' },
      ];

      const csv = await service.exportCsv({ userId: 'u1' });
      const dataLine = csv.split('\n')[1];

      expect(dataLine).toContain('"bien, tranquilo"');
    });
  });

  describe('checkAlert', () => {
    it('retorna alert:true con 3 dias consecutivos en niveles 1-2', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const d1 = new Date(today);
      const d2 = new Date(today);
      d2.setUTCDate(d2.getUTCDate() - 1);
      const d3 = new Date(today);
      d3.setUTCDate(d3.getUTCDate() - 2);

      mockRepo.findRecent = async () => [
        { date: d1, mood: 1, note: null },
        { date: d2, mood: 2, note: null },
        { date: d3, mood: 1, note: null },
      ];

      const result = await service.checkAlert({ userId: 'u1' });

      expect(result.alert).toBe(true);
      expect(result.suggestion).toBeDefined();
    });

    it('retorna alert:false si hay un hueco en los dias', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const d1 = new Date(today);
      const d2 = new Date(today);
      d2.setUTCDate(d2.getUTCDate() - 1);
      const d3 = new Date(today);
      d3.setUTCDate(d3.getUTCDate() - 3);

      mockRepo.findRecent = async () => [
        { date: d1, mood: 1, note: null },
        { date: d2, mood: 2, note: null },
        { date: d3, mood: 1, note: null },
      ];

      const result = await service.checkAlert({ userId: 'u1' });

      expect(result.alert).toBe(false);
    });
  });
});
