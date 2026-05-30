import { useState, useEffect } from 'react';
import { Award, Lock } from 'lucide-react';
import { habitsService } from '../../services/habits.service';
import { useAuthStore } from '../../stores/auth.store';
import { cn } from '../../lib/cn';

export default function BadgesPage() {
  const user = useAuthStore((s) => s.user);
  const [allBadges, setAllBadges] = useState([]);
  const [userBadges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catalogRes] = await Promise.all([habitsService.listBadges()]);
        setAllBadges(catalogRes.data.data);
      } catch (_e) {
        /* noop */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const earnedCodes = new Set(userBadges.map((ub) => ub.code));

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <h1 className="text-h1 text-text-primary">Insignias</h1>
      <p className="text-body text-text-secondary">
        Colecciona insignias completando rachas de habitos.
      </p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-surface-border rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const earned = earnedCodes.has(badge.code);
            return (
              <button
                key={badge._id}
                onClick={() => earned && setSelected(badge)}
                className={cn(
                  'p-5 rounded-lg border text-center transition-all',
                  earned
                    ? 'bg-surface-card border-brand-habits/30 shadow-card cursor-pointer hover:shadow-elevated'
                    : 'bg-surface-bg border-surface-border cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3',
                    earned ? 'bg-brand-habits/10' : 'bg-surface-border'
                  )}
                >
                  {earned ? (
                    <Award className="h-6 w-6 text-brand-habits" />
                  ) : (
                    <Lock className="h-5 w-5 text-text-secondary" />
                  )}
                </div>
                <p
                  className={cn(
                    'text-body font-medium',
                    earned ? 'text-text-primary' : 'text-text-secondary'
                  )}
                >
                  {badge.name}
                </p>
                <p className="text-caption text-text-secondary mt-1">{badge.threshold} dias</p>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            className="absolute inset-0 bg-black/50 cursor-default"
            onClick={() => setSelected(null)}
            aria-label="Cerrar"
          />
          <div className="relative bg-surface-card rounded-lg shadow-elevated p-6 max-w-sm w-full text-center">
            <Award className="h-10 w-10 text-brand-habits mx-auto mb-3" />
            <h3 className="text-h3 text-text-primary">{selected.name}</h3>
            <p className="text-body text-text-secondary mt-2">{selected.description}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-caption text-brand-primary hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
