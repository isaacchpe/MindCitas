import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';

describe('AuthLayout', () => {
  it('renderiza title y subtitle', () => {
    render(
      <MemoryRouter>
        <AuthLayout title="Iniciar sesion" subtitle="Bienvenido">
          <p>form</p>
        </AuthLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar sesion')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  it('renderiza children', () => {
    render(
      <MemoryRouter>
        <AuthLayout>
          <p>Contenido</p>
        </AuthLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('muestra el logo MindCitas en el panel desktop', () => {
    render(
      <MemoryRouter>
        <AuthLayout>
          <p>form</p>
        </AuthLayout>
      </MemoryRouter>
    );
    const logos = screen.getAllByText('MindCitas');
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it('muestra boton back cuando backTo esta presente', () => {
    render(
      <MemoryRouter>
        <AuthLayout backTo="/login" backLabel="Volver">
          <p>form</p>
        </AuthLayout>
      </MemoryRouter>
    );
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });
});
