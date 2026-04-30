import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/toast.store';
import { cn } from '../../lib/cn';

const CONFIG = {
  success: {
    icon: CheckCircle2,
    border: 'border-l-brand-primary',
    color: 'text-brand-primary',
  },
  error: {
    icon: AlertCircle,
    border: 'border-l-feedback-error',
    color: 'text-feedback-error',
  },
  info: {
    icon: Info,
    border: 'border-l-text-secondary',
    color: 'text-text-secondary',
  },
};

function Toast({ id, type, message }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const { icon: Icon, border, color } = CONFIG[type];

  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, dismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 min-w-[280px] py-3 px-4',
        'bg-surface-card shadow-elevated rounded-md border-l-4',
        border
      )}
      role="alert"
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-px', color)} />
      <p className="text-body text-text-primary flex-1">{message}</p>
      <button
        onClick={() => dismiss(id)}
        className="text-text-secondary hover:text-text-primary shrink-0"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  message: PropTypes.string.isRequired,
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-4 z-50 flex flex-col gap-2',
        'left-4 right-4 items-center',
        'md:left-auto md:right-4 md:items-end'
      )}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
