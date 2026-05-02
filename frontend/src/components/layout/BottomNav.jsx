import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookHeart, Target, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

const ITEMS = [
  { icon: Home, label: 'Inicio', to: '/app/dashboard', enabled: true },
  { icon: Calendar, label: 'Sesiones', to: null, enabled: false },
  { icon: BookHeart, label: 'Diario', to: '/app/diario', enabled: true },
  { icon: Target, label: 'Hábitos', to: null, enabled: false },
  { icon: MessageCircle, label: 'Chat', to: null, enabled: false },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-card border-t border-surface-border flex items-center justify-around z-40 lg:hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        if (!item.enabled) {
          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-0.5 text-text-secondary cursor-not-allowed"
              title="Próximamente"
            >
              <Icon className="h-6 w-6" />
              <span className="text-caption">{item.label}</span>
            </div>
          );
        }
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5',
                isActive ? 'text-brand-primary' : 'text-text-secondary'
              )
            }
          >
            <Icon className="h-6 w-6" />
            <span className="text-caption">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
