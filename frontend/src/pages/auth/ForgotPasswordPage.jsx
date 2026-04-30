import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { FormCard } from '../../components/ui/FormCard';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/auth.service';
import { useToastStore } from '../../stores/toast.store';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToastStore((s) => s.push);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('El correo es obligatorio');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('El correo no es valido');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      toast('error', err.response?.data?.message || 'No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout backTo="/login" backLabel="Recuperar acceso">
      <FormCard>
        {sent ? (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-body text-text-primary">
              Si el correo esta registrado, recibiras un enlace para restablecer tu contrasena en
              los proximos minutos.
            </p>
            <Button fullWidth onClick={() => navigate('/login')}>
              Volver a iniciar sesion
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-brand-primary/30" />
              </div>
              <h3 className="text-h3 text-text-primary">Recuperar contrasena</h3>
              <p className="text-body text-text-secondary mt-1 text-center">
                Ingresa tu correo y te enviamos un enlace
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <TextField
                label="Correo electronico"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) {
                    setError('');
                  }
                }}
                onBlur={() => {
                  if (!email) {
                    setError('El correo es obligatorio');
                  } else if (!EMAIL_RE.test(email)) {
                    setError('El correo no es valido');
                  }
                }}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                leftIcon={Mail}
                error={error}
                required
              />
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Volver a iniciar sesion
                </Button>
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Enviar enlace de recuperacion
              </Button>
            </form>
          </>
        )}
      </FormCard>
    </AuthLayout>
  );
}
