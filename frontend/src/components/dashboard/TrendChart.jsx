import { useState, useEffect, useCallback } from 'react';
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
import { emotionalService } from '../../services/emotional.service';
import { formatDateShort, getDayShort } from '../../lib/date';
import { MOODS } from '../../lib/mood';
import { cn } from '../../lib/cn';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const BASE_OPTIONS = {
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
      ticks: { stepSize: 1, font: { size: 11 }, color: '#6B7B8C' },
      grid: { display: false },
      border: { display: false },
    },
    x: {
      ticks: { font: { size: 11 }, color: '#6B7B8C' },
      grid: { display: false },
      border: { color: '#E1E5EA' },
    },
  },
};

function Skeleton({ className = '' }) {
  return <div className={cn('animate-pulse bg-surface-border rounded-md', className)} />;
}
Skeleton.propTypes = { className: PropTypes.string };

export function TrendChart() {
  const [view, setView] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (v) => {
    setLoading(true);
    try {
      const res =
        v === 'week'
          ? await emotionalService.getWeeklyTrend()
          : await emotionalService.getMonthlyTrend();
      setData(res.data.data);
    } catch (_e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(view);
  }, [view, fetchData]);

  const hasData = data.some((t) => (t.mood ?? t.moodLevel) !== null);

  const labels =
    view === 'week'
      ? data.map((t) => getDayShort(t.date))
      : data.map((t) => {
          const d = new Date(t.date);
          return `${d.getUTCDate()}`;
        });

  const values = data.map((t) => t.mood ?? t.moodLevel);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: '#4A7C59',
        backgroundColor: '#4A7C59',
        borderWidth: 2,
        pointRadius: view === 'week' ? 6 : 3,
        pointHoverRadius: view === 'week' ? 8 : 5,
        pointBackgroundColor: '#4A7C59',
        tension: 0,
        spanGaps: false,
      },
    ],
  };

  const chartOptions = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        ...BASE_OPTIONS.plugins.tooltip,
        callbacks: {
          title: (items) => {
            const idx = items[0]?.dataIndex;
            if (idx === null || idx === undefined || !data[idx]) {
              return '';
            }
            return formatDateShort(data[idx].date);
          },
          label: (ctx) => MOODS[ctx.raw]?.label || '',
        },
      },
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-h3 text-text-primary">Tu tendencia emocional</h3>
          <p className="text-caption text-text-secondary">
            {view === 'week' ? 'Ultimos 7 dias' : 'Ultimos 30 dias'}
          </p>
        </div>
        <div className="flex gap-1 bg-surface-bg rounded-md p-0.5">
          <button
            onClick={() => setView('week')}
            className={cn(
              'px-3 py-1 rounded text-caption font-medium transition-colors',
              view === 'week'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary'
            )}
          >
            Semana
          </button>
          <button
            onClick={() => setView('month')}
            className={cn(
              'px-3 py-1 rounded text-caption font-medium transition-colors',
              view === 'month'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary'
            )}
          >
            Mes
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-48" />
      ) : !hasData ? (
        <p className="text-caption text-text-secondary py-8 text-center">
          Aun no hay registros suficientes para mostrar tu tendencia.
        </p>
      ) : (
        <div className="h-48">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
