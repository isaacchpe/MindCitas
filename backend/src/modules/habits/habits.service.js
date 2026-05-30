import { AppError } from '../../utils/AppError.js';

const PREDEFINED = [
  {
    habitType: 'meditation',
    name: 'Meditacion 5 min',
    description: '5 minutos de meditacion guiada',
  },
  {
    habitType: 'exercise',
    name: 'Ejercicio 30 min',
    description: '30 minutos de actividad fisica',
  },
  { habitType: 'reading', name: 'Lectura 15 min', description: '15 minutos de lectura' },
  {
    habitType: 'hydration',
    name: 'Hidratacion 8 vasos',
    description: 'Tomar 8 vasos de agua al dia',
  },
  { habitType: 'sleep', name: 'Dormir 8 horas', description: 'Dormir al menos 8 horas' },
];

function getWeekStart(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function getTodayUTC() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function getDayOfWeek() {
  return new Date().getUTCDay();
}

function collectCompletedDates(logs) {
  const dates = [];
  for (const log of logs) {
    for (const entry of log.entries) {
      const d = new Date(log.weekStart);
      const offset = entry.dayOfWeek === 0 ? 6 : entry.dayOfWeek - 1;
      d.setUTCDate(d.getUTCDate() + offset);
      dates.push(d.toISOString().split('T')[0]);
    }
  }
  return [...new Set(dates)].sort();
}

function calculateCurrentStreak(completedDates) {
  if (!completedDates.length) {
    return 0;
  }

  const today = getTodayUTC().toISOString().split('T')[0];
  const set = new Set(completedDates);

  if (!set.has(today)) {
    return 0;
  }

  let streak = 0;
  const d = getTodayUTC();
  while (set.has(d.toISOString().split('T')[0])) {
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

export class HabitService {
  constructor(habitRepository) {
    this.repo = habitRepository;
  }

  /**
   * @returns {Array<{habitType: string, name: string, description: string}>}
   */
  listPredefinedHabits() {
    return PREDEFINED.map((h) => ({ ...h }));
  }

  /**
   * @param {string} userId
   * @param {{habitType: string, name?: string, description?: string}} data
   */
  async createHabit(userId, { habitType, name, description }) {
    let finalName = name;
    if (habitType === 'custom' && !finalName) {
      throw new AppError('El nombre es obligatorio para habitos personalizados', 400);
    }
    if (habitType !== 'custom' && !finalName) {
      const predefined = PREDEFINED.find((p) => p.habitType === habitType);
      finalName = predefined ? predefined.name : habitType;
    }

    return this.repo.create({
      userId,
      habitType,
      name: finalName,
      description: description || undefined,
    });
  }

  /**
   * @param {string} userId
   */
  async listMyHabits(userId) {
    const habits = await this.repo.findActiveByUser(userId);
    const weekStart = getWeekStart(new Date());
    const todayDow = getDayOfWeek();

    const result = [];
    for (const habit of habits) {
      const log = await this.repo.findCurrentWeekLog(habit._id, weekStart);
      const completedToday = log ? log.entries.some((e) => e.dayOfWeek === todayDow) : false;

      result.push({
        _id: habit._id,
        name: habit.name,
        habitType: habit.habitType,
        currentStreak: log ? log.currentStreak : 0,
        bestStreak: log ? log.bestStreak : 0,
        completedToday,
      });
    }
    return result;
  }

  /**
   * @param {string} userId
   * @param {string} habitId
   */
  async getStreakDetails(userId, habitId) {
    const habit = await this.repo.findById(habitId);
    if (!habit) {
      throw new AppError('Habito no encontrado', 404);
    }
    if (habit.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a este habito', 403);
    }

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 35);
    const sinceWeek = getWeekStart(since);

    const logs = await this.repo.findLogsByHabitSince(habitId, sinceWeek);
    const completedDates = collectCompletedDates(logs);
    const currentStreak = calculateCurrentStreak(completedDates);

    let bestStreak = 0;
    for (const log of logs) {
      if (log.bestStreak > bestStreak) {
        bestStreak = log.bestStreak;
      }
    }
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    const thirtyDaysAgo = getTodayUTC();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    const recentDates = completedDates.filter(
      (d) => d >= thirtyDaysAgo.toISOString().split('T')[0]
    );

    return { currentStreak, bestStreak, completedDates: recentDates };
  }

  /**
   * @param {string} userId
   * @param {string} habitId
   */
  async checkHabit(userId, habitId) {
    const habit = await this.repo.findById(habitId);
    if (!habit) {
      throw new AppError('Habito no encontrado', 404);
    }
    if (habit.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a este habito', 403);
    }

    const weekStart = getWeekStart(new Date());
    const todayDow = getDayOfWeek();

    let log = await this.repo.findLog(habitId, weekStart);

    if (log && log.entries.some((e) => e.dayOfWeek === todayDow)) {
      return { currentStreak: log.currentStreak, bestStreak: log.bestStreak, awardedBadge: null };
    }

    const entry = { dayOfWeek: todayDow, completedAt: new Date() };

    if (!log) {
      log = await this.repo.upsertLog(habitId, userId, weekStart, {
        $push: { entries: entry },
      });
    } else {
      log.entries.push(entry);
      await log.save();
    }

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 35);
    const allLogs = await this.repo.findLogsByHabitSince(habitId, getWeekStart(since));
    const allDates = collectCompletedDates(allLogs);
    const currentStreak = calculateCurrentStreak(allDates);

    let bestStreak = log.bestStreak;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    log.currentStreak = currentStreak;
    log.bestStreak = bestStreak;
    await log.save();

    let awardedBadge = null;
    for (const threshold of [7, 14, 30]) {
      if (currentStreak >= threshold) {
        const badge = await this.awardBadgeIfNotExists(userId, habitId, threshold);
        if (badge) {
          awardedBadge = badge;
        }
      }
    }

    return { currentStreak, bestStreak, awardedBadge };
  }

  /**
   * @param {string} userId
   * @param {string} habitId
   * @param {number} threshold
   */
  async awardBadgeIfNotExists(userId, habitId, threshold) {
    const badge = await this.repo.findBadgeByThreshold(threshold);
    if (!badge) {
      return null;
    }

    const existing = await this.repo.findUserBadge(userId, badge._id, habitId);
    if (existing) {
      return null;
    }

    const userBadge = await this.repo.createUserBadge({
      userId,
      badgeId: badge._id,
      habitId,
    });
    return {
      code: badge.code,
      name: badge.name,
      threshold: badge.threshold,
      awardedAt: userBadge.awardedAt,
    };
  }

  /**
   * @param {string} userId
   * @param {string} habitId
   */
  async deleteHabit(userId, habitId) {
    const habit = await this.repo.findById(habitId);
    if (!habit) {
      throw new AppError('Habito no encontrado', 404);
    }
    if (habit.userId.toString() !== userId) {
      throw new AppError('No tienes acceso a este habito', 403);
    }

    await this.repo.softDelete(habitId);
    return { message: 'Habito desactivado' };
  }

  async listBadges() {
    return this.repo.findAllBadges();
  }
}
