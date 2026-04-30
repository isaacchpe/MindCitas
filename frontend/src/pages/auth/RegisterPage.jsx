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

function validateField(name, value, form) {
  if (name === 'name') {
    if (!value) {
      return 'El nombre es obligatorio';
    }
  }
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
  if (name === 'passwordConfirm') {
    if (!value) {
      return 'Confirma tu contrasena';
    }
    if (value !== form.password) {
      return 'Las contrasenas no coinciden';
    }
  }
  return '';
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToastStore((s) => s.push);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [terms, setTerms] = useState(false);
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
    const error = validateField(name, value, form);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    for (const [name, value] of Object.entries(form)) {
      const error = validateField(name, value, form);
      if (error) {
        errs[name] = error;
      }
    }
    if (!terms) {
      errs.terms = 'Debes aceptar los terminos y condiciones';
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const { name, email, password } = form;
      const { data } = await authService.register({ name, email, password });
      setSession(data.data);
      navigate('/app/dashboard');
    } catch (err) {
      toast('error', err.response?.data?.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      backTo="/login"
      backLabel="Crear cuenta"
      title="Bienvenido a MindCitas"
      subtitle="Completa tu registro"
    >
      <FormCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="Nombre completo"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Juan Garcia"
            autoComplete="name"
            error={errors.name}
            required
          />
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
            placeholder="Min. 8 caracteres"
            error={errors.password}
            required
          />
          <TextField
            label="Confirmar contrasena"
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Repite tu contrasena"
            error={errors.passwordConfirm}
            required
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: '' }));
                }
              }}
              className="w-4 h-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-body text-text-secondary">Acepto los terminos y condiciones</span>
          </label>
          {errors.terms && <p className="-mt-2 text-caption text-feedback-error">{errors.terms}</p>}
          <Button type="submit" fullWidth loading={loading}>
            Crear cuenta
          </Button>
          <p className="text-center text-caption text-text-secondary">
            Ya tienes cuenta?{' '}
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Inicia sesion
            </Button>
          </p>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
