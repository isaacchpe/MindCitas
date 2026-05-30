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

describe('Prueba 1: flujo completo de autenticacion', () => {
  const userData = {
    name: 'Juan Garcia',
    email: 'juan@test.com',
    password: 'Password123',
  };

  it('register → login → get me (sin passwordHash)', async () => {
    const registerRes = await api.post('/api/auth/register').send(userData).expect(201);

    expect(registerRes.body.data).toHaveProperty('accessToken');
    expect(registerRes.body.data).toHaveProperty('user');

    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    const { accessToken } = loginRes.body.data;
    expect(accessToken).toBeDefined();

    const meRes = await api
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(meRes.body.data).toHaveProperty('fullName', 'Juan Garcia');
    expect(meRes.body.data).toHaveProperty('email', 'juan@test.com');
    expect(meRes.body.data).not.toHaveProperty('password');
    expect(meRes.body.data).not.toHaveProperty('passwordHash');
    expect(JSON.stringify(meRes.body)).not.toContain('password');
  });
});
