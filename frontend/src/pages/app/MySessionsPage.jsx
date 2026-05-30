import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { useSessionsStore } from '../../stores/sessions.store';
import { useToastStore } from '../../stores/toast.store';
import { SessionCard } from '../../components/sessions/SessionCard';
import { cn } from '../../lib/cn';

export default function MySessionsPage() {
  const navigate = useNavigate();
  const { mySessions, loading, error, fetchMySessions, cancelSession } = useSessionsStore();
  const toast = useToastStore((s) => s.push);
  const [tab, setTab] = useState('upcoming');
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    fetchMySessions('all');
  }, [fetchMySessions]);

  const upcoming = mySessions.filter((s) => s.status === 'scheduled');
  const past = mySessions.filter((s) => s.status !== 'scheduled');
  const displayed = tab === 'upcoming' ? upcoming : past;

  const handleCancel = useCallback(
    async (sessionId) => {
      setCanceling(sessionId);
      try {
        await cancelSession(sessionId);
        toast('success', 'Sesion cancelada');
      } catch (err) {
        toast('error', err.response?.data?.message || 'No se pudo cancelar la sesion');
      } finally {
        setCanceling(null);
      }
    },
    [cancelSession, toast]
  );

  const handleReschedule = useCallback(
    (session) => {
      navigate(`/app/agendar?reschedule=${session._id}&type=${session.sessionType}`);
    },
    [navigate]
  );

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-text-primary">Mis sesiones</h1>
        <button
          onClick={() => navigate('/app/agendar')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-primary text-white text-body font-semibold hover:opacity-90"
        >
          <CalendarPlus className="h-4 w-4" />
          Agendar
        </button>
      </div>

      <div className="flex gap-1 bg-surface-bg rounded-md p-1">
        <button
          onClick={() => setTab('upcoming')}
          className={cn(
            'flex-1 py-2 rounded-md text-body font-medium transition-colors',
            tab === 'upcoming'
              ? 'bg-surface-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Proximas
        </button>
        <button
          onClick={() => setTab('past')}
          className={cn(
            'flex-1 py-2 rounded-md text-body font-medium transition-colors',
            tab === 'past'
              ? 'bg-surface-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Pasadas
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse bg-surface-border rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-caption text-feedback-error">{error}</p>}

      {!loading && displayed.length === 0 && (
        <div className="text-center py-12">
          <CalendarPlus className="h-12 w-12 text-text-secondary mx-auto mb-3" />
          <p className="text-body text-text-secondary">
            {tab === 'upcoming' ? 'No tienes sesiones proximas' : 'No tienes sesiones pasadas'}
          </p>
          {tab === 'upcoming' && (
            <button
              onClick={() => navigate('/app/agendar')}
              className="mt-3 px-4 py-2 rounded-md bg-brand-primary text-white text-body font-semibold hover:opacity-90"
            >
              Agendar mi primera sesion
            </button>
          )}
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div className="flex flex-col gap-3">
          {displayed.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      )}

      {canceling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-surface-card rounded-lg p-6 max-w-sm w-full text-center">
            <p className="text-body text-text-primary">Cancelando sesion...</p>
          </div>
        </div>
      )}
    </div>
  );
}
