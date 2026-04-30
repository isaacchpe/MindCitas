import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { MOODS } from '../../lib/mood';
import { cn } from '../../lib/cn';

const SIZES = {
  md: { circle: 'w-14 h-14 text-2xl', label: 'text-caption' },
  lg: { circle: 'w-[72px] h-[72px] text-3xl', label: 'text-body font-medium' },
};

export function MoodButton({ mood, selected = false, onClick, disabled = false, size = 'md' }) {
  const { emoji, label, bg, text } = MOODS[mood];
  const s = SIZES[size];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-1.5 group',
        'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <span className="relative">
        <span
          className={cn(
            s.circle,
            'rounded-full flex items-center justify-center',
            'transition-all duration-150',
            selected
              ? cn(bg, text, size === 'lg' && 'ring-2 ring-brand-primary ring-offset-2')
              : 'bg-surface-card border border-surface-border group-hover:border-brand-primary',
            'group-focus-visible:ring-2 group-focus-visible:ring-brand-primary group-focus-visible:ring-offset-2'
          )}
        >
          {emoji}
        </span>
        {selected && size === 'lg' && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-card border border-surface-border">
            <Check className="w-3 h-3 text-brand-primary" />
          </span>
        )}
      </span>
      <span
        className={cn(s.label, selected ? 'text-text-primary font-medium' : 'text-text-secondary')}
      >
        {label}
      </span>
    </button>
  );
}

MoodButton.propTypes = {
  mood: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['md', 'lg']),
};
