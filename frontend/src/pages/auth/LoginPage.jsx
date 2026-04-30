import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { FormCard } from '../../components/ui/FormCard';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { useToastStore } from '../../stores/toast.store';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function validateField(name, value) {
  if (name === 'email') {
    if (!value) {
      return 'El correo es obligatorio';
    }
    if (!EMAIL_RE.test(value)) {
      return 'El correo no es valido';
    }
  }
  if (name === 'password') {
    if (!value) {
      return 'La contrasena es obligatoria';
    }
    if (value.length < 8) {
      return 'Minimo 8 caracteres';
    }
  }
  return '';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    for (const [name, value] of Object.entries(form)) {
      const error = validateField(name, value);
      if (error) {
        errs[name] = error;
      }
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.login(form);
      setSession(data.data);
      navigate('/app/dashboard');
    } catch (err) {
      toast('error', err.response?.data?.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Iniciar sesion" subtitle="Bienvenido de vuelta a MindCitas">
      <FormCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="Correo electronico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            leftIcon={Mail}
            error={errors.email}
            required
          />
          <TextField
            label="Contrasena"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
            error={errors.password}
            required
          />
          <div className="flex justify-end -mt-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/forgot-password')}>
              Olvidaste tu contrasena?
            </Button>
          </div>
          <Button type="submit" fullWidth loading={loading}>
            Iniciar sesion
          </Button>
          <div className="border-t border-surface-border my-2" />
          <p className="text-center text-caption text-text-secondary">
            No tienes cuenta?{' '}
            <Button variant="ghost" size="sm" onClick={() => navigate('/register')}>
              Registrate
            </Button>
          </p>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
