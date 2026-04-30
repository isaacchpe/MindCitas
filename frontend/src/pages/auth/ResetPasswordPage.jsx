import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { FormCard } from '../../components/ui/FormCard';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { useToastStore } from '../../stores/toast.store';

function validateField(name, value, form) {
  if (name === 'newPassword') {
    if (!value) {
      return 'La contraseña es obligatoria';
    }
    if (value.length < 8) {
      return 'Minimo 8 caracteres';
    }
  }
  if (name === 'passwordConfirm') {
    if (!value) {
      return 'Confirma tu contraseña';
    }
    if (value !== form.newPassword) {
      return 'Las contraseñas no coinciden';
    }
  }
  return '';
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const toast = useToastStore((s) => s.push);

  const [form, setForm] = useState({ newPassword: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <AuthLayout
        title="Enlace invalido"
        subtitle="El enlace de recuperacion no es valido o ha expirado"
      >
        <FormCard>
          <div className="flex flex-col gap-4">
            <p className="text-body text-text-secondary">
              Solicita un nuevo enlace de recuperacion para restablecer tu contraseña.
            </p>
            <Button fullWidth onClick={() => navigate('/forgot-password')}>
              Solicitar nuevo enlace
            </Button>
          </div>
        </FormCard>
      </AuthLayout>
    );
  }

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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword: form.newPassword });
      toast('success', 'Contraseña actualizada');
      navigate('/login');
    } catch (err) {
      toast('error', err.response?.data?.message || 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Nueva contraseña" subtitle="Define una contraseña segura para tu cuenta">
      <FormCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <TextField
            label="Nueva contraseña"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            hint={errors.newPassword ? undefined : 'Minimo 8 caracteres'}
            error={errors.newPassword}
            required
          />
          <TextField
            label="Confirmar contraseña"
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordConfirm}
            required
          />
          <Button type="submit" fullWidth loading={loading}>
            Restablecer contraseña
          </Button>
        </form>
      </FormCard>
    </AuthLayout>
  );
}
