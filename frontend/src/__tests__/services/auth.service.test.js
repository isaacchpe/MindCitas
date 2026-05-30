import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPost = vi.fn().mockResolvedValue({ data: { data: {} } });
const mockGet = vi.fn().mockResolvedValue({ data: { data: {} } });

vi.mock('../../services/api', () => ({
  default: { post: (...args) => mockPost(...args), get: (...args) => mockGet(...args) },
}));

let authService;

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import('../../services/auth.service');
  authService = mod.authService;
});

describe('authService', () => {
  it('register llama POST /auth/register', async () => {
    await authService.register({ name: 'Test', email: 't@t.com', password: '12345678' });
    expect(mockPost).toHaveBeenCalledWith('/auth/register', expect.any(Object));
  });

  it('login llama POST /auth/login', async () => {
    await authService.login({ email: 't@t.com', password: '12345678' });
    expect(mockPost).toHaveBeenCalledWith('/auth/login', expect.any(Object));
  });

  it('logout llama POST /auth/logout', async () => {
    await authService.logout();
    expect(mockPost).toHaveBeenCalledWith('/auth/logout');
  });

  it('refresh llama POST /auth/refresh', async () => {
    await authService.refresh('token');
    expect(mockPost).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'token' });
  });

  it('forgotPassword llama POST /auth/forgot-password', async () => {
    await authService.forgotPassword({ email: 't@t.com' });
    expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 't@t.com' });
  });

  it('resetPassword llama POST /auth/reset-password', async () => {
    await authService.resetPassword({ token: 'tk', newPassword: 'new' });
    expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'tk',
      newPassword: 'new',
    });
  });
});
