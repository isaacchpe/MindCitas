import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { emotionalService } from '../../services/emotional.service';

const DISMISSED_KEY = 'emotional-alert-dismissed';

function isDismissedToday() {
  const val = localStorage.getItem(DISMISSED_KEY);
  if (!val) {
    return false;
  }
  return val === new Date().toISOString().split('T')[0];
}

export function EmotionalAlert() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isDismissedToday()) {
      return;
    }
    emotionalService
      .checkAlert()
      .then(({ data }) => {
        if (data.data.alert) {
          setShow(true);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, new Date().toISOString().split('T')[0]);
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="bg-brand-emotional/10 border-l-4 border-brand-emotional rounded-lg p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-brand-emotional shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-body text-text-primary">
            Hemos notado que llevas tres dias sintiendote bajo. Te gustaria agendar una sesion con
            un profesional? Puede ayudarte hablar con alguien.
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => navigate('/app/agendar?sessionType=psychology')}
              className="px-4 py-2 rounded-md bg-brand-primary text-white text-caption font-semibold hover:opacity-90"
            >
              Agendar ahora
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 text-caption text-brand-primary font-semibold hover:underline"
            >
              Mas tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
