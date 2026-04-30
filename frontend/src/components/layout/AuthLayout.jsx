import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export function AuthLayout({ children, title, subtitle, backTo, backLabel }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-brand-primary items-center justify-center">
        <div className="text-center px-8">
          <h1 className="text-display text-white">MindCitas</h1>
          <p className="mt-3 text-h3 font-normal text-white/80">
            Tu bienestar emocional, en tus manos
          </p>
        </div>
      </div>

      <div className="flex-1 bg-surface-bg flex flex-col">
        <div className="md:hidden">
          {backTo ? (
            <div className="h-14 flex items-center px-4 bg-surface-bg">
              <button
                onClick={() => navigate(backTo)}
                className="flex items-center gap-1 text-text-primary"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-body font-medium">{backLabel}</span>
              </button>
            </div>
          ) : (
            <div className="bg-brand-primary pt-10 pb-8 flex flex-col items-center rounded-b-3xl">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/60" />
              </div>
              <h1 className="text-h1 text-white font-bold">MindCitas</h1>
              <p className="text-body text-white/80 mt-1">Tu bienestar emocional</p>
            </div>
          )}
        </div>

        <div className="flex-1 md:flex md:items-center md:justify-center px-6 py-8">
          <div className="w-full max-w-[440px] mx-auto">
            {title && <h2 className="text-h1 text-text-primary mb-2">{title}</h2>}
            {subtitle && <p className="text-body text-text-secondary mb-6">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backTo: PropTypes.string,
  backLabel: PropTypes.string,
};
