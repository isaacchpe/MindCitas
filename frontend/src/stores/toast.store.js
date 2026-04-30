import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (type, message) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    return id;
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
