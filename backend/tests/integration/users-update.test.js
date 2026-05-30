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

describe('users update: PUT /me refleja los cambios en GET /me', () => {
  it('actualiza fullName y program correctamente', async () => {
    const reg = await api
      .post('/api/auth/register')
      .send({ name: 'Original', email: 'test@test.com', password: 'Password123' });

    const token = reg.body.data.accessToken;

    await api
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'Nuevo Nombre', program: 'Derecho' })
      .expect(200);

    const meRes = await api
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meRes.body.data.fullName).toBe('Nuevo Nombre');
    expect(meRes.body.data.program).toBe('Derecho');
  });
});
