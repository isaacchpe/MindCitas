import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/cn';

export function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  hint,
  autoComplete,
  required,
  leftIcon: LeftIcon,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div>
      {label && (
        <label htmlFor={name} className="block text-caption font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          className={cn(
            'w-full h-12 px-4 bg-surface-card border rounded-md text-body text-text-primary',
            'placeholder:text-text-secondary',
            'focus:outline-none focus:ring-1 transition-colors duration-150',
            error
              ? 'border-feedback-error focus:ring-feedback-error focus:border-feedback-error'
              : 'border-surface-border focus:ring-brand-primary focus:border-brand-primary',
            LeftIcon && 'pl-10',
            type === 'password' && 'pr-10'
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-caption text-feedback-error">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-caption text-text-secondary">{hint}</p>}
    </div>
  );
}

TextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  leftIcon: PropTypes.elementType,
};
