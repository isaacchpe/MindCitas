import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { EmotionalEntry } from '../../src/modules/emotional-entries/emotional-entry.model.js';

const api = supertest(app);

beforeAll(async () => {
  await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB();
});
beforeEach(async () => {
  await clearDB();
});

describe('emotional alert: 3 dias bajos consecutivos → alert true', () => {
  it('detecta patron negativo', async () => {
    const reg = await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });

    const token = reg.body.data.accessToken;
    const userId = reg.body.data.user._id;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);
      await EmotionalEntry.create({ userId, date, mood: 1 });
    }

    const res = await api
      .get('/api/emotional-entries/check-alert')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.alert).toBe(true);
    expect(res.body.data.suggestion).toBeDefined();
  });
});
