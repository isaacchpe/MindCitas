import { EmotionalEntry } from './emotional-entry.model.js';

export class EmotionalEntryService {
  constructor(entryRepository) {
    this.entryRepository = entryRepository;
  }

  /**
   * Crea o actualiza el registro emocional del dia actual.
   * @param {{userId: string, mood: number, note?: string}} data
   * @returns {Promise<object>} entrada creada o actualizada
   */
  async createOrUpdateToday({ userId, mood, note }) {
    const date = EmotionalEntry.normalizeDate(new Date());
    return this.entryRepository.upsertByDate({ userId, date, mood, note });
  }

  /**
   * Obtiene el registro emocional de una fecha especifica.
   * @param {{userId: string, date: string|Date}} data
   * @returns {Promise<object|null>}
   */
  async getByDate({ userId, date }) {
    const normalized = EmotionalEntry.normalizeDate(date);
    return this.entryRepository.findByUserAndDate({ userId, date: normalized });
  }

  /**
   * Tendencia semanal: 7 puntos con mood null para dias sin registro.
   * @param {{userId: string}} data
   * @returns {Promise<Array<{date: Date, mood: number|null, note: string|null}>>}
   */
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

  /**
   * Ultimos N registros emocionales del usuario.
   * @param {{userId: string, limit?: number}} data
   * @returns {Promise<Array<object>>}
   */
  async getRecentEntries({ userId, limit = 7 }) {
    return this.entryRepository.findRecent({ userId, limit });
  }

  /**
   * Tendencia mensual: 30 puntos con moodLevel null para dias sin registro.
   * @param {{userId: string}} data
   * @returns {Promise<Array<{date: string, moodLevel: number|null}>>}
   */
  async getMonthlyTrend({ userId }) {
    const today = EmotionalEntry.normalizeDate(new Date());
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - 29);

    const entries = await this.entryRepository.findRange({ userId, from, to: today });
    const entryMap = new Map(entries.map((e) => [e.date.toISOString(), e]));

    const trend = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(from);
      d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString();
      const entry = entryMap.get(key);
      trend.push({
        date: d.toISOString().split('T')[0],
        moodLevel: entry ? entry.mood : null,
      });
    }

    return trend;
  }

  /**
   * Genera CSV con todos los registros emocionales del usuario.
   * @param {{userId: string}} data
   * @returns {Promise<string>} contenido CSV
   */
  async exportCsv({ userId }) {
    const entries = await this.entryRepository.findAllByUser(userId);

    const rows = ['date,mood_level,reflection'];
    for (const entry of entries) {
      const date = entry.date.toISOString().split('T')[0];
      const mood = entry.mood;
      const note = entry.note || '';
      rows.push(`${date},${mood},${escapeCsvField(note)}`);
    }

    return rows.join('\n');
  }

  /**
   * Verifica patron negativo: 3 dias consecutivos con mood <= 2.
   * @param {{userId: string}} data
   * @returns {Promise<{alert: boolean, suggestion?: string}>}
   */
  async checkAlert({ userId }) {
    const entries = await this.entryRepository.findRecent({ userId, limit: 3 });

    if (entries.length < 3) {
      return { alert: false };
    }

    const allLow = entries.every((e) => e.mood <= 2);
    if (!allLow) {
      return { alert: false };
    }

    const sorted = [...entries].sort((a, b) => b.date - a.date);
    for (let i = 0; i < sorted.length - 1; i++) {
      const diff = sorted[i].date - sorted[i + 1].date;
      const oneDay = 24 * 60 * 60 * 1000;
      if (Math.abs(diff - oneDay) > 1000) {
        return { alert: false };
      }
    }

    return {
      alert: true,
      suggestion:
        'Hemos notado que llevas tres dias sintiendote bajo. Considera agendar una sesion de apoyo con un profesional de bienestar.',
    };
  }
}

function escapeCsvField(value) {
  if (!value) {
    return '';
  }
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}
