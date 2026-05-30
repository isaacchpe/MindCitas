import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../stores/auth.store';
import { useToastStore } from '../../stores/toast.store';
import { emotionalService } from '../../services/emotional.service';
import { formatDateLong, getTodayISO } from '../../lib/date';
import { MOOD_LIST } from '../../lib/mood';
import { MoodButton } from '../../components/ui/MoodButton';
import { Button } from '../../components/ui/Button';
import { EmotionalAlert } from '../../components/dashboard/EmotionalAlert';
import { TrendChart } from '../../components/dashboard/TrendChart';
import { ExportButton } from '../../components/dashboard/ExportButton';

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-border rounded-md ${className}`} />;
}
Skeleton.propTypes = { className: PropTypes.string };

function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-card p-5 rounded-lg shadow-card ${className}`}>{children}</div>
  );
}
Card.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string };

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.push);
  const firstName = user?.name?.split(' ')[0] || '';

  const [todayEntry, setTodayEntry] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchToday = useCallback(async () => {
    try {
      setErrorToday('');
      const { data } = await emotionalService.getByDate(getTodayISO());
      setTodayEntry(data.data);
    } catch (_e) {
      setErrorToday('No se pudo cargar el registro de hoy');
    } finally {
      setLoadingToday(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  const handleMoodClick = async (mood) => {
    setSubmitting(true);
    try {
      const { data } = await emotionalService.createEntry({ mood });
      setTodayEntry(data.data);
      toast('success', 'Registro guardado');
    } catch (_e) {
      toast('error', 'No se pudo guardar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  const todayLabel = formatDateLong(new Date());

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <section>
        <h1 className="text-h2 lg:text-h1 text-text-primary">Hola, {firstName}</h1>
        <p className="text-caption text-text-secondary mt-1">{todayLabel}</p>
      </section>

      <EmotionalAlert />

      <Card>
        <h3 className="text-h3 text-text-primary mb-3">Como te sientes hoy?</h3>
        {loadingToday ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between">
              {MOOD_LIST.map((m) => (
                <Skeleton key={m} className="w-14 h-14 rounded-full" />
              ))}
            </div>
          </div>
        ) : errorToday ? (
          <p className="text-caption text-feedback-error">{errorToday}</p>
        ) : todayEntry ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <MoodButton mood={todayEntry.mood} selected />
            {todayEntry.note && (
              <p className="text-body text-text-secondary italic text-center">
                &ldquo;{todayEntry.note}&rdquo;
              </p>
            )}
            <Button variant="secondary" size="sm" onClick={() => navigate('/app/diario')}>
              Editar registro
            </Button>
          </div>
        ) : (
          <>
            <p className="text-body text-text-secondary mb-4">
              Toca un nivel para registrar tu emocion del dia.
            </p>
            <div className="flex justify-between">
              {MOOD_LIST.map((mood) => (
                <MoodButton
                  key={mood}
                  mood={mood}
                  onClick={() => handleMoodClick(mood)}
                  disabled={submitting}
                />
              ))}
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TrendChart />
          </div>
          <ExportButton />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-h3 text-text-primary">Sesiones</h3>
          <p className="text-body text-text-secondary mt-2">
            Consulta tus sesiones o agenda una nueva.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={() => navigate('/app/sesiones')}>
              Ver sesiones
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/app/agendar')}>
              Agendar
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-h3 text-text-primary">Mis habitos</h3>
          <p className="text-body text-text-secondary mt-2">
            Registra tus habitos del dia y mantiene tu racha.
          </p>
          <div className="mt-3">
            <Button size="sm" onClick={() => navigate('/app/habitos')}>
              Ver habitos
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
