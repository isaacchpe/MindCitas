import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { EmotionalAlert } from '../../components/dashboard/EmotionalAlert';

vi.mock('../../services/emotional.service', () => ({
  emotionalService: {
    checkAlert: vi.fn(),
  },
}));

describe('EmotionalAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renderiza alerta cuando alert=true', async () => {
    const { emotionalService } = await import('../../services/emotional.service');
    emotionalService.checkAlert.mockResolvedValue({ data: { data: { alert: true } } });

    render(
      <MemoryRouter>
        <EmotionalAlert />
      </MemoryRouter>
    );

    expect(await screen.findByText(/tres dias sintiendote bajo/)).toBeInTheDocument();
  });

  it('no renderiza cuando alert=false', async () => {
    const { emotionalService } = await import('../../services/emotional.service');
    emotionalService.checkAlert.mockResolvedValue({ data: { data: { alert: false } } });

    render(
      <MemoryRouter>
        <EmotionalAlert />
      </MemoryRouter>
    );

    await new Promise((r) => setTimeout(r, 100));
    expect(screen.queryByText(/tres dias/)).not.toBeInTheDocument();
  });

  it('Mas tarde guarda en localStorage y oculta', async () => {
    const user = userEvent.setup();
    const { emotionalService } = await import('../../services/emotional.service');
    emotionalService.checkAlert.mockResolvedValue({ data: { data: { alert: true } } });

    render(
      <MemoryRouter>
        <EmotionalAlert />
      </MemoryRouter>
    );

    const btn = await screen.findByText('Mas tarde');
    await user.click(btn);

    expect(localStorage.getItem('emotional-alert-dismissed')).toBe(
      new Date().toISOString().split('T')[0]
    );
    expect(screen.queryByText(/tres dias/)).not.toBeInTheDocument();
  });
});
