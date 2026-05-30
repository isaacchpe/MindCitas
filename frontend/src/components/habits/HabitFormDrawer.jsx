import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { habitsService } from '../../services/habits.service';
import { cn } from '../../lib/cn';

export function HabitFormDrawer({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [predefined, setPredefined] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      habitsService.listPredefined().then(({ data }) => setPredefined(data.data));
      setStep(1);
      setSelected(null);
      setIsCustom(false);
      setName('');
      setDescription('');
    }
  }, [open]);

  const handleSelect = (item) => {
    setSelected(item);
    setIsCustom(false);
    setName(item.name);
    setDescription(item.description || '');
    setStep(2);
  };

  const handleCustom = () => {
    setSelected(null);
    setIsCustom(true);
    setName('');
    setDescription('');
    setStep(2);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        habitType: isCustom ? 'custom' : selected.habitType,
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = name.trim().length >= 2 && name.trim().length <= 60;

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end lg:justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Cerrar"
      />
      <div className="relative w-full lg:w-[400px] bg-surface-bg h-full overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-card">
          <h2 className="text-h3 text-text-primary">Nuevo habito</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <p className="text-body text-text-secondary mb-2">Selecciona un habito predefinido</p>
              {predefined.map((item) => (
                <button
                  key={item.habitType}
                  onClick={() => handleSelect(item)}
                  className="text-left p-4 bg-surface-card rounded-lg border border-surface-border hover:border-brand-habits transition-colors"
                >
                  <p className="text-body font-medium text-text-primary">{item.name}</p>
                  <p className="text-caption text-text-secondary mt-1">{item.description}</p>
                </button>
              ))}
              <button
                onClick={handleCustom}
                className="text-left p-4 bg-surface-card rounded-lg border border-dashed border-brand-habits text-brand-habits hover:bg-brand-habits/5 transition-colors"
              >
                <p className="text-body font-medium">Crear personalizado</p>
                <p className="text-caption mt-1">Define tu propio habito</p>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setStep(1)}
                className="text-caption text-brand-primary hover:underline self-start"
              >
                Volver a seleccionar
              </button>

              <div>
                <label
                  htmlFor="habit-name"
                  className="block text-caption font-medium text-text-primary mb-1.5"
                >
                  Nombre
                </label>
                <input
                  id="habit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  readOnly={!isCustom}
                  className={cn(
                    'w-full h-12 px-4 bg-surface-card border border-surface-border rounded-md text-body text-text-primary',
                    'focus:outline-none focus:ring-1 focus:ring-brand-habits focus:border-brand-habits',
                    !isCustom && 'bg-surface-bg'
                  )}
                />
                <p className="text-caption text-text-secondary mt-1 text-right">{name.length}/60</p>
              </div>

              <div>
                <label
                  htmlFor="habit-desc"
                  className="block text-caption font-medium text-text-primary mb-1.5"
                >
                  Descripcion (opcional)
                </label>
                <textarea
                  id="habit-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full p-4 bg-surface-card border border-surface-border rounded-md text-body text-text-primary resize-y focus:outline-none focus:ring-1 focus:ring-brand-habits focus:border-brand-habits"
                />
                <p className="text-caption text-text-secondary mt-1 text-right">
                  {description.length}/200
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!canSubmit || submitting}
                className="w-full py-3 rounded-md bg-brand-habits text-white text-body font-semibold hover:opacity-90 transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creando...' : 'Crear habito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

HabitFormDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
