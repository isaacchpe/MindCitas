import { useState, useEffect, useReducer, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Brain, Heart, GraduationCap, Users } from 'lucide-react';
import { sessionsService } from '../../services/sessions.service';
import { useSessionsStore } from '../../stores/sessions.store';
import { useToastStore } from '../../stores/toast.store';
import { CalendarPicker } from '../../components/sessions/CalendarPicker';
import { formatDateLong } from '../../lib/date';
import { cn } from '../../lib/cn';

const TYPE_ICONS = {
  psychology: Brain,
  mindfulness: Heart,
  academic: GraduationCap,
  group: Users,
};

const initialState = {
  step: 1,
  sessionType: null,
  typeName: '',
  date: null,
  slots: [],
  selectedSlot: null,
  professionalId: null,
  professionalName: '',
  confirmationCode: null,
  submitting: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_TYPE':
      return { ...state, step: 2, sessionType: action.code, typeName: action.name };
    case 'SELECT_DATE':
      return { ...state, date: action.date, selectedSlot: null };
    case 'SET_SLOTS':
      return { ...state, slots: action.slots };
    case 'SELECT_SLOT':
      return {
        ...state,
        step: 4,
        selectedSlot: action.slot,
        professionalId: action.professionalId,
        professionalName: action.professionalName,
      };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) };
    case 'SUBMIT':
      return { ...state, submitting: true };
    case 'CONFIRMED':
      return { ...state, step: 5, submitting: false, confirmationCode: action.code };
    case 'ERROR':
      return { ...state, submitting: false };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export default function BookingPage() {
  const navigate = useNavigate();
  const createSession = useSessionsStore((s) => s.createSession);
  const toast = useToastStore((s) => s.push);
  const [types, setTypes] = useState([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    sessionsService.listTypes().then(({ data }) => setTypes(data.data));
  }, []);

  const loadSlots = useCallback(async (date, sessionType) => {
    const dateStr = date.toISOString().split('T')[0];
    try {
      const { data } = await sessionsService.getAvailableSlots(dateStr, sessionType);
      dispatch({ type: 'SET_SLOTS', slots: data.data });
    } catch (_e) {
      dispatch({ type: 'SET_SLOTS', slots: [] });
    }
  }, []);

  const handleDateSelect = (date) => {
    dispatch({ type: 'SELECT_DATE', date });
    loadSlots(date, state.sessionType);
  };

  const handleConfirm = async () => {
    dispatch({ type: 'SUBMIT' });
    try {
      const session = await createSession({
        professionalId: state.professionalId,
        sessionType: state.sessionType,
        scheduledAt: state.selectedSlot,
      });
      dispatch({ type: 'CONFIRMED', code: session.confirmationCode });
    } catch (err) {
      toast('error', err.response?.data?.message || 'No se pudo agendar la sesion');
      dispatch({ type: 'ERROR' });
    }
  };

  const formatSlotTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0 max-w-lg mx-auto">
      {state.step < 5 && (
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full',
                s <= state.step ? 'bg-brand-primary' : 'bg-surface-border'
              )}
            />
          ))}
        </div>
      )}

      {state.step === 1 && (
        <>
          <h1 className="text-h1 text-text-primary">Tipo de sesion</h1>
          <p className="text-body text-text-secondary">Selecciona el tipo de apoyo que necesitas</p>
          <div className="flex flex-col gap-3 mt-2">
            {types.map((t) => {
              const Icon = TYPE_ICONS[t.code] || Brain;
              return (
                <button
                  key={t.code}
                  onClick={() => dispatch({ type: 'SELECT_TYPE', code: t.code, name: t.name })}
                  className="flex items-start gap-4 p-4 bg-surface-card rounded-lg border border-surface-border hover:border-brand-primary transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-body font-semibold text-text-primary">{t.name}</p>
                    <p className="text-caption text-text-secondary mt-0.5">{t.description}</p>
                    <p className="text-caption text-brand-primary mt-1">{t.durationMinutes} min</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {state.step === 2 && (
        <>
          <h1 className="text-h1 text-text-primary">Selecciona fecha</h1>
          <p className="text-body text-text-secondary">{state.typeName}</p>
          <CalendarPicker selected={state.date} onSelect={handleDateSelect} />
          <button
            disabled={!state.date}
            onClick={() => dispatch({ type: 'NEXT_STEP' })}
            className="w-full py-3 rounded-md bg-brand-primary text-white text-body font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="text-center text-caption text-brand-primary hover:underline"
          >
            Volver
          </button>
        </>
      )}

      {state.step === 3 && (
        <>
          <h1 className="text-h1 text-text-primary">Selecciona horario</h1>
          <p className="text-body text-text-secondary">
            {state.date && formatDateLong(state.date)}
          </p>
          {state.slots.length === 0 ? (
            <p className="text-body text-text-secondary py-8 text-center">
              No hay horarios disponibles para esta fecha. Prueba con otra.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {state.slots.map((prof) => (
                <div key={prof.professionalId}>
                  <p className="text-caption text-text-secondary font-medium mb-2">
                    {prof.professionalName}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {prof.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() =>
                          dispatch({
                            type: 'SELECT_SLOT',
                            slot,
                            professionalId: prof.professionalId,
                            professionalName: prof.professionalName,
                          })
                        }
                        className="py-2.5 rounded-md border border-surface-border text-body font-medium text-text-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-colors"
                      >
                        {formatSlotTime(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="text-center text-caption text-brand-primary hover:underline mt-2"
          >
            Volver
          </button>
        </>
      )}

      {state.step === 4 && (
        <>
          <h1 className="text-h1 text-text-primary">Resumen</h1>
          <div className="bg-surface-card rounded-lg shadow-card p-5 flex flex-col gap-3">
            <div>
              <p className="text-caption text-text-secondary">Tipo de sesion</p>
              <p className="text-body font-medium text-text-primary">{state.typeName}</p>
            </div>
            <div>
              <p className="text-caption text-text-secondary">Fecha</p>
              <p className="text-body font-medium text-text-primary">
                {state.date && formatDateLong(state.date)}
              </p>
            </div>
            <div>
              <p className="text-caption text-text-secondary">Hora</p>
              <p className="text-body font-medium text-text-primary">
                {formatSlotTime(state.selectedSlot)}
              </p>
            </div>
            <div>
              <p className="text-caption text-text-secondary">Profesional</p>
              <p className="text-body font-medium text-text-primary">{state.professionalName}</p>
            </div>
            <div>
              <p className="text-caption text-text-secondary">Duracion</p>
              <p className="text-body font-medium text-text-primary">60 minutos</p>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            disabled={state.submitting}
            className="w-full py-3 rounded-md bg-brand-primary text-white text-body font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {state.submitting ? 'Agendando...' : 'Confirmar agendamiento'}
          </button>
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            className="text-center text-caption text-brand-primary hover:underline"
          >
            Volver
          </button>
        </>
      )}

      {state.step === 5 && (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-brand-primary mx-auto mb-4" />
          <h1 className="text-h1 text-brand-primary">Sesion agendada</h1>
          <p className="text-body text-text-secondary mt-2 mb-4">Tu codigo de confirmacion es</p>
          <p className="font-mono text-2xl text-text-primary font-bold mb-6">
            {state.confirmationCode}
          </p>
          <p className="text-body text-text-secondary mb-6">
            Puedes consultarla en tu lista de sesiones.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full py-3 rounded-md bg-brand-primary text-white text-body font-semibold hover:opacity-90"
            >
              Ir al inicio
            </button>
            <button
              onClick={() => navigate('/app/sesiones')}
              className="w-full py-3 rounded-md border border-brand-primary text-brand-primary text-body font-semibold hover:bg-brand-primary/5"
            >
              Ver mis sesiones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
