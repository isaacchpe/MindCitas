import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionCard } from '../../components/sessions/SessionCard';

const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
const nearDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

describe('SessionCard', () => {
  it('muestra botones para sesion scheduled a mas de 24h', () => {
    render(
      <SessionCard
        session={{
          _id: 's1',
          status: 'scheduled',
          scheduledAt: futureDate,
          confirmationCode: 'MC-123456',
          professionalId: { fullName: 'Dra. Test' },
        }}
        onCancel={vi.fn()}
        onReschedule={vi.fn()}
      />
    );
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Reprogramar')).toBeInTheDocument();
  });

  it('no muestra botones para sesion a menos de 24h', () => {
    render(
      <SessionCard
        session={{
          _id: 's1',
          status: 'scheduled',
          scheduledAt: nearDate,
          confirmationCode: 'MC-123456',
        }}
        onCancel={vi.fn()}
        onReschedule={vi.fn()}
      />
    );
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
  });

  it('no muestra botones para sesion cancelada', () => {
    render(
      <SessionCard
        session={{
          _id: 's1',
          status: 'canceled',
          scheduledAt: futureDate,
          confirmationCode: 'MC-123456',
        }}
        onCancel={vi.fn()}
        onReschedule={vi.fn()}
      />
    );
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    expect(screen.getByText('Cancelada')).toBeInTheDocument();
  });
});
