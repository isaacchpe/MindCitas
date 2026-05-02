import { Button } from './Button';

// se activa cuando el backend retorne flag de patron negativo
export function PatternBanner() {
  return (
    <div className="bg-brand-emotional/10 border-l-[3px] border-brand-emotional p-5 rounded-lg">
      <h3 className="text-h3 text-text-primary">¿Quieres hablar con alguien?</h3>
      <p className="text-body text-text-secondary mt-2">
        Hemos notado que has tenido días difíciles esta semana. Considera agendar una sesión con un
        profesional.
      </p>
      <div className="mt-3" title="Próximamente">
        <Button variant="secondary" size="sm" disabled>
          Agendar sesión
        </Button>
      </div>
    </div>
  );
}
