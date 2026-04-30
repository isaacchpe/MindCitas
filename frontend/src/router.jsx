import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './pages/app/DashboardPage';
import EmotionalDiaryPage from './pages/app/EmotionalDiaryPage';

function PrivateRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? <Navigate to="/app/dashboard" replace /> : <Outlet />;
}

function RootRedirect() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (accessToken) {
    return <Navigate to="/app/dashboard" replace />;
  }
  const seen = localStorage.getItem('onboarding-completed');
  return <Navigate to={seen ? '/login' : '/onboarding'} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/app" element={<PrivateRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="diario" element={<EmotionalDiaryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
