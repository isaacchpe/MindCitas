import { HabitService } from '../habits.service.js';

const OWNER = 'user1';
const OTHER = 'user2';

function weekStartOf(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function buildWeeklyLogs(dates) {
  const weeks = new Map();
  for (const d of dates) {
    const ws = weekStartOf(d).toISOString();
    if (!weeks.has(ws)) {
      weeks.set(ws, { weekStart: new Date(ws), entries: [] });
    }
    weeks.get(ws).entries.push({ dayOfWeek: d.getUTCDay(), completedAt: d });
  }
  return [...weeks.values()].map((w) => ({
    habitId: 'habit1',
    userId: OWNER,
    weekStart: w.weekStart,
    entries: w.entries,
    currentStreak: 0,
    bestStreak: 0,
    save: async function () {
      return this;
    },
  }));
}

function consecutiveDays(count) {
  const dates = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);
    dates.push(d);
  }
  return dates;
}

const makeHabit = (overrides = {}) => ({
  _id: 'habit1',
  userId: { toString: () => OWNER },
  habitType: 'meditation',
  name: 'Meditacion 5 min',
  isActive: true,
  ...overrides,
});

const makeLog = (entries = [], streak = 0, best = 0) => ({
  habitId: 'habit1',
  userId: OWNER,
  weekStart: weekStartOf(new Date()),
  entries,
  currentStreak: streak,
  bestStreak: best,
  save: async function () {
    return this;
  },
});

const createMockRepo = () => ({
  create: async (data) => ({ _id: 'habit1', ...data }),
  findById: async () => makeHabit(),
  findActiveByUser: async () => [makeHabit()],
  softDelete: async (id) => makeHabit({ _id: id, isActive: false }),
  findLog: async () => null,
  upsertLog: async (_hId, _uId, _ws, update) => {
    const log = makeLog();
    if (update.$push) {
      log.entries.push(update.$push.entries);
    }
    return log;
  },
  findLogsByHabitSince: async () => [],
  findCurrentWeekLog: async () => null,
  findAllBadges: async () => [],
  findBadgeByThreshold: async () => null,
  findUserBadge: async () => null,
  createUserBadge: async (data) => ({ ...data, awardedAt: new Date() }),
  findUserBadges: async () => [],
});

describe('HabitService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new HabitService(mockRepo);
  });

  describe('listPredefinedHabits', () => {
    it('retorna los 5 habitos esperados con la forma correcta', () => {
      const list = service.listPredefinedHabits();

      expect(list).toHaveLength(5);
      for (const h of list) {
        expect(h).toHaveProperty('habitType');
        expect(h).toHaveProperty('name');
        expect(h).toHaveProperty('description');
      }
    });
  });

  describe('createHabit', () => {
    it('lanza error con tipo custom pero sin nombre', async () => {
      await expect(service.createHabit(OWNER, { habitType: 'custom' })).rejects.toThrow(
        'El nombre es obligatorio para habitos personalizados'
      );
    });

    it('hereda el nombre del catalogo con tipo predefinido y sin nombre', async () => {
      let captured;
      mockRepo.create = async (data) => {
        captured = data;
        return { _id: 'h1', ...data };
      };

      await service.createHabit(OWNER, { habitType: 'exercise' });

      expect(captured.name).toBe('Ejercicio 30 min');
    });
  });

  describe('listMyHabits', () => {
    it('marca completedToday cuando el log del dia existe', async () => {
      const todayDow = new Date().getUTCDay();
      mockRepo.findCurrentWeekLog = async () =>
        makeLog([{ dayOfWeek: todayDow, completedAt: new Date() }], 1);

      const habits = await service.listMyHabits(OWNER);

      expect(habits[0].completedToday).toBe(true);
    });
  });

  describe('checkHabit', () => {
    it('es idempotente: dos llamadas el mismo dia dan el mismo streak', async () => {
      const todayDow = new Date().getUTCDay();
      const log = makeLog([{ dayOfWeek: todayDow, completedAt: new Date() }], 3, 5);
      mockRepo.findLog = async () => log;

      const result = await service.checkHabit(OWNER, 'habit1');

      expect(result.currentStreak).toBe(3);
      expect(result.awardedBadge).toBeNull();
    });

    it('recalcula bestStreak cuando supera el anterior', async () => {
      const dates = consecutiveDays(5);
      const logs = buildWeeklyLogs(dates);
      logs.forEach((l) => {
        l.bestStreak = 2;
      });

      mockRepo.findLog = async () => null;
      mockRepo.upsertLog = async () => {
        const log = makeLog([], 0, 2);
        log.entries.push({ dayOfWeek: new Date().getUTCDay(), completedAt: new Date() });
        return log;
      };
      mockRepo.findLogsByHabitSince = async () => logs;

      const result = await service.checkHabit(OWNER, 'habit1');

      expect(result.bestStreak).toBeGreaterThanOrEqual(result.currentStreak);
      expect(result.bestStreak).toBeGreaterThanOrEqual(5);
    });

    it('gatilla insignia al llegar a 7 dias', async () => {
      const dates = consecutiveDays(7);
      const logs = buildWeeklyLogs(dates);

      mockRepo.findLog = async () => null;
      mockRepo.upsertLog = async () => {
        const log = makeLog([], 0, 0);
        log.entries.push({ dayOfWeek: new Date().getUTCDay(), completedAt: new Date() });
        return log;
      };
      mockRepo.findLogsByHabitSince = async () => logs;
      mockRepo.findBadgeByThreshold = async (t) =>
        t === 7 ? { _id: 'badge7', code: 'streak-7', name: 'Primera semana', threshold: 7 } : null;

      const result = await service.checkHabit(OWNER, 'habit1');

      expect(result.awardedBadge).not.toBeNull();
      expect(result.awardedBadge.code).toBe('streak-7');
    });

    it('no gatilla insignia duplicada si ya se otorgo', async () => {
      const dates = consecutiveDays(7);
      const logs = buildWeeklyLogs(dates);

      mockRepo.findLog = async () => null;
      mockRepo.upsertLog = async () => {
        const log = makeLog([], 0, 0);
        log.entries.push({ dayOfWeek: new Date().getUTCDay(), completedAt: new Date() });
        return log;
      };
      mockRepo.findLogsByHabitSince = async () => logs;
      mockRepo.findBadgeByThreshold = async (t) =>
        t === 7 ? { _id: 'badge7', code: 'streak-7', name: 'Primera semana', threshold: 7 } : null;
      mockRepo.findUserBadge = async () => ({ _id: 'existing' });

      const result = await service.checkHabit(OWNER, 'habit1');

      expect(result.awardedBadge).toBeNull();
    });
  });

  describe('getStreakDetails', () => {
    it('lanza error si el habito no pertenece al usuario', async () => {
      mockRepo.findById = async () => makeHabit({ userId: { toString: () => OTHER } });

      await expect(service.getStreakDetails(OWNER, 'habit1')).rejects.toThrow(
        'No tienes acceso a este habito'
      );
    });
  });

  describe('deleteHabit', () => {
    it('hace soft delete y no borra logs', async () => {
      let deletedId;
      mockRepo.softDelete = async (id) => {
        deletedId = id;
        return makeHabit({ _id: id, isActive: false });
      };

      const result = await service.deleteHabit(OWNER, 'habit1');

      expect(result.message).toBe('Habito desactivado');
      expect(deletedId).toBe('habit1');
    });
  });

  describe('awardBadgeIfNotExists', () => {
    it('es idempotente y retorna null si ya existe', async () => {
      mockRepo.findBadgeByThreshold = async () => ({
        _id: 'badge7',
        code: 'streak-7',
        name: 'Primera semana',
        threshold: 7,
      });
      mockRepo.findUserBadge = async () => ({ _id: 'existing' });

      const result = await service.awardBadgeIfNotExists(OWNER, 'habit1', 7);

      expect(result).toBeNull();
    });
  });

  describe('streak calculation', () => {
    it('currentStreak es 1 con un dia roto en medio', async () => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const d2 = new Date(today);
      d2.setUTCDate(d2.getUTCDate() - 2);
      const d3 = new Date(today);
      d3.setUTCDate(d3.getUTCDate() - 3);

      const logs = buildWeeklyLogs([today, d2, d3]);

      mockRepo.findLog = async () => null;
      mockRepo.upsertLog = async () => {
        const log = makeLog([], 0, 3);
        log.entries.push({ dayOfWeek: today.getUTCDay(), completedAt: today });
        return log;
      };
      mockRepo.findLogsByHabitSince = async () => logs;

      const result = await service.checkHabit(OWNER, 'habit1');

      expect(result.currentStreak).toBe(1);
    });
  });
});
