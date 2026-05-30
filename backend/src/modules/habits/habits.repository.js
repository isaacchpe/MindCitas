import { Habit, HabitLog, Badge, UserBadge } from './habits.model.js';

export class HabitRepository {
  async create(data) {
    return Habit.create(data);
  }

  async findById(id) {
    return Habit.findById(id);
  }

  async findActiveByUser(userId) {
    return Habit.find({ userId, isActive: true }).sort({ createdAt: -1 });
  }

  async softDelete(id) {
    return Habit.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async findLog(habitId, weekStart) {
    return HabitLog.findOne({ habitId, weekStart });
  }

  async upsertLog(habitId, userId, weekStart, update) {
    return HabitLog.findOneAndUpdate(
      { habitId, weekStart },
      { $setOnInsert: { userId }, ...update },
      { upsert: true, new: true, runValidators: true }
    );
  }

  async findLogsByHabitSince(habitId, sinceDate) {
    return HabitLog.find({ habitId, weekStart: { $gte: sinceDate } }).sort({ weekStart: 1 });
  }

  async findCurrentWeekLog(habitId, weekStart) {
    return HabitLog.findOne({ habitId, weekStart });
  }

  async findAllBadges() {
    return Badge.find().sort({ threshold: 1 });
  }

  async findBadgeByThreshold(threshold) {
    return Badge.findOne({ threshold });
  }

  async findUserBadge(userId, badgeId, habitId) {
    return UserBadge.findOne({ userId, badgeId, habitId });
  }

  async createUserBadge(data) {
    return UserBadge.create(data);
  }

  async findUserBadges(userId) {
    return UserBadge.find({ userId }).populate('badgeId').sort({ awardedAt: -1 });
  }
}
