import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('muestra spinner cuando loading=true', () => {
    render(<Button loading>Guardar</Button>);
    expect(screen.queryByText('Guardar')).not.toBeInTheDocument();
  });

  it('esta deshabilitado cuando disabled=true', () => {
    render(<Button disabled>Guardar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('aplica fullWidth', () => {
    render(<Button fullWidth>Guardar</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
  });

  it('variant secondary tiene borde', () => {
    render(<Button variant="secondary">Guardar</Button>);
    expect(screen.getByRole('button').className).toContain('border');
  });

  it('variant ghost tiene hover:underline', () => {
    render(<Button variant="ghost">Link</Button>);
    expect(screen.getByRole('button').className).toContain('underline');
  });
});
