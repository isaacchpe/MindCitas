import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../stores/auth.store';

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
  });

  it('setSession guarda user y tokens', () => {
    useAuthStore.getState().setSession({
      user: { name: 'Test' },
      accessToken: 'at',
      refreshToken: 'rt',
    });

    const state = useAuthStore.getState();
    expect(state.user.name).toBe('Test');
    expect(state.accessToken).toBe('at');
    expect(state.refreshToken).toBe('rt');
  });

  it('clearSession limpia todo', () => {
    useAuthStore.getState().setSession({
      user: { name: 'Test' },
      accessToken: 'at',
      refreshToken: 'rt',
    });
    useAuthStore.getState().clearSession();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
