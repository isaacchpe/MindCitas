import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';
import { SideNav } from './SideNav';
import { BottomNav } from './BottomNav';
import { LogoutModal } from '../ui/LogoutModal';

export function AppShell() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  const [logoutOpen, setLogoutOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] || '';
  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // noop
    }
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <SideNav user={user} onLogout={() => setLogoutOpen(true)} />

      <header className="fixed top-0 left-0 right-0 h-14 bg-surface-card border-b border-surface-border flex items-center justify-between px-4 z-40 lg:hidden">
        <h2 className="text-h3 text-text-primary">Hola, {firstName}</h2>
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center text-caption font-semibold"
          aria-label="Menu de usuario"
        >
          {initials}
        </button>
      </header>

      <main className="pt-14 pb-20 px-4 lg:pt-0 lg:pb-0 lg:pl-60 lg:px-8">
        <div className="max-w-[1080px] mx-auto lg:py-8">
          <Outlet />
        </div>
      </main>

      <BottomNav />

      <LogoutModal
        open={logoutOpen}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
}
