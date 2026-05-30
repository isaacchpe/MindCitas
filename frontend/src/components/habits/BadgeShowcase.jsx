import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Award } from 'lucide-react';

export function BadgeShowcase({ badge, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/40 cursor-default"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <div className="confetti-bg" />

      <div
        className="relative bg-surface-card rounded-lg shadow-elevated p-8 text-center max-w-sm w-full animate-bounce-in"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-habits/10 flex items-center justify-center">
          <Award className="h-8 w-8 text-brand-habits" />
        </div>
        <h3 className="text-h2 text-text-primary">{badge.name}</h3>
        <p className="text-body text-text-secondary mt-2">
          {badge.description || `Racha de ${badge.threshold} dias`}
        </p>
        <p className="text-caption text-brand-habits mt-4 font-medium">Insignia obtenida</p>
      </div>

      <style>{`
        .confetti-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle, #E6934A 2px, transparent 2px),
            radial-gradient(circle, #4A7C59 2px, transparent 2px),
            radial-gradient(circle, #7C6DAF 2px, transparent 2px);
          background-size: 60px 60px, 80px 80px, 100px 100px;
          background-position: 0 0, 30px 30px, 60px 10px;
          opacity: 0.3;
          animation: confetti-fall 2s ease-out forwards;
        }
        @keyframes confetti-fall {
          from { transform: translateY(-20px); opacity: 0.4; }
          to { transform: translateY(10px); opacity: 0; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

BadgeShowcase.propTypes = {
  badge: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    threshold: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
