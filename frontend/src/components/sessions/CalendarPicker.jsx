import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

const DAYS_HEADER = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startDow; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  return cells;
}

function isSameDay(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function CalendarPicker({ selected, onSelect, disabledDates }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const cells = getMonthDays(viewYear, viewMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledSet = new Set((disabledDates || []).map((d) => d.toISOString().split('T')[0]));

  const prev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const next = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prev}
          className="p-1 text-text-secondary hover:text-text-primary"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-body font-semibold text-text-primary">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={next}
          className="p-1 text-text-secondary hover:text-text-primary"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS_HEADER.map((d) => (
          <span key={d} className="text-caption text-text-secondary font-medium">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) {
            return <div key={`empty-${i}`} />;
          }
          const past = isBeforeToday(date);
          const iso = date.toISOString().split('T')[0];
          const disabled = past || disabledSet.has(iso);
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);

          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={cn(
                'h-10 w-full rounded-md text-body transition-colors duration-150',
                disabled && 'opacity-40 cursor-not-allowed',
                !disabled && !isSelected && 'hover:bg-surface-bg',
                isToday && !isSelected && 'ring-1 ring-brand-primary',
                isSelected && 'bg-brand-primary text-white'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

CalendarPicker.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onSelect: PropTypes.func.isRequired,
  disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};
