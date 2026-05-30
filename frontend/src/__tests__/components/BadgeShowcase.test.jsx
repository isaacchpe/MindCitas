import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BadgeShowcase } from '../../components/habits/BadgeShowcase';

describe('BadgeShowcase', () => {
  const badge = { name: 'Primera semana', description: '7 dias consecutivos', threshold: 7 };

  it('renderiza el nombre de la insignia', () => {
    render(<BadgeShowcase badge={badge} onClose={vi.fn()} />);
    expect(screen.getByText('Primera semana')).toBeInTheDocument();
  });

  it('renderiza Insignia obtenida', () => {
    render(<BadgeShowcase badge={badge} onClose={vi.fn()} />);
    expect(screen.getByText('Insignia obtenida')).toBeInTheDocument();
  });

  it('llama onClose al hacer click en el backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BadgeShowcase badge={badge} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
