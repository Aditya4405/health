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
  Stethoscope,
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
    title: 'Intelligent Report Analysis',
    body: 'Clinical AI parses labs, panels, and reference intervals with explainable insight trails.',
    icon: BrainCircuit,
    span: 'lg:col-span-7 lg:row-span-2',
    preview: 'CBC, Lipid, Thyroid, Metabolic',
  },
  {
    title: 'AI Health Risk Detection',
    body: 'Flags critical trends early with confidence context and abnormality prioritization.',
    icon: Sparkles,
    span: 'lg:col-span-5',
    preview: 'Risk tags + triage scoring',
  },
  {
    title: 'Secure Medical Vault',
    body: 'Encrypted storage built for long-term health history and compliant audit controls.',
    icon: Lock,
    span: 'lg:col-span-5',
    preview: 'SOC2 + HIPAA controls',
  },
  {
    title: 'Doctor Collaboration',
    body: 'Share cases with specialists and maintain a clear recommendation thread.',
    icon: UserRound,
    span: 'lg:col-span-4',
    preview: 'Shared notes + consult handoff',
  },
  {
    title: 'Long-Term Health Tracking',
    body: 'Monitor biomarker trajectory and compare report evolution over time.',
    icon: CloudUpload,
    span: 'lg:col-span-8',
    preview: 'Timeline and trend snapshots',
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
    body: 'Our model extracts values, cross-checks references, and identifies clinical anomalies.',
    icon: BrainCircuit,
  },
  {
    number: '03',
    title: 'Receive Clinical Insights',
    body: 'Get plain-language explanations, risk indicators, and recommended next actions.',
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
    explanation: 'Below optimal range. This pattern may indicate iron deficiency anemia and warrants follow-up.',
    recommendation: 'Increase iron intake and schedule CBC retest in 4 weeks.',
  },
  {
    id: 'ldl',
    marker: 'LDL Cholesterol',
    value: '182 mg/dL',
    status: 'High',
    explanation: 'LDL is above target threshold and may elevate cardiovascular risk over time.',
    recommendation: 'Discuss lipid management plan and preventive cardio consultation.',
  },
  {
    id: 'ferritin',
    marker: 'Ferritin',
    value: '18 ng/mL',
    status: 'Low',
    explanation: 'Ferritin is trending low, suggesting reduced iron reserves despite stable WBC profile.',
    recommendation: 'Review diet and iron supplementation strategy with clinician.',
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
      Array.from({ length: 16 }, (_, index) => ({
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
    <div className="bg-[#050816] text-[#F8FAFC]">
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 h-[72px] border-b border-white/10 bg-[#050816] transition-shadow duration-300',
          scrolled && 'shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F172A] text-[#F8FAFC]">
              <ActivityPulseIcon className="h-4.5 w-4.5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#06B6D4]" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">MediScan AI</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-[#CBD5E1] transition-colors hover:text-white"
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
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0F172A] text-[#CBD5E1] transition-transform hover:-translate-y-0.5 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <Link to="/signup">
              <Button className="h-11 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)] transition-transform hover:-translate-y-0.5">
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
              className="border-t border-white/10 bg-[#050816] px-4 py-3 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:bg-white/5"
                  >
                    {section.label}
                  </a>
                ))}
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="mt-2 h-11 w-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Get Started Free</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-[120px] pt-[136px] lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(37,99,235,0.18),transparent_38%)]" />
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/20"
              style={{ left: particle.x, top: particle.y }}
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.65, 0.2] }}
              transition={{ duration: particle.duration, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.03fr_0.97fr]">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-6 rounded-full border border-white/10 bg-[#0F172A] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#CBD5E1]">
                AI-Powered Clinical Intelligence
              </Badge>

              <h1 className="max-w-2xl font-display text-[clamp(46px,7vw,78px)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                Understand Medical Reports With{' '}
                <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">Clinical Precision</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#CBD5E1]">
                Upload lab reports and receive AI-powered insights, abnormality detection, and simplified clinical explanations instantly.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button className="h-12 rounded-[18px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-7 text-base font-semibold transition-transform hover:-translate-y-0.5">
                    Upload Report <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Button className="h-12 rounded-[18px] border border-white/10 bg-[#0F172A] px-7 text-base font-semibold text-[#F8FAFC] transition-transform hover:-translate-y-0.5 hover:bg-[#111827]">
                  <PlayCircle className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#94A3B8]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#06B6D4]" /> HIPAA Compliant
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#06B6D4]" /> SOC2 Certified
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-[#06B6D4]" /> 256-bit Encryption
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="relative rounded-[28px] border border-white/10 bg-[#111827] p-6 shadow-[0_14px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-[#94A3B8]">Live AI Clinical Scan</p>
                <Badge className="rounded-full border border-white/10 bg-[#0F172A] text-[#CBD5E1]">AI Confidence: 98%</Badge>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] p-4">
                <motion.div
                  className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#06B6D4]/22 to-transparent"
                  animate={{ y: ['-20%', '110%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="space-y-2 text-sm">
                  <ReportRow label="Hemoglobin" value="11.2 g/dL" tone="amber" />
                  <ReportRow label="LDL Cholesterol" value="182 mg/dL" tone="red" />
                  <ReportRow label="Ferritin" value="18 ng/mL" tone="amber" />
                  <ReportRow label="WBC" value="7,200 /uL" tone="green" />
                  <ReportRow label="Platelets" value="280,000 /uL" tone="green" />
                </div>

                <motion.div className="absolute -right-2 top-8 rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-[#CBD5E1]" animate={{ y: [0, -5, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                  Low Hemoglobin Detected
                </motion.div>
                <motion.div className="absolute -left-2 top-24 rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-[#CBD5E1]" animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: 0.2 }}>
                  High LDL Risk
                </motion.div>
                <motion.div className="absolute bottom-4 right-5 rounded-xl border border-white/10 bg-[#111827] px-3 py-2 text-xs text-[#CBD5E1]" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.9, repeat: Infinity, delay: 0.3 }}>
                  Iron Deficiency Indicators
                </motion.div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0F172A] p-4">
                <p className="text-sm text-[#94A3B8]">AI Recommendation</p>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  Pattern indicates mild anemia with elevated LDL. Suggested next step: hematology follow-up and cardio-preventive consultation.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">Platform Capabilities</p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
              Clinical intelligence built into every step of report understanding
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12 lg:auto-rows-[220px]">
            {bentoFeatures.map((feature, idx) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className={cn('rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-[0_10px_22px_rgba(0,0,0,0.28)]', feature.span)}
              >
                <feature.icon className="mb-5 h-6 w-6 text-[#06B6D4]" />
                <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#CBD5E1]">{feature.body}</p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#94A3B8]">{feature.preview}</div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">Interactive AI Demo</p>
              <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
                Watch MediScan explain biomarkers like a clinical AI assistant
              </h2>
              <p className="mt-5 max-w-xl text-lg text-[#CBD5E1]">
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
                      'focus-ring flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors',
                      activeInsight.id === item.id ? 'border-[#2563EB] bg-[#0F172A]' : 'border-white/10 bg-[#111827] hover:border-white/20',
                    )}
                  >
                    <span>
                      <p className="font-medium text-[#F8FAFC]">{item.marker}</p>
                      <p className="text-sm text-[#94A3B8]">{item.value}</p>
                    </span>
                    <span className="text-sm text-[#06B6D4]">{item.status}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.div key={activeInsight.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-[#111827] p-8">
              <p className="text-xs uppercase tracking-[0.12em] text-[#94A3B8]">AI Clinical Interpretation</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{activeInsight.marker}</h3>
              <p className="mt-4 text-base leading-relaxed text-[#CBD5E1]">{activeInsight.explanation}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F172A] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#94A3B8]">Recommendation</p>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">{activeInsight.recommendation}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-white/10 bg-[#0F172A] px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-display text-[clamp(34px,4.5vw,52px)] font-bold">From upload to insight in three steps</h2>
            <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
              <span className="absolute left-[18%] right-[18%] top-11 hidden h-px bg-white/15 lg:block" />
              {steps.map((step, idx) => (
                <motion.article key={step.number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }} className="relative rounded-3xl border border-white/10 bg-[#111827] p-8">
                  <p className="absolute right-5 top-4 font-display text-6xl font-bold text-white/5">{step.number}</p>
                  <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-[#06B6D4]">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-base text-[#CBD5E1]">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto max-w-7xl px-4 py-[120px] lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">Why MediScan AI</p>
              <h2 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-bold leading-tight">
                Medical Reports Shouldn't Feel Impossible To Understand
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[#CBD5E1]">
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
                <motion.div key={item} initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-[#CBD5E1]">
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
              <motion.article key={testimonial.author} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} whileHover={{ y: -4 }} className="rounded-3xl bg-white p-8 text-[#0F172A] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <div className="mb-3 flex items-center gap-1 text-[#2563EB]">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Check key={starIdx} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-y border-white/10 bg-[#0F172A] px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-[clamp(34px,4.5vw,52px)] font-bold">Simple pricing for every stage</h2>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#111827] px-4 py-2">
                <span className="text-sm text-[#94A3B8]">Monthly</span>
                <button type="button" role="switch" aria-checked={yearly} onClick={() => setYearly((value) => !value)} className={cn('focus-ring relative h-6 w-11 rounded-full transition-colors', yearly ? 'bg-[#2563EB]' : 'bg-[#334155]')}>
                  <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', yearly ? 'translate-x-5' : 'translate-x-0.5')} />
                </button>
                <span className="text-sm text-[#94A3B8]">Yearly 20% off</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <PricingCard title="Free" price={prices.free} cta="Start Free" features={['3 reports/month', 'Basic AI Summary', '1GB storage']} />
              <PricingCard title="Pro" price={prices.pro} cta="Upgrade to Pro" featured features={['Unlimited reports', 'Full AI Analysis', '10GB storage', 'Doctor Connect']} />
              <PricingCard title="Team" price={prices.team} cta="Choose Team" features={['Everything in Pro', '5 users', 'Priority support', 'Admin panel']} />
            </div>
          </div>
        </section>

        <section className="px-4 py-[120px] lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_40%),#111827] p-10 shadow-[0_10px_24px_rgba(0,0,0,0.35)] lg:p-14">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-[clamp(30px,4vw,46px)] font-bold leading-tight">Ready To Understand Your Health Smarter?</h2>
                <p className="mt-3 text-lg text-[#CBD5E1]">AI-powered medical intelligence in seconds.</p>
              </div>
              <Link to="/signup">
                <Button className="h-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-7 text-base font-semibold transition-transform hover:-translate-y-0.5">
                  Upload Your First Report
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 pb-10 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827]">
                  <ActivityPulseIcon className="h-4.5 w-4.5" />
                </span>
                <span className="font-display text-base font-semibold">MediScan AI</span>
              </div>
              <p className="text-sm leading-relaxed text-[#94A3B8]">
                Premium AI healthcare platform turning complex reports into trusted clinical insight.
              </p>
            </div>
            <FooterColumn title="Product" links={['Features', 'How It Works', 'Security', 'Pricing']} />
            <FooterColumn title="Company" links={['About', 'Careers', 'Blog', 'Contact']} />
            <FooterColumn title="Legal" links={['Privacy Policy', 'Terms', 'Security', 'HIPAA']} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-[#94A3B8]">
            <p>Copyright {new Date().getFullYear()} MediScan AI. All rights reserved.</p>
            <div className="flex items-center gap-2">
              {['X', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-[#0F172A]">
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
  <div className="grid grid-cols-[1fr_auto] items-center rounded-xl border border-white/10 bg-[#111827] px-3 py-2">
    <span className="text-sm text-[#CBD5E1]">{label}</span>
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs',
        tone === 'green' && 'bg-[#123223] text-[#6EE7B7]',
        tone === 'amber' && 'bg-[#30250f] text-[#FCD34D]',
        tone === 'red' && 'bg-[#351a1a] text-[#FCA5A5]',
      )}
    >
      {value}
    </span>
  </div>
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
    whileHover={{ y: -4 }}
    className={cn(
      'rounded-3xl border border-white/10 bg-[#111827] p-8',
      featured && 'md:-mt-2 md:mb-2 md:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_18px_40px_rgba(37,99,235,0.18)]',
    )}
  >
    {featured && (
      <Badge className="mb-4 rounded-full border border-[#1f3350] bg-[#0F172A] px-3 py-1 text-xs text-[#CBD5E1]">Most Popular</Badge>
    )}
    <h3 className="font-display text-2xl font-semibold">{title}</h3>
    <div className="mt-4 flex items-end gap-1">
      <p className="font-display text-5xl font-bold">INR {price}</p>
      <span className="mb-1 text-sm text-[#94A3B8]">/ month</span>
    </div>
    <ul className="mt-8 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="inline-flex w-full items-start gap-2 text-sm text-[#CBD5E1]">
          <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0F172A] text-[#06B6D4]">
            <Check className="h-3 w-3" />
          </span>
          {feature}
        </li>
      ))}
    </ul>
    <Button
      className={cn(
        'mt-8 h-11 w-full rounded-[18px] text-sm font-semibold',
        featured
          ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white'
          : 'border border-white/10 bg-[#0F172A] text-white hover:bg-[#172033]',
      )}
    >
      {cta}
    </Button>
  </motion.article>
);

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[#CBD5E1]">{title}</h4>
    <ul className="mt-3 space-y-2 text-sm text-[#94A3B8]">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="transition-colors hover:text-white">
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

