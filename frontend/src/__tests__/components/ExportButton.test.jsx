import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from '../../components/dashboard/ExportButton';

vi.mock('../../services/emotional.service', () => ({
  emotionalService: {
    exportCsv: vi.fn().mockResolvedValue(),
  },
}));

vi.mock('../../stores/toast.store', () => ({
  useToastStore: (selector) => selector({ push: vi.fn() }),
}));

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza boton con aria-label', () => {
    render(<ExportButton />);
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument();
  });

  it('llama exportCsv al hacer click', async () => {
    const user = userEvent.setup();
    const { emotionalService } = await import('../../services/emotional.service');
    render(<ExportButton />);
    await user.click(screen.getByRole('button'));
    expect(emotionalService.exportCsv).toHaveBeenCalled();
  });
});
