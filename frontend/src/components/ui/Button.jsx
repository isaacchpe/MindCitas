import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const VARIANT = {
  primary: 'bg-brand-primary text-white hover:opacity-90',
  secondary: 'bg-surface-card border border-brand-primary text-brand-primary hover:opacity-90',
  ghost: 'text-brand-primary hover:underline',
};

const SIZE = {
  md: 'px-5 py-3 text-body font-semibold leading-none',
  sm: 'px-3 py-2 text-caption font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT[variant],
        variant === 'ghost' ? SIZE.sm.replace('px-3', 'px-3') : SIZE[size],
        variant === 'ghost' && 'px-3 py-2',
        fullWidth && 'w-full'
      )}
    >
      {loading ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />
      ) : (
        <>
          {LeftIcon && <LeftIcon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />}
          {children}
          {RightIcon && <RightIcon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />}
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['md', 'sm']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
};
