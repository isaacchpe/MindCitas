import { User } from '../auth/auth.model.js';
import { Session } from '../sessions/sessions.model.js';
import { EmotionalEntry } from '../emotional-entries/emotional-entry.model.js';
import { Habit, HabitLog } from '../habits/habits.model.js';

export class AdminRepository {
  async findUsers({ page, pageSize, search }) {
    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ email: regex }, { name: regex }];
    }

    const [items, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      User.countDocuments(filter),
    ]);

    return { items, total };
  }

  async updateUserById(id, patch) {
    return User.findByIdAndUpdate(id, patch, { new: true }).select('-password');
  }

  async countUsers(filter = {}) {
    return User.countDocuments(filter);
  }

  async countSessions(filter = {}) {
    return Session.countDocuments(filter);
  }

  async countEntries(filter = {}) {
    return EmotionalEntry.countDocuments(filter);
  }

  async countHabits(filter = {}) {
    return Habit.countDocuments(filter);
  }

  async countCompletedToday(todayDow) {
    return HabitLog.countDocuments({
      'entries.dayOfWeek': todayDow,
    });
  }
}
