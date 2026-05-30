import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoutModal } from '../../components/ui/LogoutModal';

describe('LogoutModal', () => {
  it('no renderiza cuando open=false', () => {
    const { container } = render(
      <LogoutModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza cuando open=true', () => {
    render(<LogoutModal open={true} onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Cerrar sesion')).toBeInTheDocument();
  });

  it('llama onConfirm al confirmar', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<LogoutModal open={true} onConfirm={onConfirm} onCancel={vi.fn()} />);
    await user.click(screen.getByText('Confirmar y cerrar'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('llama onCancel al cancelar', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<LogoutModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
