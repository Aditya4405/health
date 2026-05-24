import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Lock, MoonStar, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isSignup = location.pathname.includes('signup');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-text)] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(37,99,235,0.14),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(8,145,178,0.14),transparent_42%)]" />

      <header className="relative z-20 border-b border-[var(--landing-border)] bg-[color-mix(in_srgb,var(--landing-bg)_88%,transparent)]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center justify-between px-4 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)]">
              <ActivityPulseIcon className="h-4.5 w-4.5 text-[var(--landing-text)]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--landing-accent)]" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">MediScan AI</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--landing-text)]"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <Link
              to="/"
              className="focus-ring rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-text)]"
            >
              Back To Site
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1240px] gap-8 px-4 pb-10 pt-8 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[minmax(0,580px)_minmax(0,1fr)] lg:items-stretch lg:px-8 lg:pb-12 lg:pt-10">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-[30px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-5 shadow-[var(--landing-shadow)] sm:p-7 lg:flex lg:items-center lg:p-10"
        >
          <div className="w-full">
            <Outlet />
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: 'easeOut' }}
          className="relative hidden overflow-hidden rounded-[30px] border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-8 shadow-[var(--landing-shadow)] lg:block"
        >
          <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--landing-primary)_16%,transparent)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-10 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--landing-accent)_16%,transparent)] blur-3xl" />

          <div className="relative z-10 flex h-full flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--landing-accent)]" />
              Clinical Intelligence Engine
            </span>
            <h2 className="mt-5 max-w-lg font-display text-[34px] font-bold leading-tight">
              {isSignup ? 'Onboard into AI-powered care intelligence.' : 'Continue with secure clinical AI access.'}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--landing-muted)]">
              MediScan converts complex reports into structured medical understanding with anomaly detection, physician collaboration, and compliant storage.
            </p>

            <div className="mt-8 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">Live Report Parsing</p>
                <span className="rounded-full border border-[var(--landing-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--landing-muted)]">
                  AI Confidence 98%
                </span>
              </div>
              <div className="space-y-2">
                <ReportLine label="Hemoglobin" value="11.2 g/dL" tone="amber" />
                <ReportLine label="LDL Cholesterol" value="182 mg/dL" tone="red" />
                <ReportLine label="WBC" value="7,200 /uL" tone="green" />
                <ReportLine label="Platelets" value="280,000 /uL" tone="green" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <InsightTag label="Potential Iron Deficiency" tone="amber" />
                <InsightTag label="Cardio Risk Marker" tone="red" />
                <InsightTag label="Clinical Review Suggested" tone="blue" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">Compliance</p>
                <div className="mt-2 space-y-2 text-sm text-[var(--landing-text)]">
                  <p className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[var(--landing-accent)]" />
                    HIPAA aligned workflows
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[var(--landing-accent)]" />
                    End-to-end encrypted records
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--landing-muted)]">AI Assistant</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-muted)]">
                  "LDL trend is above optimal range. Recommend preventive cardiology consult and lifestyle review."
                </p>
              </div>
            </div>

            <div className="mt-auto pt-5">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--landing-muted)]">Trusted by clinicians and patients across modern care teams.</p>
            </div>
          </div>
        </motion.aside>
      </main>
    </div>
  );
};

const ReportLine = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'red';
}) => (
  <div className="grid grid-cols-[1fr_auto] items-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-3 py-2">
    <span className="text-xs text-[var(--landing-muted)]">{label}</span>
    <InsightTag label={value} tone={tone} />
  </div>
);

const InsightTag = ({
  label,
  tone,
}: {
  label: string;
  tone: 'green' | 'amber' | 'red' | 'blue';
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium',
      tone === 'green' && 'border-[#2f5f47] bg-[#123223] text-[#6EE7B7]',
      tone === 'amber' && 'border-[#6d5523] bg-[#312613] text-[#FCD34D]',
      tone === 'red' && 'border-[#6f3232] bg-[#341919] text-[#FCA5A5]',
      tone === 'blue' && 'border-[#1b3d75] bg-[#122742] text-[#93C5FD]',
    )}
  >
    {label}
  </span>
);

function ActivityPulseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l2.2-5 3.6 10 2.4-5H22" />
    </svg>
  );
}
