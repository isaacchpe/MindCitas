import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookHeart, Target, MessageCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '../../lib/cn';

const ITEMS = [
  { icon: Home, label: 'Inicio', to: '/app/dashboard', enabled: true },
  { icon: Calendar, label: 'Sesiones', to: null, enabled: false },
  { icon: BookHeart, label: 'Diario', to: '/app/diario', enabled: true },
  { icon: Target, label: 'Hábitos', to: null, enabled: false },
  { icon: MessageCircle, label: 'Chat', to: null, enabled: false },
];

export function SideNav({ user, onLogout }) {
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 bg-surface-card border-r border-surface-border z-40">
      <div className="px-6 py-6">
        <h1 className="text-h2 text-brand-primary">MindCitas</h1>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          if (!item.enabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-5 py-3 text-text-secondary cursor-not-allowed rounded-md"
                title="Próximamente"
              >
                <Icon className="h-5 w-5" />
                <span className="text-body">{item.label}</span>
              </div>
            );
          }
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-5 py-3 rounded-md transition-colors duration-150',
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary border-l-[3px] border-brand-primary'
                    : 'text-text-secondary hover:bg-surface-bg'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-body font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 bg-surface-bg rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center text-caption font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-body font-medium text-text-primary truncate">{user?.name}</p>
            {user?.academicProgram && (
              <p className="text-caption text-text-secondary truncate">{user.academicProgram}</p>
            )}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-3 text-caption font-semibold text-brand-primary hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

SideNav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    academicProgram: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};
