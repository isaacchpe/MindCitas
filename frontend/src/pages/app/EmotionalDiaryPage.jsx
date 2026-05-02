import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { emotionalService } from '../../services/emotional.service';
import { useToastStore } from '../../stores/toast.store';
import { formatDateLong, formatDateShort, getTodayISO } from '../../lib/date';
import { MOODS, MOOD_LIST } from '../../lib/mood';
import { MoodButton } from '../../components/ui/MoodButton';
import { Button } from '../../components/ui/Button';
import { PatternBanner } from '../../components/ui/PatternBanner';
import { cn } from '../../lib/cn';

function Card({ children, className = '' }) {
  return (
    <div className={cn('bg-surface-card p-5 rounded-lg shadow-card', className)}>{children}</div>
  );
}
Card.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string };

function Skeleton({ className = '' }) {
  return <div className={cn('animate-pulse bg-surface-border rounded-md', className)} />;
}
Skeleton.propTypes = { className: PropTypes.string };

function RecentEntry({ entry }) {
  const mood = MOODS[entry.mood];
  return (
    <div className="flex items-start gap-3 py-3">
      <span
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0',
          mood.bg,
          mood.text
        )}
      >
        {mood.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-body font-medium text-text-primary">
            {formatDateShort(entry.date)}
          </span>
          <span className="text-caption text-text-secondary">{mood.label}</span>
        </div>
        {entry.note && (
          <p className="text-body text-text-secondary mt-0.5 line-clamp-2">{entry.note}</p>
        )}
      </div>
    </div>
  );
}
RecentEntry.propTypes = {
  entry: PropTypes.shape({
    mood: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    note: PropTypes.string,
  }).isRequired,
};

export default function EmotionalDiaryPage() {
  const toast = useToastStore((s) => s.push);

  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [negativePattern] = useState(false);

  const fetchToday = useCallback(async () => {
    try {
      const { data } = await emotionalService.getByDate(getTodayISO());
      if (data.data) {
        setMood(data.data.mood);
        setNote(data.data.note || '');
        setIsExisting(true);
      }
    } catch (err) {
      console.error('Error al obtener registro de hoy:', err);
    } finally {
      setLoadingPage(false);
    }
  }, []);

  const fetchRecent = useCallback(async () => {
    try {
      const { data } = await emotionalService.getRecentEntries(7);
      setRecentEntries(data.data || []);
    } catch (err) {
      console.error('Error al obtener registros recientes:', err);
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await fetchToday();
      await fetchRecent();
    };
    initialize();
  }, [fetchToday, fetchRecent]);

  const handleSubmit = async () => {
    if (!mood) {
      return;
    }
    setSubmitting(true);
    try {
      const payload = { mood };
      if (note.trim()) {
        payload.note = note.trim();
      }
      await emotionalService.createEntry(payload);
      setIsExisting(true);
      toast('success', 'Registro guardado correctamente');
      fetchRecent();
    } catch (err) {
      console.error('Error al guardar registro emocional:', err);
      toast('error', 'No se pudo guardar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  const renderRecentContent = () => {
    if (loadingRecent) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      );
    }

    if (recentEntries.length === 0) {
      return (
        <p className="text-body text-text-secondary py-4">
          Aún no tienes registros. Empieza por registrar cómo te sientes hoy.
        </p>
      );
    }

    return (
      <div className="divide-y divide-surface-border">
        {recentEntries.map((entry) => (
          <RecentEntry key={entry._id || entry.date} entry={entry} />
        ))}
      </div>
    );
  };

  const noteOverLimit = note.length > 500;
  const todayLabel = formatDateLong(new Date());

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <section>
        <h1 className="text-h1 text-text-primary">Diario emocional</h1>
        <p className="text-caption text-text-secondary mt-1">{todayLabel}</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <h3 className="text-h3 text-text-primary mb-1">¿Cómo te sientes hoy?</h3>
            <p className="text-body text-text-secondary mb-4">
              Selecciona el nivel que mejor describa tu estado de ánimo.
            </p>
            {loadingPage ? (
              <div className="flex justify-between">
                {MOOD_LIST.map((m) => (
                  <Skeleton key={m} className="w-[72px] h-[72px] rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex justify-between">
                {MOOD_LIST.map((m) => (
                  <MoodButton
                    key={m}
                    mood={m}
                    size="lg"
                    selected={mood === m}
                    onClick={() => setMood(m)}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-h3 text-text-primary mb-1">Reflexión del día</h3>
            <p className="text-caption text-text-secondary mb-3">
              Opcional. Escribe lo que quieras compartir contigo mismo.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={cn(
                'w-full min-h-[120px] p-4 bg-surface-card border rounded-md text-body text-text-primary',
                'placeholder:text-text-secondary resize-y',
                'focus:outline-none focus:ring-1 transition-colors duration-150',
                noteOverLimit
                  ? 'border-feedback-error focus:ring-feedback-error'
                  : 'border-surface-border focus:ring-brand-primary focus:border-brand-primary'
              )}
              placeholder="¿Cómo estuvo tu día?"
              maxLength={600}
            />
            <p
              className={cn(
                'text-caption text-right mt-1',
                noteOverLimit ? 'text-feedback-error' : 'text-text-secondary'
              )}
            >
              {note.length}/500
            </p>
          </Card>

          <Button
            type="button"
            fullWidth
            loading={submitting}
            disabled={!mood || noteOverLimit}
            onClick={handleSubmit}
          >
            {isExisting ? 'Actualizar registro' : 'Guardar registro'}
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-h3 text-text-primary mb-3">Registros recientes</h3>
            {renderRecentContent()}
          </Card>
        </div>
      </div>

      {negativePattern && <PatternBanner />}
    </div>
  );
}
