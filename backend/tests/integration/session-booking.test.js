import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { Professional } from '../../src/modules/sessions/sessions.model.js';

const api = supertest(app);

let token1;
let token2;

function getTomorrow() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 3);
  d.setUTCHours(0, 0, 0, 0);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

beforeAll(async () => {
  await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB();
});
beforeEach(async () => {
  await clearDB();

  const res1 = await api
    .post('/api/auth/register')
    .send({ name: 'User1', email: 'user1@test.com', password: 'Password123' });
  token1 = res1.body.data.accessToken;

  const res2 = await api
    .post('/api/auth/register')
    .send({ name: 'User2', email: 'user2@test.com', password: 'Password123' });
  token2 = res2.body.data.accessToken;

  const weekday = getTomorrow();
  await Professional.create({
    fullName: 'Dra. Test',
    specialty: 'psychology',
    email: 'test@prof.com',
    workingHours: [{ dayOfWeek: weekday.getUTCDay(), startHour: 8, endHour: 17 }],
    isActive: true,
  });
});

describe('Prueba 3: agendamiento y cancelacion de sesion', () => {
  it('flujo completo: slots → agendar → listar → cancelar → slot libre → conflicto 409', async () => {
    const dateStr = getTomorrow().toISOString().split('T')[0];

    const slotsRes = await api
      .get(`/api/sessions/available-slots?date=${dateStr}&sessionType=psychology`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    expect(slotsRes.body.data.length).toBeGreaterThan(0);
    const prof = slotsRes.body.data[0];
    const slotToBook = prof.slots[0];

    const createRes = await api
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        professionalId: prof.professionalId,
        sessionType: 'psychology',
        scheduledAt: slotToBook,
      })
      .expect(201);

    expect(createRes.body.data.confirmationCode).toMatch(/^MC-[A-F0-9]{6}$/);
    const sessionId = createRes.body.data._id;

    const mineRes = await api
      .get('/api/sessions/mine')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    expect(mineRes.body.data.some((s) => s._id === sessionId)).toBe(true);

    await api
      .delete(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    const slotsAfter = await api
      .get(`/api/sessions/available-slots?date=${dateStr}&sessionType=psychology`)
      .set('Authorization', `Bearer ${token1}`)
      .expect(200);

    const profAfter = slotsAfter.body.data[0];
    expect(profAfter.slots).toContain(slotToBook);

    await api
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        professionalId: prof.professionalId,
        sessionType: 'psychology',
        scheduledAt: slotToBook,
      })
      .expect(201);

    await api
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        professionalId: prof.professionalId,
        sessionType: 'psychology',
        scheduledAt: slotToBook,
      })
      .expect(409);
  });
});
