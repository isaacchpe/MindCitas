import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SideNav } from '../../components/layout/SideNav';

describe('SideNav', () => {
  const user = { name: 'Juan Garcia', academicProgram: 'Ingenieria' };

  it('renderiza el logo MindCitas', () => {
    render(
      <MemoryRouter>
        <SideNav user={user} onLogout={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('MindCitas')).toBeInTheDocument();
  });

  it('muestra el nombre del usuario', () => {
    render(
      <MemoryRouter>
        <SideNav user={user} onLogout={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Juan Garcia')).toBeInTheDocument();
  });

  it('muestra las iniciales en el avatar', () => {
    render(
      <MemoryRouter>
        <SideNav user={user} onLogout={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('JG')).toBeInTheDocument();
  });

  it('renderiza todos los items de navegacion', () => {
    render(
      <MemoryRouter>
        <SideNav user={user} onLogout={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Diario')).toBeInTheDocument();
    expect(screen.getByText('Habitos')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });
});
