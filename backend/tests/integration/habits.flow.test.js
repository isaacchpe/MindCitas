import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { Badge } from '../../src/modules/habits/habits.model.js';

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

describe('habits flow: crear → checkear → racha → insignia', () => {
  it('crear habito, completar y verificar racha', async () => {
    await Badge.create({
      code: 'streak-7',
      name: 'Primera semana',
      description: '7 dias',
      threshold: 7,
    });

    const reg = await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });
    const token = reg.body.data.accessToken;

    const createRes = await api
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ habitType: 'meditation' })
      .expect(201);

    const habitId = createRes.body.data._id;

    const checkRes = await api
      .post(`/api/habits/${habitId}/check`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(checkRes.body.data.currentStreak).toBeGreaterThanOrEqual(1);

    const checkRes2 = await api
      .post(`/api/habits/${habitId}/check`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(checkRes2.body.data.currentStreak).toBe(checkRes.body.data.currentStreak);

    const mineRes = await api
      .get('/api/habits/mine')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(mineRes.body.data[0].completedToday).toBe(true);
  });
});
