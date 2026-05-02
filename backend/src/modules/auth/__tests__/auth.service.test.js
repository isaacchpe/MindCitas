import jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service.js';

const TEST_USER = {
  _id: 'user123',
  name: 'Test',
  email: 'test@test.com',
  comparePassword: async (pwd) => pwd === 'password123',
  toJSON() {
    return { _id: this._id, name: this.name, email: this.email };
  },
};

const createMockRepo = () => ({
  findByEmail: async () => null,
  findById: async () => null,
  create: async (data) => ({ ...TEST_USER, ...data }),
  updateById: async (_id, data) => ({ ...TEST_USER, ...data }),
});

describe('AuthService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new AuthService(mockRepo);
  });

  describe('register', () => {
    it('lanza error si el email ya existe', async () => {
      mockRepo.findByEmail = async () => TEST_USER;

      await expect(
        service.register({ name: 'Test', email: 'test@test.com', password: '12345678' })
      ).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('login', () => {
    it('lanza error con credenciales inválidas', async () => {
      mockRepo.findByEmail = async () => ({
        ...TEST_USER,
        comparePassword: async () => false,
      });

      await expect(service.login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(
        'Credenciales inválidas'
      );
    });

    it('retorna tokens con credenciales válidas', async () => {
      mockRepo.findByEmail = async () => TEST_USER;

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });
  });

  describe('refresh', () => {
    it('genera un nuevo access token', async () => {
      const refreshToken = jwt.sign({ id: 'user123' }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
      mockRepo.findById = async () => TEST_USER;

      const result = await service.refresh(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(typeof result.accessToken).toBe('string');
    });
  });

  describe('resetPassword', () => {
    it('actualiza la password si el token es válido', async () => {
      const token = jwt.sign({ id: 'user123' }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
      });
      mockRepo.updateById = async () => TEST_USER;

      const result = await service.resetPassword({ token, newPassword: 'newpass123' });

      expect(result).toHaveProperty('message', 'Contraseña actualizada');
    });
  });
});
