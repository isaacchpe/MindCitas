import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatternBanner } from '../../components/ui/PatternBanner';

describe('PatternBanner', () => {
  it('renderiza el mensaje y boton deshabilitado', () => {
    render(<PatternBanner />);
    expect(screen.getByText('Quieres hablar con alguien?')).toBeInTheDocument();
    expect(screen.getByText('Agendar sesion')).toBeDisabled();
  });
});
