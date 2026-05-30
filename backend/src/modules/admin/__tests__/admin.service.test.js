import { AdminService } from '../admin.service.js';
import { requireRole } from '../../../middlewares/requireRole.js';

const ADMIN_ID = 'admin1';
const USER_ID = 'user1';

const makeUser = (overrides = {}) => ({
  _id: USER_ID,
  name: 'Test User',
  email: 'test@test.com',
  role: 'student',
  isActive: true,
  ...overrides,
});

const createMockRepo = () => ({
  findUsers: async ({ pageSize }) => ({
    items: Array.from({ length: pageSize }, (_, i) => makeUser({ _id: `u${i}` })),
    total: 50,
  }),
  updateUserById: async (id, patch) => makeUser({ _id: id, ...patch }),
  countUsers: async () => 10,
  countSessions: async () => 5,
  countEntries: async () => 30,
  countHabits: async () => 8,
  countCompletedToday: async () => 3,
});

describe('AdminService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new AdminService(mockRepo);
  });

  describe('listUsers', () => {
    it('respeta paginacion', async () => {
      const result = await service.listUsers({ page: 2, pageSize: 10 });

      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.items).toHaveLength(10);
      expect(result.total).toBe(50);
    });

    it('filtra por search en email', async () => {
      let capturedSearch;
      mockRepo.findUsers = async ({ search }) => {
        capturedSearch = search;
        return { items: [makeUser()], total: 1 };
      };

      await service.listUsers({ page: 1, pageSize: 20, search: 'test@' });

      expect(capturedSearch).toBe('test@');
    });
  });

  describe('toggleUserActive', () => {
    it('previene auto-desactivacion', async () => {
      await expect(service.toggleUserActive(ADMIN_ID, ADMIN_ID, false)).rejects.toThrow(
        'No puedes desactivar tu propia cuenta'
      );
    });

    it('desactiva correctamente otro usuario', async () => {
      const result = await service.toggleUserActive(ADMIN_ID, USER_ID, false);

      expect(result.isActive).toBe(false);
    });
  });

  describe('getStats', () => {
    it('retorna todos los campos esperados con numeros no negativos', async () => {
      const stats = await service.getStats();

      const fields = [
        'totalUsers',
        'activeUsers',
        'totalSessions',
        'sessionsLast7Days',
        'totalEmotionalEntries',
        'entriesLast7Days',
        'totalHabits',
        'completedTodayCount',
      ];
      for (const field of fields) {
        expect(stats).toHaveProperty(field);
        expect(stats[field]).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

describe('requireRole middleware', () => {
  it('rechaza usuario sin rol admin', () => {
    const middleware = requireRole(['admin']);
    const req = { user: { id: 'u1', role: 'student' } };
    const next = () => {};

    expect(() => middleware(req, {}, next)).toThrow('Acceso restringido a administradores');
  });
});
