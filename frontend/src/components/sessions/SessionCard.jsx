import PropTypes from 'prop-types';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatDateLong } from '../../lib/date';

const STATUS_STYLES = {
  scheduled: { label: 'Agendada', bg: 'bg-brand-primary/10 text-brand-primary' },
  completed: { label: 'Completada', bg: 'bg-surface-bg text-text-secondary' },
  canceled: { label: 'Cancelada', bg: 'bg-feedback-error/10 text-feedback-error' },
  no_show: { label: 'No asistio', bg: 'bg-surface-bg text-text-secondary' },
};

function formatTime(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function isMoreThan24h(isoDate) {
  return new Date(isoDate).getTime() - Date.now() > 24 * 60 * 60 * 1000;
}

export function SessionCard({ session, onCancel, onReschedule }) {
  const status = STATUS_STYLES[session.status] || STATUS_STYLES.scheduled;
  const canModify = session.status === 'scheduled' && isMoreThan24h(session.scheduledAt);
  const profName = session.professionalId?.fullName || 'Profesional';
  const isCanceled = session.status === 'canceled';

  return (
    <div className="bg-surface-card rounded-lg shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className={cn('px-2 py-0.5 rounded-sm text-caption font-medium', status.bg)}>
          {status.label}
        </span>
        <span className="text-caption text-text-secondary font-mono">
          {session.confirmationCode}
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center gap-2 text-body text-text-primary">
          <Calendar className="h-4 w-4 text-text-secondary shrink-0" />
          <span className={isCanceled ? 'line-through text-text-secondary' : ''}>
            {formatDateLong(session.scheduledAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-body text-text-primary">
          <Clock className="h-4 w-4 text-text-secondary shrink-0" />
          <span>{formatTime(session.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-body text-text-primary">
          <User className="h-4 w-4 text-text-secondary shrink-0" />
          <span>{profName}</span>
        </div>
      </div>

      {canModify && (
        <div className="flex gap-2 pt-2 border-t border-surface-border">
          <button
            onClick={() => onReschedule(session)}
            className="flex-1 py-2 rounded-md border border-brand-primary text-brand-primary text-caption font-semibold hover:bg-brand-primary/5"
          >
            Reprogramar
          </button>
          <button
            onClick={() => onCancel(session._id)}
            className="flex-1 py-2 rounded-md border border-feedback-error text-feedback-error text-caption font-semibold hover:bg-feedback-error/5"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

SessionCard.propTypes = {
  session: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    scheduledAt: PropTypes.string.isRequired,
    confirmationCode: PropTypes.string,
    professionalId: PropTypes.shape({ fullName: PropTypes.string }),
    sessionType: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
};
