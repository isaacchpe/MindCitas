import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { EmotionalEntry } from '../../src/modules/emotional-entries/emotional-entry.model.js';

const api = supertest(app);

let token;
let userId;

beforeAll(async () => {
  await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB();
});
beforeEach(async () => {
  await clearDB();

  const res = await api
    .post('/api/auth/register')
    .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });

  token = res.body.data.accessToken;
  userId = res.body.data.user._id;
});

describe('Prueba 2: registro y consulta de tendencia emocional', () => {
  it('7 entradas producen tendencia semanal correcta y ordenada', async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const moods = [3, 2, 4, 5, 1, 4, 3];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);
      await EmotionalEntry.create({
        userId,
        date,
        mood: moods[6 - i],
      });
    }

    const res = await api
      .get('/api/emotional-entries/weekly-trend')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const trend = res.body.data;
    expect(trend).toHaveLength(7);

    for (let i = 1; i < trend.length; i++) {
      expect(new Date(trend[i].date).getTime()).toBeGreaterThan(
        new Date(trend[i - 1].date).getTime()
      );
    }

    const trendMoods = trend.map((t) => t.mood).filter((m) => m !== null);
    const expectedAvg = moods.reduce((a, b) => a + b, 0) / moods.length;
    const actualAvg = trendMoods.reduce((a, b) => a + b, 0) / trendMoods.length;
    expect(Math.abs(actualAvg - expectedAvg)).toBeLessThan(0.01);
  });
});
