import { SessionService, genConfirmationCode } from '../sessions.service.js';

const OWNER = 'user1';
const OTHER = 'user2';
const PROF_ID = 'prof1';

const futureDate = (hoursAhead) => {
  const d = new Date();
  d.setTime(d.getTime() + hoursAhead * 60 * 60 * 1000);
  d.setUTCMinutes(0, 0, 0);
  return d;
};

const makeProfessional = (overrides = {}) => ({
  _id: PROF_ID,
  fullName: 'Dra. Maria Gonzalez',
  specialty: 'psychology',
  isActive: true,
  workingHours: [
    { dayOfWeek: 1, startHour: 8, endHour: 17 },
    { dayOfWeek: 2, startHour: 8, endHour: 17 },
    { dayOfWeek: 3, startHour: 8, endHour: 17 },
    { dayOfWeek: 4, startHour: 8, endHour: 17 },
    { dayOfWeek: 5, startHour: 8, endHour: 17 },
  ],
  ...overrides,
});

const makeSession = (overrides = {}) => ({
  _id: 'session1',
  userId: { toString: () => OWNER },
  professionalId: PROF_ID,
  sessionType: 'psychology',
  scheduledAt: futureDate(48),
  status: 'scheduled',
  confirmationCode: 'MC-A1B2C3',
  ...overrides,
});

const createMockRepo = () => ({
  findActiveProfessionalsBySpecialty: async () => [makeProfessional()],
  findProfessionalById: async () => makeProfessional(),
  findScheduledByProfessionalAndDate: async () => [],
  create: async (data) => ({ _id: 'session1', ...data }),
  findByUser: async () => [],
  findById: async () => makeSession(),
  updateById: async (id, patch) => ({ ...makeSession(), ...patch }),
});

const createMockUserRepo = () => ({
  findById: async () => ({
    _id: OWNER,
    name: 'Juan Garcia',
    academicProgram: 'Ingenieria de Software',
  }),
});

describe('SessionService', () => {
  let service;
  let mockRepo;
  let mockUserRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    mockUserRepo = createMockUserRepo();
    service = new SessionService(mockRepo, mockUserRepo);
  });

  describe('genConfirmationCode', () => {
    it('produce string de 9 caracteres con prefijo MC-', () => {
      const code = genConfirmationCode();

      expect(code).toHaveLength(9);
      expect(code).toMatch(/^MC-[A-F0-9]{6}$/);
    });
  });

  describe('createSession', () => {
    it('genera confirmationCode con formato MC-XXXXXX', async () => {
      const result = await service.createSession(OWNER, {
        professionalId: PROF_ID,
        sessionType: 'psychology',
        scheduledAt: futureDate(48).toISOString(),
      });

      expect(result.confirmationCode).toMatch(/^MC-[A-F0-9]{6}$/);
    });

    it('rechaza scheduledAt en el pasado', async () => {
      const past = new Date('2020-01-01T10:00:00Z');

      await expect(
        service.createSession(OWNER, {
          professionalId: PROF_ID,
          sessionType: 'psychology',
          scheduledAt: past.toISOString(),
        })
      ).rejects.toThrow('al menos 1 hora de anticipacion');
    });

    it('rechaza si el slot esta ocupado (error de indice unico)', async () => {
      const error = new Error('duplicate key');
      error.code = 11000;
      mockRepo.create = async () => {
        throw error;
      };

      await expect(
        service.createSession(OWNER, {
          professionalId: PROF_ID,
          sessionType: 'psychology',
          scheduledAt: futureDate(48).toISOString(),
        })
      ).rejects.toThrow('ya esta reservado');
    });

    it('copia correctamente el userSnapshot del usuario', async () => {
      let captured;
      mockRepo.create = async (data) => {
        captured = data;
        return { _id: 's1', ...data };
      };

      await service.createSession(OWNER, {
        professionalId: PROF_ID,
        sessionType: 'psychology',
        scheduledAt: futureDate(48).toISOString(),
      });

      expect(captured.userSnapshot.fullName).toBe('Juan Garcia');
      expect(captured.userSnapshot.program).toBe('Ingenieria de Software');
    });
  });

  describe('getAvailableSlots', () => {
    it('descuenta los slots ocupados', async () => {
      const monday = new Date();
      monday.setUTCHours(0, 0, 0, 0);
      while (monday.getUTCDay() !== 1) {
        monday.setUTCDate(monday.getUTCDate() + 1);
      }
      const dateStr = monday.toISOString().split('T')[0];

      const booked = new Date(monday);
      booked.setUTCHours(10, 0, 0, 0);
      mockRepo.findScheduledByProfessionalAndDate = async () => [{ scheduledAt: booked }];

      const result = await service.getAvailableSlots(dateStr, 'psychology');

      if (result.length > 0) {
        const slots = result[0].slots;
        expect(slots).not.toContain(booked.toISOString());
      }
    });

    it('retorna [] para fechas pasadas', async () => {
      const result = await service.getAvailableSlots('2020-01-01', 'psychology');

      expect(result).toEqual([]);
    });
  });

  describe('cancel', () => {
    it('rechaza si la sesion esta a menos de 24h', async () => {
      mockRepo.findById = async () => makeSession({ scheduledAt: futureDate(2) });

      await expect(service.cancel(OWNER, 'session1')).rejects.toThrow('24 horas');
    });

    it('rechaza si la sesion es de otro usuario', async () => {
      mockRepo.findById = async () => makeSession({ userId: { toString: () => OTHER } });

      await expect(service.cancel(OWNER, 'session1')).rejects.toThrow('No tienes acceso');
    });
  });

  describe('reschedule', () => {
    it('cambia scheduledAt cuando todo es valido', async () => {
      const newDate = futureDate(72);
      let capturedPatch;
      mockRepo.updateById = async (id, patch) => {
        capturedPatch = patch;
        return { ...makeSession(), ...patch };
      };

      await service.reschedule(OWNER, 'session1', newDate.toISOString());

      expect(capturedPatch.scheduledAt.getTime()).toBe(newDate.getTime());
    });
  });
});
