import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrainCircuit,
  Check,
  ChevronRight,
  CloudUpload,
  Lock,
  Menu,
  MoonStar,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

const navSections = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'security', label: 'Security' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'doctors', label: 'Doctors' },
];

const bentoFeatures = [
  {
    id: 'analysis',
    title: 'Intelligent Report Analysis',
    body: 'Clinical AI parses panels and reference intervals with explainable insight trails and anomaly confidence.',
    icon: BrainCircuit,
    span: 'lg:col-span-7',
    chips: ['CBC', 'Lipid', 'Thyroid', 'Metabolic'],
  },
  {
    id: 'risk',
    title: 'AI Health Risk Detection',
    body: 'Flags critical trends early and prioritizes abnormal findings for faster clinical review.',
    icon: Sparkles,
    span: 'lg:col-span-5',
    chips: ['LDL Risk', 'Anemia Signal', 'Ferritin Drop'],
  },
  {
    id: 'vault',
    title: 'Secure Medical Vault',
    body: 'Enterprise-grade encrypted storage built for compliant report access and long-term records.',
    icon: Lock,
    span: 'lg:col-span-4',
    chips: ['HIPAA', 'SOC2', 'Audit Logs'],
  },
  {
    id: 'doctor',
    title: 'Doctor Collaboration',
    body: 'Share findings with specialists using structured recommendations and report-linked notes.',
    icon: UserRound,
    span: 'lg:col-span-3',
    chips: ['Share Case', 'Consult Notes'],
  },
  {
    id: 'tracking',
    title: 'Long-Term Health Tracking',
    body: 'Track biomarker movement over time and surface trend changes before risk escalates.',
    icon: CloudUpload,
    span: 'lg:col-span-5',
    chips: ['Timeline', 'Trend Alerts', 'Follow-up'],
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Report',
    body: 'Securely upload PDF or image reports in seconds with enterprise-grade encryption.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'AI Analyzes Data',
    body: 'Our model extracts values, checks reference ranges, and highlights abnormal markers.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    title: 'Receive Clinical Insights',
    body: 'Get clear explanations, risk indicators, and recommended next actions instantly.',
    icon: Sparkles,
  },
];

const testimonials = [
  {
    quote: 'MediScan reduced our clinical review time by 68%.',
    author: 'Dr. Rahul Mehta',
    role: 'Cardiologist, Apollo Hospitals',
  },
  {
    quote: 'The platform surfaces hidden risk patterns before they become emergencies.',
    author: 'Dr. Priya Anand',
    role: 'Internal Medicine, Fortis Health',
  },
  {
    quote: 'Our patients finally understand their reports without fear or confusion.',
    author: 'Dr. Akshay Batra',
    role: 'Clinical Lead, MetroCare',
  },
];

const plans = {
  monthly: { free: 0, pro: 299, team: 999 },
  yearly: { free: 0, pro: 239, team: 799 },
};

const biomarkerInsights = [
  {
    id: 'hemoglobin',
    marker: 'Hemoglobin',
    value: '11.2 g/dL',
    status: 'Low',
    explanation:
      'Below optimal range. This pattern may indicate iron deficiency anemia and should be reviewed with a follow-up profile.',
    recommendation: 'Increase iron intake and schedule CBC retest in 4 weeks.',
  },
  {
    id: 'ldl',
    marker: 'LDL Cholesterol',
    value: '182 mg/dL',
    status: 'High',
    explanation: 'LDL exceeds recommended range and may increase long-term cardiovascular risk.',
    recommendation: 'Discuss preventive cardio plan and lifestyle intervention with your physician.',
  },
  {
    id: 'ferritin',
    marker: 'Ferritin',
    value: '18 ng/mL',
    status: 'Low',
    explanation: 'Ferritin trend suggests reduced iron stores despite stable WBC profile.',
    recommendation: 'Review ferritin with diet and supplementation strategy.',
  },
];

export const LandingPage = () => {
  usePageTitle('MediScan AI');

  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [activeInsight, setActiveInsight] = useState(biomarkerInsights[0]);

  const prices = yearly ? plans.yearly : plans.monthly;
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        duration: 6 + Math.random() * 5,
      })),
    [],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-[var(--landing-bg)] text-[var(--landing-text)] transition-colors duration-300">
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 h-[72px] border-b border-[var(--landing-border)] bg-[var(--landing-bg)] transition-all duration-300',
          scrolled && 'shadow-[0_10px_28px_rgba(0,0,0,0.18)]',
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--landing-surface)] text-[var(--landing-text)]">
              <ActivityPulseIcon className="h-4.5 w-4.5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--landing-accent)]" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">MediScan AI</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-text)]"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)] transition-transform hover:-translate-y-0.5 hover:text-[var(--landing-text)]"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <Link to="/signup">
              <Button
                className="h-11 rounded-full px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-transform hover:-translate-y-0.5"
                style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen((open) => !open)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[var(--landing-border)] bg-[var(--landing-bg)] px-4 py-3 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--landing-muted)] hover:bg-[var(--landing-surface)]"
                  >
                    {section.label}
                  </a>
                ))}
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="mt-2 h-11 w-full rounded-full text-white"
                    style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-[120px] pt-[136px] lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(37,99,235,0.14),transparent_42%)]" />
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-[var(--landing-muted)]/35"
              style={{ left: particle.x, top: particle.y }}
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.03fr_0.97fr]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-6 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--landing-muted)]">
                AI-Powered Clinical Intelligence
              </Badge>

              <h1 className="max-w-2xl font-display text-[clamp(46px,7vw,78px)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                Understand Medical Reports With{' '}
                <span className="bg-gradient-to-r from-[var(--landing-primary)] to-[var(--landing-accent)] bg-clip-text text-transparent">
                  Clinical Precision
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--landing-muted)]">
                Upload lab reports and receive AI-powered insights, abnormality detection, and simplified clinical explanations instantly.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button
                    className="h-12 rounded-[18px] px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
                    style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                  >
                    Upload Report <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Button className="h-12 rounded-[18px] border border-[var(--landing-border)] bg-[var(--landing-surface)] px-7 text-base font-semibold text-[var(--landing-text)] transition-transform hover:-translate-y-0.5">
                  <PlayCircle className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--landing-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[var(--landing-accent)]" /> HIPAA Compliant
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[var(--landing-accent)]" /> SOC2 Certified
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-[var(--landing-accent)]" /> 256-bit Encryption
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="relative rounded-[28px] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 shadow-[var(--landing-shadow)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[var(--landing-muted)]">Live AI Clinical Scan</p>
                <Badge className="rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-2)] text-[var(--landing-muted)]">
                  AI Confidence: 98%
                </Badge>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-4 md:p-5">
                <motion.div
                  className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#06B6D4]/20 to-transparent"
                  animate={{ y: ['-20%', '112%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative z-10 space-y-2 text-sm">
                  <ReportRow label="Hemoglobin" value="11.2 g/dL" tone="amber" />
                  <ReportRow label="LDL Cholesterol" value="182 mg/dL" tone="red" />
                  <ReportRow label="Ferritin" value="18 ng/mL" tone="amber" />
                  <ReportRow label="WBC" value="7,200 /uL" tone="green" />
                  <ReportRow label="Platelets" value="280,000 /uL" tone="green" />
                </div>

                <div className="relative z-10 mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    'Low Hemoglobin Detected',
                    'High LDL Risk',
                    'Iron Deficiency Indicators',
                    'AI Confidence: 98%',
                  ].map((insight, index) => (
                    <motion.div
                      key={insight}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-lg border border-[var(--landing-border)] bg-[var(--landing-surface)] px-2.5 py-1.5 text-[11px] leading-tight text-[var(--landing-muted)]"
                    >
                      {insight}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-4">
                <p className="text-sm text-[var(--landing-muted)]">AI Recommendation</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-text)]">
                  Pattern indicates mild anemia with elevated LDL. Suggested next step: hematology follow-up and cardio-preventive consultation.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--landing-muted)]">Platform Capabilities</p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
              Clinical intelligence built into every step of report understanding
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12">
            {bentoFeatures.map((feature, idx) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                className={cn(
                  'relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-7 shadow-[var(--landing-shadow)] lg:p-8',
                  feature.span,
                )}
              >
                <feature.icon className="mb-5 h-6 w-6 text-[var(--landing-accent)]" />
                <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--landing-muted)]">{feature.body}</p>

                <FeatureMicroPreview featureId={feature.id} chips={feature.chips} />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--landing-muted)]">Interactive AI Demo</p>
              <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
                Watch MediScan explain biomarkers like a clinical AI assistant
              </h2>
              <p className="mt-5 max-w-xl text-lg text-[var(--landing-muted)]">
                Hover a biomarker to preview contextual medical explanation and next-step recommendation.
              </p>

              <div className="mt-8 space-y-3">
                {biomarkerInsights.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveInsight(item)}
                    onFocus={() => setActiveInsight(item)}
                    className={cn(
                      'focus-ring flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all',
                      activeInsight.id === item.id
                        ? 'border-[var(--landing-primary)] bg-[var(--landing-surface-2)]'
                        : 'border-[var(--landing-border)] bg-[var(--landing-surface)] hover:border-[var(--landing-muted)]/35',
                    )}
                  >
                    <span>
                      <p className="font-medium text-[var(--landing-text)]">{item.marker}</p>
                      <p className="text-sm text-[var(--landing-muted)]">{item.value}</p>
                    </span>
                    <span className="text-sm text-[var(--landing-accent)]">{item.status}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeInsight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-8 shadow-[var(--landing-shadow)]"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--landing-muted)]">AI Clinical Interpretation</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{activeInsight.marker}</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--landing-muted)]">{activeInsight.explanation}</p>

              <div className="mt-6 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--landing-muted)]">Recommendation</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-text)]">{activeInsight.recommendation}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-display text-[clamp(34px,4.5vw,52px)] font-bold">From upload to insight in three steps</h2>
            <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
              <span className="absolute left-[18%] right-[18%] top-11 hidden h-px bg-[var(--landing-border)] lg:block" />
              {steps.map((step, idx) => (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="relative rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-8"
                >
                  <p className="absolute right-5 top-4 font-display text-6xl font-bold text-[var(--landing-muted)]/12">{step.number}</p>
                  <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--landing-surface-2)] text-[var(--landing-accent)]">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-base text-[var(--landing-muted)]">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--landing-muted)]">Why MediScan AI</p>
              <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
                Medical Reports Shouldn't Feel Impossible To Understand
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[var(--landing-muted)]">
                Clinical terminology creates anxiety. Risk signals are easy to miss. MediScan AI translates complexity into immediate clarity.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Complex report language leaves patients uncertain.',
                'Abnormal trends can be missed between periodic checkups.',
                'Doctor handoff is slower without structured insight summaries.',
                'MediScan AI turns technical findings into understandable actions instantly.',
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-5 py-4 text-[var(--landing-muted)]"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-[clamp(34px,4.5vw,52px)] font-bold">Trusted by healthcare teams</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <motion.article
                key={testimonial.author}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-8 shadow-[var(--landing-shadow)]"
              >
                <div className="mb-3 flex items-center gap-1 text-[var(--landing-primary)]">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Check key={starIdx} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-6 border-t border-[var(--landing-border)] pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="mt-1 text-sm text-[var(--landing-muted)]">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-y border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-[clamp(34px,4.5vw,52px)] font-bold">Simple pricing for every stage</h2>
                <p className="mt-3 text-[var(--landing-muted)]">Start free and scale to clinical workflows and team collaboration.</p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface)] p-1.5">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    !yearly ? 'bg-[var(--landing-surface-2)] text-[var(--landing-text)]' : 'text-[var(--landing-muted)]',
                  )}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    yearly ? 'bg-[var(--landing-surface-2)] text-[var(--landing-text)]' : 'text-[var(--landing-muted)]',
                  )}
                >
                  Yearly
                </button>
                <span className="rounded-full bg-[color-mix(in_srgb,var(--landing-primary)_12%,transparent)] px-3 py-1 text-xs text-[var(--landing-primary)]">
                  Save 20%
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <PricingCard title="Free" price={prices.free} cta="Start Free" features={['3 reports/month', 'Basic AI Summary', '1GB storage']} />
              <PricingCard
                title="Pro"
                price={prices.pro}
                cta="Upgrade to Pro"
                featured
                features={['Unlimited reports', 'Full AI Analysis', '10GB storage', 'Doctor Connect']}
              />
              <PricingCard
                title="Team"
                price={prices.team}
                cta="Choose Team"
                features={['Everything in Pro', '5 users', 'Priority support', 'Admin panel']}
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-10 shadow-[var(--landing-shadow)] lg:p-14">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-tight">Ready To Understand Your Health Smarter?</h2>
                <p className="mt-3 text-lg text-[var(--landing-muted)]">AI-powered medical intelligence in seconds.</p>
              </div>
              <Link to="/signup">
                <Button
                  className="h-12 rounded-full px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' }}
                >
                  Upload Your First Report
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--landing-border)] px-4 pb-10 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--landing-surface)]">
                  <ActivityPulseIcon className="h-4.5 w-4.5" />
                </span>
                <span className="font-display text-base font-semibold">MediScan AI</span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--landing-muted)]">
                Premium AI healthcare platform turning complex reports into trusted clinical insight.
              </p>
            </div>
            <FooterColumn title="Product" links={['Features', 'How It Works', 'Security', 'Pricing']} />
            <FooterColumn title="Company" links={['About', 'Careers', 'Blog', 'Contact']} />
            <FooterColumn title="Legal" links={['Privacy Policy', 'Terms', 'Security', 'HIPAA']} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--landing-border)] pt-6 text-sm text-[var(--landing-muted)]">
            <p>Copyright {new Date().getFullYear()} MediScan AI. All rights reserved.</p>
            <div className="flex items-center gap-2">
              {['X', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="rounded-full border border-[var(--landing-border)] px-3 py-1.5 transition-colors hover:bg-[var(--landing-surface)]"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ReportRow = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'red';
}) => (
  <div className="grid grid-cols-[1fr_auto] items-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2">
    <span className="text-sm text-[var(--landing-muted)]">{label}</span>
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs',
        tone === 'green' && 'bg-[#123223] text-[#6EE7B7]',
        tone === 'amber' && 'bg-[#312613] text-[#FCD34D]',
        tone === 'red' && 'bg-[#341919] text-[#FCA5A5]',
      )}
    >
      {value}
    </span>
  </div>
);

const FeatureMicroPreview = ({
  featureId,
  chips,
}: {
  featureId: (typeof bentoFeatures)[number]['id'];
  chips: string[];
}) => {
  if (featureId === 'analysis') {
    return (
      <div className="mt-6 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-3.5">
        <div className="space-y-2">
          <MiniReportMetric label="Hemoglobin" value="11.2 g/dL" tone="amber" />
          <MiniReportMetric label="LDL Cholesterol" value="182 mg/dL" tone="red" />
          <MiniReportMetric label="WBC" value="7,200 /uL" tone="green" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <MicroPill label="Potential Iron Deficiency" tone="amber" />
          <MicroPill label="Clinical Attention Recommended" tone="red" />
        </div>
      </div>
    );
  }

  if (featureId === 'risk') {
    return (
      <div className="relative mt-6 h-[160px] overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-3.5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(37,99,235,0.16),transparent_48%)]" />
        <div className="relative z-10 flex h-full flex-wrap content-start gap-1.5">
          {chips.map((chip, index) => (
            <motion.div
              key={chip}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <MicroPill label={chip} tone={index === 0 ? 'red' : 'amber'} />
            </motion.div>
          ))}
          <motion.div
            className="ml-auto mt-1"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
          >
            <MicroPill label="Confidence 98%" tone="blue" />
          </motion.div>
          <div className="mt-auto w-full rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2 text-[11px] text-[var(--landing-muted)]">
            AI anomaly detection is actively triaging high-priority biomarkers.
          </div>
        </div>
      </div>
    );
  }

  if (featureId === 'vault') {
    return (
      <div className="relative mt-6 h-[168px] overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-3.5">
        <div className="pointer-events-none absolute right-5 top-6 h-20 w-28 rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)]/85 rotate-[7deg]" />
        <div className="pointer-events-none absolute right-8 top-8 h-20 w-28 rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)]/80 rotate-[2deg]" />
        <div className="relative z-10 max-w-[75%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3">
          <p className="truncate text-xs font-medium text-[var(--landing-text)]">CBC_Report_Jan2026.pdf</p>
          <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[var(--landing-muted)]">
            <Lock className="h-3 w-3 text-[var(--landing-accent)]" /> Encrypted at rest
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <MicroPill label="HIPAA Verified" tone="green" />
          <MicroPill label="Encrypted Sync" tone="blue" />
          <MicroPill label="Protected Records" tone="neutral" />
        </div>
      </div>
    );
  }

  if (featureId === 'doctor') {
    return (
      <div className="mt-6 space-y-2.5 rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-3.5">
        <div className="max-w-[92%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2 text-[11px] text-[var(--landing-muted)]">
          Dr. Mehta: Cardiology follow-up suggested for elevated LDL.
        </div>
        <div className="ml-auto max-w-[90%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2 text-[11px] text-[var(--landing-muted)]">
          Please review ferritin trend before consultation.
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2">
          <span className="text-[11px] text-[var(--landing-muted)]">Consultation Request</span>
          <MicroPill label="Pending" tone="blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-6 h-[168px] overflow-hidden rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface-2)] p-3.5">
      <motion.div
        className="absolute left-3 top-3 w-[62%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-[11px] font-medium text-[var(--landing-text)]">LDL improved 12%</p>
      </motion.div>
      <motion.div
        className="absolute right-3 top-[48px] w-[64%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      >
        <p className="text-[11px] font-medium text-[var(--landing-text)]">Hemoglobin stabilized</p>
      </motion.div>
      <motion.div
        className="absolute left-6 top-[94px] w-[58%] rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-3 py-2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
      >
        <p className="text-[11px] font-medium text-[var(--landing-text)]">Follow-up completed</p>
      </motion.div>
      <div className="absolute bottom-3 right-3 flex flex-wrap justify-end gap-1.5">
        {chips.map((chip) => (
          <MicroPill key={chip} label={chip} tone="neutral" />
        ))}
      </div>
    </div>
  );
};

const MiniReportMetric = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'red';
}) => (
  <div
    className={cn(
      'grid grid-cols-[1fr_auto] items-center rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] px-2.5 py-2',
      tone === 'amber' && 'ring-1 ring-[#FCD34D]/45',
      tone === 'red' && 'ring-1 ring-[#FCA5A5]/45',
    )}
  >
    <span className="text-[11px] text-[var(--landing-muted)]">{label}</span>
    <MicroPill label={value} tone={tone} />
  </div>
);

const MicroPill = ({
  label,
  tone,
}: {
  label: string;
  tone: 'neutral' | 'green' | 'amber' | 'red' | 'blue';
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium',
      tone === 'neutral' && 'border-[var(--landing-border)] bg-[var(--landing-surface)] text-[var(--landing-muted)]',
      tone === 'green' && 'border-[#2f5f47] bg-[#123223] text-[#6EE7B7]',
      tone === 'amber' && 'border-[#6d5523] bg-[#312613] text-[#FCD34D]',
      tone === 'red' && 'border-[#6f3232] bg-[#341919] text-[#FCA5A5]',
      tone === 'blue' && 'border-[#1b3d75] bg-[#122742] text-[#93C5FD]',
    )}
  >
    {label}
  </span>
);

const PricingCard = ({
  title,
  price,
  features,
  cta,
  featured,
}: {
  title: string;
  price: number;
  features: string[];
  cta: string;
  featured?: boolean;
}) => (
  <motion.article
    whileHover={{ y: -3 }}
    className={cn(
      'flex h-full min-h-[390px] flex-col rounded-3xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-7 shadow-[var(--landing-shadow)]',
      featured && 'md:-mt-1 md:mb-1 md:shadow-[0_0_0_1px_rgba(37,99,235,0.28),0_14px_30px_rgba(37,99,235,0.18)]',
    )}
  >
    {featured && (
      <Badge className="mb-4 w-fit rounded-full border border-[var(--landing-border)] bg-[var(--landing-surface-2)] px-3 py-1 text-xs text-[var(--landing-primary)]">
        Most Popular
      </Badge>
    )}

    <h3 className="font-display text-[26px] font-semibold">{title}</h3>
    <div className="mt-3 flex items-end gap-1">
      <p className="font-display text-[44px] font-bold leading-none">₹{price}</p>
      <span className="mb-1 text-sm text-[var(--landing-muted)]">/ month</span>
    </div>

    <ul className="mt-6 space-y-2.5 text-sm text-[var(--landing-muted)]">
      {features.map((feature) => (
        <li key={feature} className="inline-flex w-full items-start gap-2.5">
          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--landing-surface-2)] text-[var(--landing-accent)]">
            <Check className="h-3 w-3" />
          </span>
          {feature}
        </li>
      ))}
    </ul>

    <Button
      className={cn(
        'mt-auto h-11 w-full rounded-[18px] text-sm font-semibold transition-transform hover:-translate-y-0.5',
        featured
          ? 'text-white'
          : 'border border-[var(--landing-border)] bg-[var(--landing-surface-2)] text-[var(--landing-text)]',
      )}
      style={featured ? { backgroundImage: 'linear-gradient(90deg,var(--landing-primary),var(--landing-accent))' } : undefined}
    >
      {cta}
    </Button>
  </motion.article>
);

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--landing-text)]">{title}</h4>
    <ul className="mt-3 space-y-2 text-sm text-[var(--landing-muted)]">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="transition-colors hover:text-[var(--landing-text)]">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

function ActivityPulseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l2.2-5 3.6 10 2.4-5H22" />
    </svg>
  );
}
