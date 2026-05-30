import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastContainer } from '../../components/ui/ToastContainer';
import { useToastStore } from '../../stores/toast.store';

describe('ToastContainer', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('no renderiza nada sin toasts', () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza toasts del store', () => {
    useToastStore.setState({
      toasts: [
        { id: 1, type: 'success', message: 'Guardado' },
        { id: 2, type: 'error', message: 'Fallo' },
      ],
    });
    render(<ToastContainer />);
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    expect(screen.getByText('Fallo')).toBeInTheDocument();
  });
});
