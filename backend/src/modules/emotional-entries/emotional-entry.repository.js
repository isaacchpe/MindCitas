import { EmotionalEntry } from './emotional-entry.model.js';

export class EmotionalEntryRepository {
  async upsertByDate({ userId, date, mood, note }) {
    return EmotionalEntry.findOneAndUpdate(
      { userId, date },
      { mood, note },
      { upsert: true, new: true, runValidators: true }
    );
  }

  async findByUserAndDate({ userId, date }) {
    return EmotionalEntry.findOne({ userId, date });
  }

  async findRange({ userId, from, to }) {
    return EmotionalEntry.find({
      userId,
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 });
  }

  async findRecent({ userId, limit }) {
    return EmotionalEntry.find({ userId }).sort({ date: -1 }).limit(limit);
  }
}
