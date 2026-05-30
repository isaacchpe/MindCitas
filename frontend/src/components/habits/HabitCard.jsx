import { useState } from 'react';
import PropTypes from 'prop-types';
import { Flame, Check, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const TYPE_CHIPS = {
  meditation: { label: 'Meditacion', color: 'bg-brand-emotional/20 text-brand-emotional' },
  exercise: { label: 'Ejercicio', color: 'bg-brand-habits/20 text-brand-habits' },
  reading: { label: 'Lectura', color: 'bg-brand-primary/20 text-brand-primary' },
  hydration: { label: 'Hidratacion', color: 'bg-blue-100 text-blue-600' },
  sleep: { label: 'Sueno', color: 'bg-indigo-100 text-indigo-600' },
  custom: { label: 'Personalizado', color: 'bg-surface-bg text-text-secondary' },
};

export function HabitCard({ habit, onCheck, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [checking, setChecking] = useState(false);
  const chip = TYPE_CHIPS[habit.habitType] || TYPE_CHIPS.custom;

  const handleCheck = async () => {
    setChecking(true);
    try {
      await onCheck(habit._id);
    } finally {
      setChecking(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(habit._id);
    setConfirming(false);
    setMenuOpen(false);
  };

  return (
    <div className="bg-surface-card rounded-lg shadow-card p-5 flex flex-col gap-3 relative">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-body font-semibold text-text-primary">{habit.name}</h3>
          <span className={cn('inline-block mt-1 px-2 py-0.5 rounded-sm text-caption', chip.color)}>
            {chip.label}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 text-text-secondary hover:text-text-primary"
            aria-label="Opciones"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 bg-surface-card shadow-elevated rounded-md border border-surface-border py-1 min-w-[140px] z-10">
              <button
                onClick={() => {
                  setConfirming(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-body text-feedback-error hover:bg-surface-bg flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-caption">
        <span className="flex items-center gap-1 text-brand-habits font-medium">
          <Flame className="h-4 w-4" />
          {habit.currentStreak} dias
        </span>
        <span className="text-text-secondary">Mejor: {habit.bestStreak}</span>
      </div>

      {habit.completedToday ? (
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-brand-primary/10 text-brand-primary text-body font-medium">
          <Check className="h-5 w-5" />
          Cumplido hoy
        </div>
      ) : (
        <button
          onClick={handleCheck}
          disabled={checking}
          className="w-full py-2.5 rounded-md bg-brand-habits text-white text-body font-semibold hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
        >
          {checking ? 'Registrando...' : 'Marcar hoy'}
        </button>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-surface-card rounded-lg shadow-elevated p-6 w-full max-w-sm">
            <h3 className="text-h3 text-text-primary mb-2">Eliminar habito</h3>
            <p className="text-body text-text-secondary mb-4">
              El habito se desactivara pero sus registros se conservan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2 rounded-md border border-surface-border text-body text-text-secondary hover:bg-surface-bg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-md bg-feedback-error text-white text-body font-semibold hover:opacity-90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

HabitCard.propTypes = {
  habit: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    habitType: PropTypes.string.isRequired,
    currentStreak: PropTypes.number,
    bestStreak: PropTypes.number,
    completedToday: PropTypes.bool,
  }).isRequired,
  onCheck: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
