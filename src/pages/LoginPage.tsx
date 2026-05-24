import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, MoonStar, ShieldCheck, Stethoscope, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { cn } from '@/utils/cn';
import { usePageTitle } from '@/hooks/usePageTitle';

const roleOptions: Array<{
  value: Extract<Role, 'PATIENT' | 'DOCTOR'>;
  title: string;
  description: string;
  icon: typeof HeartPulse;
}> = [
  {
    value: 'PATIENT',
    title: 'Patient',
    description: 'Review reports and personalized health insights.',
    icon: HeartPulse,
  },
  {
    value: 'DOCTOR',
    title: 'Doctor',
    description: 'Access AI-assisted patient report analysis.',
    icon: Stethoscope,
  },
];

export const LoginPage = () => {
  usePageTitle('Login');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, getDefaultRoute } = useAuth();

  const [form, setForm] = useState({
    email: 'patient@mediscan.ai',
    password: 'demo12345',
    role: 'PATIENT' as Role,
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome back to MediScan AI.');
      const redirectPath = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirectPath || getDefaultRoute(form.role), { replace: true });
    } catch {
      toast.error('Unable to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px] space-y-8">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
          Protected Clinical Access
        </p>
        <h1 className="mt-4 font-display text-[clamp(32px,4vw,42px)] font-bold leading-tight">Sign in to MediScan AI</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--landing-muted)]">
          Continue to your secure workspace for report intelligence, patient collaboration, and medical insights.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setForm((current) => ({ ...current, role: option.value }))}
            className={cn(
              'focus-ring rounded-2xl border p-4 text-left transition-all',
              form.role === option.value
                ? 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_10%,var(--landing-surface))] shadow-[0_8px_22px_rgba(37,99,235,0.14)]'
                : 'border-[var(--landing-border)] bg-[var(--landing-surface-2)] hover:border-[var(--landing-primary)]/35',
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
                  form.role === option.value
                    ? 'border-[var(--landing-primary)]/40 bg-[color-mix(in_srgb,var(--landing-primary)_15%,transparent)] text-[var(--landing-primary)]'
                    : 'border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)]',
                )}
              >
                <option.icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{option.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--landing-muted)]">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid gap-6">
          <FloatingInput
            id="login-email"
            type="email"
            label="Email"
            value={form.email}
            onChange={(value) => setForm((current) => ({ ...current, email: value }))}
            required
          />
          <FloatingInput
            id="login-password"
            type="password"
            label="Password"
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            required
          />
        </div>

        <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-4 py-3 text-xs text-[var(--landing-muted)]">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5">
              <MoonStar className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
              Need admin access?
            </span>
            <button
              type="button"
              onClick={() => setForm((current) => ({ ...current, role: 'ADMIN' }))}
              className={cn(
                'focus-ring inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                form.role === 'ADMIN'
                  ? 'border-[var(--landing-primary)] bg-[color-mix(in_srgb,var(--landing-primary)_12%,transparent)] text-[var(--landing-primary)]'
                  : 'border-[var(--landing-border)] text-[var(--landing-muted)] hover:text-[var(--landing-text)]',
              )}
            >
              <UserCog className="h-3 w-3" />
              Admin
            </button>
          </div>
        </div>

        <Button
          className="h-12 w-full rounded-full text-base font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition-transform hover:-translate-y-0.5"
          style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Signing in...' : 'Sign In Securely'}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--landing-muted)]">
        No account yet?{' '}
        <Link to="/signup" className="font-semibold text-[var(--landing-primary)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

const FloatingInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) => (
  <div className="relative">
    <input
      id={id}
      type={type}
      placeholder=" "
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      className="peer h-14 w-full rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 pb-2 pt-6 text-sm text-[var(--landing-text)] transition-all focus:border-[var(--landing-primary)] focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--landing-primary)_14%,transparent)]"
    />
    <label
      htmlFor={id}
      className={cn(
        'pointer-events-none absolute left-4 top-3 text-xs text-[var(--landing-muted)] transition-all',
        'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
        'peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--landing-primary)]',
      )}
    >
      {label}
    </label>
  </div>
);
