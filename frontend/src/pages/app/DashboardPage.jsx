import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuthStore } from '../../stores/auth.store';
import { useToastStore } from '../../stores/toast.store';
import { emotionalService } from '../../services/emotional.service';
import { formatDateLong, formatDateShort, getDayShort, getTodayISO } from '../../lib/date';
import { MOODS, MOOD_LIST } from '../../lib/mood';
import { MoodButton } from '../../components/ui/MoodButton';
import { Button } from '../../components/ui/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

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

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#2C3E50',
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
      padding: 8,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1,
        font: { size: 11 },
        color: '#6B7B8C',
      },
      grid: { display: false },
      border: { display: false },
    },
    x: {
      ticks: {
        font: { size: 11 },
        color: '#6B7B8C',
      },
      grid: { display: false },
      border: { color: '#E1E5EA' },
    },
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.push);
  const firstName = user?.name?.split(' ')[0] || '';

  const [todayEntry, setTodayEntry] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loadingToday, setLoadingToday] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [errorToday, setErrorToday] = useState('');
  const [errorTrend, setErrorTrend] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchToday = useCallback(async () => {
    try {
      setErrorToday('');
      const { data } = await emotionalService.getByDate(getTodayISO());
      setTodayEntry(data.data);
    } catch (err) {
      console.error('Error al cargar registro de hoy:', err);
      setErrorToday('No se pudo cargar el registro de hoy');
    } finally {
      setLoadingToday(false);
    }
  }, []);

  const fetchTrend = useCallback(async () => {
    try {
      setErrorTrend('');
      const { data } = await emotionalService.getWeeklyTrend();
      setTrend(data.data);
    } catch (err) {
      console.error('Error al cargar tendencia semanal:', err);
      setErrorTrend('No se pudo cargar la tendencia semanal');
    } finally {
      setLoadingTrend(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await fetchToday();
      await fetchTrend();
    };
    initialize();
  }, [fetchToday, fetchTrend]);

  const handleMoodClick = async (mood) => {
    setSubmitting(true);
    try {
      const { data } = await emotionalService.createEntry({ mood });
      setTodayEntry(data.data);
      toast('success', 'Registro guardado');
      fetchTrend();
    } catch (err) {
      console.error('Error al guardar registro emocional:', err);
      toast('error', 'No se pudo guardar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  const todayLabel = formatDateLong(new Date());

  const hasData = trend.some((t) => t.mood !== null);
  const chartData = {
    labels: trend.map((t) => getDayShort(t.date)),
    datasets: [
      {
        data: trend.map((t) => t.mood),
        borderColor: '#4A7C59',
        backgroundColor: '#4A7C59',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#4A7C59',
        tension: 0,
        spanGaps: false,
      },
    ],
  };

  const chartOptions = {
    ...CHART_OPTIONS,
    plugins: {
      ...CHART_OPTIONS.plugins,
      tooltip: {
        ...CHART_OPTIONS.plugins.tooltip,
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            return idx !== null && idx !== undefined && trend[idx]
              ? formatDateShort(trend[idx].date)
              : '';
          },
          label: (ctx) => MOODS[ctx.raw]?.label || '',
        },
      },
    },
  };

  const renderTodayContent = () => {
    if (loadingToday) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between">
            {MOOD_LIST.map((m) => (
              <Skeleton key={m} className="w-14 h-14 rounded-full" />
            ))}
          </div>
        </div>
      );
    }

    if (errorToday) {
      return <p className="text-caption text-feedback-error">{errorToday}</p>;
    }

    if (todayEntry) {
      return (
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
      );
    }

    return (
      <>
        <p className="text-body text-text-secondary mb-4">
          Toca un nivel para registrar tu emoción del día.
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
    );
  };

  const renderTrendContent = () => {
    if (loadingTrend) {
      return <Skeleton className="h-48" />;
    }

    if (errorTrend) {
      return <p className="text-caption text-feedback-error">{errorTrend}</p>;
    }

    if (!hasData) {
      return (
        <p className="text-caption text-text-secondary py-8 text-center">
          Aún no hay registros suficientes para mostrar tu tendencia.
        </p>
      );
    }

    return (
      <div className="h-48">
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <section>
        <h1 className="text-h2 lg:text-h1 text-text-primary">Hola, {firstName}</h1>
        <p className="text-caption text-text-secondary mt-1">{todayLabel}</p>
      </section>

      <Card>
        <h3 className="text-h3 text-text-primary mb-3">¿Cómo te sientes hoy?</h3>
        {renderTodayContent()}
      </Card>

      <Card>
        <h3 className="text-h3 text-text-primary">Tu semana emocional</h3>
        <p className="text-caption text-text-secondary mb-4">Últimos 7 días</p>
        {renderTrendContent()}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-h3 text-text-primary">Próxima sesión</h3>
          <p className="text-caption text-text-secondary mt-1">Disponible en próximas entregas</p>
          <p className="text-body text-text-secondary mt-3">
            El módulo de agendamiento se habilitará en el siguiente sprint.
          </p>
        </Card>

        <Card>
          <h3 className="text-h3 text-text-primary">Mis hábitos de hoy</h3>
          <p className="text-caption text-text-secondary mt-1">Disponible en próximas entregas</p>
          <p className="text-body text-text-secondary mt-3">
            El módulo de hábitos se habilitará en el siguiente sprint.
          </p>
        </Card>
      </div>
    </div>
  );
}
