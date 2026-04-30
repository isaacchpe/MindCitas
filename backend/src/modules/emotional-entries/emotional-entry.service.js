import { EmotionalEntry } from './emotional-entry.model.js';

export class EmotionalEntryService {
  constructor(entryRepository) {
    this.entryRepository = entryRepository;
  }

  async createOrUpdateToday({ userId, mood, note }) {
    const date = EmotionalEntry.normalizeDate(new Date());
    return this.entryRepository.upsertByDate({ userId, date, mood, note });
  }

  async getByDate({ userId, date }) {
    const normalized = EmotionalEntry.normalizeDate(date);
    return this.entryRepository.findByUserAndDate({ userId, date: normalized });
  }

  async getWeeklyTrend({ userId }) {
    const today = EmotionalEntry.normalizeDate(new Date());
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - 6);

    const entries = await this.entryRepository.findRange({ userId, from, to: today });
    const entryMap = new Map(entries.map((e) => [e.date.toISOString(), e]));

    const trend = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(from);
      d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString();
      const entry = entryMap.get(key);
      trend.push({
        date: d,
        mood: entry ? entry.mood : null,
        note: entry ? entry.note : null,
      });
    }

    return trend;
  }

  async getRecentEntries({ userId, limit = 7 }) {
    return this.entryRepository.findRecent({ userId, limit });
  }
}
