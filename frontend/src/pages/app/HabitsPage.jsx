import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useHabitsStore } from '../../stores/habits.store';
import { useToastStore } from '../../stores/toast.store';
import { HabitCard } from '../../components/habits/HabitCard';
import { HabitFormDrawer } from '../../components/habits/HabitFormDrawer';
import { BadgeShowcase } from '../../components/habits/BadgeShowcase';

export default function HabitsPage() {
  const { habits, loading, error, fetchHabits, createHabit, checkHabit, deleteHabit } =
    useHabitsStore();
  const toast = useToastStore((s) => s.push);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCreate = useCallback(
    async (data) => {
      try {
        await createHabit(data);
        toast('success', 'Habito creado');
      } catch (_e) {
        toast('error', 'No se pudo crear el habito');
        throw _e;
      }
    },
    [createHabit, toast]
  );

  const handleCheck = useCallback(
    async (habitId) => {
      try {
        const result = await checkHabit(habitId);
        toast('success', 'Registro guardado');
        if (result.awardedBadge) {
          setEarnedBadge(result.awardedBadge);
        }
      } catch (_e) {
        toast('error', 'No se pudo registrar');
      }
    },
    [checkHabit, toast]
  );

  const handleDelete = useCallback(
    async (habitId) => {
      try {
        await deleteHabit(habitId);
        toast('success', 'Habito eliminado');
      } catch (_e) {
        toast('error', 'No se pudo eliminar');
      }
    },
    [deleteHabit, toast]
  );

  return (
    <div className="flex flex-col gap-4 py-4 lg:py-0">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-text-primary">Mis habitos</h1>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-brand-habits text-brand-habits text-body font-semibold hover:bg-brand-habits/5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo habito
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse bg-surface-border rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-caption text-feedback-error">{error}</p>}

      {!loading && !error && habits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-text-secondary">Aun no tienes habitos activos.</p>
          <p className="text-caption text-text-secondary mt-1">
            Crea tu primer habito para empezar a construir tu rutina.
          </p>
        </div>
      )}

      {!loading && habits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onCheck={handleCheck}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <HabitFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleCreate}
      />

      {earnedBadge && <BadgeShowcase badge={earnedBadge} onClose={() => setEarnedBadge(null)} />}
    </div>
  );
}
