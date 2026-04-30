import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/cn';

const SLIDES = [
  {
    bg: 'bg-brand-primary',
    title: 'Bienvenido a MindCitas',
    subtitle: 'Tu bienestar emocional, en tus manos',
    circle: 'bg-white/10',
    innerCircle: 'bg-white/20',
    coreCircle: 'bg-white/30',
  },
  {
    bg: 'bg-brand-emotional',
    title: 'Agenda tus sesiones',
    subtitle: 'Conecta con profesionales de la salud mental',
    circle: 'bg-white/10',
    innerCircle: 'bg-white/15',
    coreCircle: 'bg-white/25',
  },
  {
    bg: 'bg-brand-habits',
    title: 'Registra tu estado emocional',
    subtitle: 'Lleva un diario de tu bienestar diario',
    circle: 'bg-white/10',
    innerCircle: 'bg-white/15',
    coreCircle: 'bg-white/25',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('onboarding-completed', 'true');
      navigate('/login');
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div
      className={cn('min-h-screen flex flex-col items-center justify-between px-8 py-12', slide.bg)}
    >
      <div />

      <div className="flex flex-col items-center text-center">
        <div className="relative w-48 h-48 mb-10">
          <div className={cn('absolute inset-0 rounded-full', slide.circle)} />
          <div className={cn('absolute inset-6 rounded-full', slide.innerCircle)} />
          <div className={cn('absolute inset-14 rounded-full', slide.coreCircle)} />
        </div>
        <h1 className="text-h1 text-white font-bold">{slide.title}</h1>
        <p className="text-body text-white/80 mt-3 max-w-xs">{slide.subtitle}</p>

        <div className="flex gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-200',
                i === current ? 'bg-white' : 'bg-white/40'
              )}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full max-w-sm py-4 bg-white rounded-lg text-body font-semibold text-brand-primary hover:bg-white/90 transition-colors duration-150"
      >
        {isLast ? 'Empezar' : 'Siguiente'}
      </button>
    </div>
  );
}
