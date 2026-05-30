import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '../../components/ui/TextField';

describe('TextField', () => {
  it('renderiza label y input asociados', () => {
    render(<TextField name="email" label="Correo" />);
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
  });

  it('muestra error cuando se proporciona', () => {
    render(<TextField name="email" label="Correo" error="Campo obligatorio" />);
    expect(screen.getByText('Campo obligatorio')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('muestra hint cuando no hay error', () => {
    render(<TextField name="email" label="Correo" hint="Tu correo institucional" />);
    expect(screen.getByText('Tu correo institucional')).toBeInTheDocument();
  });

  it('no muestra hint cuando hay error', () => {
    render(<TextField name="email" label="Correo" hint="Hint" error="Error" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('toggle de password funciona', async () => {
    const user = userEvent.setup();
    render(<TextField name="pass" label="Contrasena" type="password" />);
    const input = screen.getByLabelText('Contrasena');
    expect(input).toHaveAttribute('type', 'password');

    const toggle = screen.getByRole('button', { name: /mostrar/i });
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
  });
});
