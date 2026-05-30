import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormCard } from '../../components/ui/FormCard';

describe('FormCard', () => {
  it('renderiza children', () => {
    render(
      <FormCard>
        <p>Contenido</p>
      </FormCard>
    );
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('tiene clases de card', () => {
    const { container } = render(
      <FormCard>
        <p>Test</p>
      </FormCard>
    );
    expect(container.firstChild.className).toContain('shadow-card');
    expect(container.firstChild.className).toContain('rounded-lg');
  });
});
