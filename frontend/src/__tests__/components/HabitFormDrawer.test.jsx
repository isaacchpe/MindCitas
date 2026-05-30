import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HabitFormDrawer } from '../../components/habits/HabitFormDrawer';

vi.mock('../../services/habits.service', () => ({
  habitsService: {
    listPredefined: vi.fn().mockResolvedValue({
      data: {
        data: [
          { habitType: 'meditation', name: 'Meditacion 5 min', description: '5 minutos' },
          { habitType: 'exercise', name: 'Ejercicio 30 min', description: '30 minutos' },
        ],
      },
    }),
  },
}));

describe('HabitFormDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no renderiza cuando open=false', () => {
    const { container } = render(
      <HabitFormDrawer open={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza titulo cuando open=true', async () => {
    render(<HabitFormDrawer open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(await screen.findByText('Nuevo habito')).toBeInTheDocument();
  });

  it('muestra habitos predefinidos en step 1', async () => {
    render(<HabitFormDrawer open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);
    expect(await screen.findByText('Meditacion 5 min')).toBeInTheDocument();
    expect(screen.getByText('Crear personalizado')).toBeInTheDocument();
  });

  it('al seleccionar personalizado, el boton Crear esta deshabilitado con nombre vacio', async () => {
    const user = userEvent.setup();
    render(<HabitFormDrawer open={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    const customBtn = await screen.findByText('Crear personalizado');
    await user.click(customBtn);

    const createBtn = screen.getByText('Crear habito');
    expect(createBtn).toBeDisabled();
  });
});
