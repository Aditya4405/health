import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { usePageTitle } from '@/hooks/usePageTitle';

const roles: Role[] = ['PATIENT', 'DOCTOR'];

export const SignupPage = () => {
  usePageTitle('Create Account');

  const navigate = useNavigate();
  const { signup, getDefaultRoute } = useAuth();

  const [form, setForm] = useState({
    name: 'Aarav Kapoor',
    email: 'patient@mediscan.ai',
    password: 'demo12345',
    role: 'PATIENT' as Role,
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signup(form);
      toast.success('Your account is ready. Welcome to MediScan AI.');
      navigate(getDefaultRoute(form.role), { replace: true });
    } catch {
      toast.error('Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-white/25 bg-white/95 shadow-hover">
      <CardHeader>
        <Badge className="mb-2 w-fit" variant="teal">
          Start Free
        </Badge>
        <CardTitle className="text-2xl">Create your MediScan account</CardTitle>
        <CardDescription>Securely store reports, monitor trends, and connect with doctors.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#355772]">
              Full name
            </label>
            <Input id="name" value={form.name} onChange={(event) => setForm((c) => ({ ...c, name: event.target.value }))} required />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#355772]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((c) => ({ ...c, email: event.target.value }))}
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
              onChange={(event) => setForm((c) => ({ ...c, password: event.target.value }))}
              minLength={8}
              required
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#355772]">I am signing up as</p>
            <div className="grid grid-cols-2 gap-2">
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
            {submitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-[#60758a]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};


