import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '../../components/layout/BottomNav';

describe('BottomNav', () => {
  it('renderiza los 5 items de navegacion', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <BottomNav />
      </MemoryRouter>
    );
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Sesiones')).toBeInTheDocument();
    expect(screen.getByText('Diario')).toBeInTheDocument();
    expect(screen.getByText('Habitos')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('Chat esta deshabilitado con titulo Proximamente', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <BottomNav />
      </MemoryRouter>
    );
    const chat = screen.getByText('Chat').closest('div');
    expect(chat).toHaveAttribute('title', 'Proximamente');
  });

  it('Inicio es un link activo', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <BottomNav />
      </MemoryRouter>
    );
    const link = screen.getByText('Inicio').closest('a');
    expect(link).toHaveAttribute('href', '/app/dashboard');
  });
});
