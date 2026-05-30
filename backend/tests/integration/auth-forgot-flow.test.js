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

describe('auth forgot flow: forgot → reset → login con nueva contrasena', () => {
  it('el token de recuperacion permite restablecer la contrasena', async () => {
    await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'OldPassword1' });

    const forgotRes = await api
      .post('/api/auth/forgot-password')
      .send({ email: 'test@test.com' })
      .expect(200);

    const { resetToken } = forgotRes.body.data;
    expect(resetToken).toBeDefined();

    await api
      .post('/api/auth/reset-password')
      .send({ token: resetToken, newPassword: 'NewPassword1' })
      .expect(200);

    await api
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'NewPassword1' })
      .expect(200);
  });
});
