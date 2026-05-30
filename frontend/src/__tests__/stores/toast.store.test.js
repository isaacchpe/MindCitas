import { describe, it, expect, beforeEach } from 'vitest';
import { useToastStore } from '../../stores/toast.store';

describe('toast store', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('push agrega un toast con id unico', () => {
    const id = useToastStore.getState().push('success', 'Hecho');
    expect(typeof id).toBe('number');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0].message).toBe('Hecho');
  });

  it('dismiss elimina el toast por id', () => {
    const id = useToastStore.getState().push('error', 'Error');
    useToastStore.getState().dismiss(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('multiples toasts se acumulan', () => {
    useToastStore.getState().push('info', 'A');
    useToastStore.getState().push('info', 'B');
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });
});
