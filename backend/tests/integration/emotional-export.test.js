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

describe('emotional export: insertar entradas → CSV bien formado', () => {
  it('genera CSV con header correcto y datos', async () => {
    const reg = await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });

    const token = reg.body.data.accessToken;
    const userId = reg.body.data.user._id;

    await EmotionalEntry.create([
      { userId, date: new Date('2026-05-01T00:00:00Z'), mood: 3, note: 'dia uno' },
      { userId, date: new Date('2026-05-02T00:00:00Z'), mood: 4, note: 'dia, con coma' },
    ]);

    const res = await api
      .get('/api/emotional-entries/export-csv')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /text\/csv/);

    const lines = res.text.split('\n');
    expect(lines[0]).toBe('date,mood_level,reflection');
    expect(lines).toHaveLength(3);
    expect(lines[2]).toContain('"dia, con coma"');
  });
});
