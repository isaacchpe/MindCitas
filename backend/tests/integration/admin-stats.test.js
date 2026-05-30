import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { User } from '../../src/modules/auth/auth.model.js';

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

describe('admin stats: conteos correctos con datos seed', () => {
  it('stats refleja usuarios registrados', async () => {
    await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'Admin1234!',
      role: 'admin',
    });

    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin1234!' })
      .expect(200);

    const token = loginRes.body.data.accessToken;

    await api
      .post('/api/auth/register')
      .send({ name: 'Student', email: 'student@test.com', password: 'Password123' });

    const statsRes = await api
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statsRes.body.data.totalUsers).toBeGreaterThanOrEqual(2);
    expect(statsRes.body.data.activeUsers).toBeGreaterThanOrEqual(2);
    expect(statsRes.body.data).toHaveProperty('totalSessions');
    expect(statsRes.body.data).toHaveProperty('totalEmotionalEntries');
    expect(statsRes.body.data).toHaveProperty('totalHabits');
  });
});
