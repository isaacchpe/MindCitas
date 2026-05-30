import supertest from 'supertest';
import app from '../../src/app.js';
import { setupTestDB, teardownTestDB, clearDB } from '../setup/db.js';
import { Professional } from '../../src/modules/sessions/sessions.model.js';

const api = supertest(app);

function getNextWeekday(daysAhead = 2) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysAhead);
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
});

describe('session reschedule: agendar → reprogramar dentro del rango', () => {
  it('reprograma la sesion a un nuevo horario', async () => {
    const day1 = getNextWeekday(2);
    const day2 = getNextWeekday(3);

    await Professional.create({
      fullName: 'Dra. Test',
      specialty: 'psychology',
      email: 'test@prof.com',
      workingHours: [
        { dayOfWeek: day1.getUTCDay(), startHour: 8, endHour: 17 },
        { dayOfWeek: day2.getUTCDay(), startHour: 8, endHour: 17 },
      ],
      isActive: true,
    });

    const reg = await api
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });
    const token = reg.body.data.accessToken;

    const dateStr = day1.toISOString().split('T')[0];
    const slotsRes = await api
      .get(`/api/sessions/available-slots?date=${dateStr}&sessionType=psychology`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const slot = slotsRes.body.data[0].slots[0];
    const profId = slotsRes.body.data[0].professionalId;

    const createRes = await api
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({ professionalId: profId, sessionType: 'psychology', scheduledAt: slot })
      .expect(201);

    const sessionId = createRes.body.data._id;

    const newSlot = new Date(day2);
    newSlot.setUTCHours(10, 0, 0, 0);

    const reschedRes = await api
      .put(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ scheduledAt: newSlot.toISOString() })
      .expect(200);

    expect(new Date(reschedRes.body.data.scheduledAt).getTime()).toBe(newSlot.getTime());
  });
});
