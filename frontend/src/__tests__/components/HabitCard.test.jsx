import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitCard } from '../../components/habits/HabitCard';

const baseHabit = {
  _id: 'h1',
  name: 'Meditacion',
  habitType: 'meditation',
  currentStreak: 5,
  bestStreak: 10,
  completedToday: false,
};

describe('HabitCard', () => {
  it('muestra boton Marcar hoy cuando completedToday=false', () => {
    render(<HabitCard habit={baseHabit} onCheck={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Marcar hoy')).toBeInTheDocument();
  });

  it('muestra Cumplido hoy cuando completedToday=true', () => {
    render(
      <HabitCard
        habit={{ ...baseHabit, completedToday: true }}
        onCheck={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Cumplido hoy')).toBeInTheDocument();
    expect(screen.queryByText('Marcar hoy')).not.toBeInTheDocument();
  });

  it('muestra la racha actual', () => {
    render(<HabitCard habit={baseHabit} onCheck={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('5 dias')).toBeInTheDocument();
  });
});
