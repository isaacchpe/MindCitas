import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';

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

describe('auth refresh: login → refresh → nuevo token funciona', () => {
  it('refresh genera un access token valido', async () => {
    await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });

    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Password123' })
      .expect(200);

    const { refreshToken } = loginRes.body.data;

    const refreshRes = await api.post('/api/auth/refresh').send({ refreshToken }).expect(200);

    const newToken = refreshRes.body.data.accessToken;

    await api.get('/api/users/me').set('Authorization', `Bearer ${newToken}`).expect(200);
  });
});
