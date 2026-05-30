import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MoodButton } from '../../components/ui/MoodButton';

describe('MoodButton', () => {
  it('renderiza emoji y label', () => {
    render(<MoodButton mood={4} />);
    expect(screen.getByText('Bien')).toBeInTheDocument();
  });

  it('aria-pressed es true cuando selected', () => {
    render(<MoodButton mood={3} selected />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('aria-pressed es false cuando no selected', () => {
    render(<MoodButton mood={3} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('size lg muestra check cuando selected', () => {
    render(<MoodButton mood={5} selected size="lg" />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
