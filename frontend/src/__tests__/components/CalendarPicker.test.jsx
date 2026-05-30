import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarPicker } from '../../components/sessions/CalendarPicker';

describe('CalendarPicker', () => {
  it('renderiza los dias de la semana', () => {
    render(<CalendarPicker onSelect={vi.fn()} />);
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('muestra el mes y ano actual', () => {
    render(<CalendarPicker onSelect={vi.fn()} />);
    const now = new Date();
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    expect(screen.getByText(`${months[now.getMonth()]} ${now.getFullYear()}`)).toBeInTheDocument();
  });

  it('navega al mes siguiente', async () => {
    const user = userEvent.setup();
    render(<CalendarPicker onSelect={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1);
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    expect(
      screen.getByText(`${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`)
    ).toBeInTheDocument();
  });

  it('llama onSelect al hacer click en un dia futuro', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    render(<CalendarPicker onSelect={onSelect} />);

    const dayButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.textContent === String(tomorrow.getDate()) && !btn.disabled);

    if (dayButtons.length > 0) {
      await user.click(dayButtons[0]);
      expect(onSelect).toHaveBeenCalledOnce();
    }
  });
});
