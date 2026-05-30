import { UserService } from '../users.service.js';

const TEST_USER = {
  _id: 'user123',
  email: 'test@test.com',
  name: 'Juan Garcia',
  academicProgram: 'Ingenieria de Software',
  role: 'user',
  createdAt: new Date('2026-01-01'),
};

const createMockRepo = () => ({
  findById: async () => ({ ...TEST_USER }),
  updateById: async (_id, patch) => ({ ...TEST_USER, ...patch }),
});

describe('UserService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new UserService(mockRepo);
  });

  describe('getUserById', () => {
    it('retorna perfil sin password', async () => {
      const result = await service.getUserById('user123');

      expect(result).toHaveProperty('fullName', 'Juan Garcia');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('name');
    });

    it('lanza error si el usuario no existe', async () => {
      mockRepo.findById = async () => null;

      await expect(service.getUserById('inexistente')).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('updateUserProfile', () => {
    it('actualiza fullName correctamente', async () => {
      let capturedPatch;
      mockRepo.updateById = async (id, patch) => {
        capturedPatch = patch;
        return { ...TEST_USER, ...patch };
      };

      const result = await service.updateUserProfile('user123', { fullName: 'Pedro Lopez' });

      expect(capturedPatch).toHaveProperty('name', 'Pedro Lopez');
      expect(result.fullName).toBe('Pedro Lopez');
    });

    it('rechaza fullName de 1 caracter', async () => {
      await expect(service.updateUserProfile('user123', { fullName: 'A' })).rejects.toThrow(
        'El nombre debe tener al menos 2 caracteres'
      );
    });

    it('no permite tocar el campo email aunque venga en el patch', async () => {
      let capturedPatch;
      mockRepo.updateById = async (id, patch) => {
        capturedPatch = patch;
        return { ...TEST_USER, ...patch };
      };

      await service.updateUserProfile('user123', {
        fullName: 'Nuevo Nombre',
        email: 'hack@test.com',
      });

      expect(capturedPatch).not.toHaveProperty('email');
      expect(capturedPatch).toHaveProperty('name', 'Nuevo Nombre');
    });
  });
});
