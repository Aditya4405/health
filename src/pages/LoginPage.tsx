import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

const roles: Role[] = ['PATIENT', 'DOCTOR', 'ADMIN'];

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
    <Card className="border-white/25 bg-white/95 shadow-hover">
      <CardHeader>
        <Badge className="mb-2 w-fit" variant="purple">
          Secure Login
        </Badge>
        <CardTitle className="text-2xl">Sign in to your account</CardTitle>
        <CardDescription>Access your health insights and consultations instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#355772]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#355772]">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#355772]">Role</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, role }))}
                  className={`focus-ring rounded-md border px-2 py-2 text-xs font-semibold ${
                    form.role === role
                      ? 'border-primary bg-[#e7f2fd] text-primary'
                      : 'border-[#d4e2ef] bg-white text-[#5d7186] hover:bg-[#f3f8fc]'
                  }`}
                >
                  {role.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-[#60758a]">
          No account yet?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};


