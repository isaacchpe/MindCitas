import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { useAuthStore } from '../../stores/auth.store';

vi.mock('../../services/auth.service', () => ({
  authService: { logout: vi.fn().mockResolvedValue({}) },
}));

describe('AppShell', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { name: 'Test User', academicProgram: 'Ing' },
      accessToken: 'token',
      refreshToken: 'rt',
    });
  });

  it('muestra saludo con primer nombre en mobile header', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Hola, Test')).toBeInTheDocument();
  });

  it('renderiza las iniciales en el avatar', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getAllByText('TU').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza el outlet con el contenido de la ruta', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/app/dashboard" element={<p>Contenido dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Contenido dashboard')).toBeInTheDocument();
  });
});
