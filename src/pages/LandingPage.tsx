import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CloudUpload,
  Lock,
  Menu,
  MoonStar,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/utils/cn';
import { useTheme } from '@/context/ThemeContext';

const sections = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'doctors', label: 'For Doctors' },
];

const featureCards = [
  {
    icon: BrainCircuit,
    title: 'Intelligent Report Analysis',
    body: 'Parses CBC, lipid panels, metabolic panels. Highlights values outside reference ranges with color-coded severity.',
    tag: 'Powered by Claude AI',
  },
  {
    icon: CloudUpload,
    title: 'Secure Cloud Storage',
    body: 'All reports encrypted and stored securely. Access your health history anytime from any device.',
    tag: 'HIPAA Compliant',
  },
  {
    icon: Stethoscope,
    title: 'Connect with Specialists',
    body: 'Share reports directly with verified doctors. Book consultations and receive expert guidance.',
    tag: '500+ Verified Doctors',
  },
];

const testimonials = [
  {
    quote: 'Finally understood my cholesterol report after years of confusion.',
    author: 'Priya S.',
    role: 'Software Engineer',
  },
  {
    quote: 'I use MediScan to review patient reports before consultations. Saves 20 minutes per patient.',
    author: 'Dr. Rahul M.',
    role: 'Cardiologist',
  },
  {
    quote: 'The abnormal value highlighting caught something my GP almost missed.',
    author: 'Arjun T.',
    role: 'Teacher',
  },
];

const plans = {
  monthly: {
    free: 0,
    pro: 299,
    team: 999,
  },
  annual: {
    free: 0,
    pro: 239,
    team: 799,
  },
};

const heroStats = [
  { label: 'Reports Analyzed', value: 18240, suffix: '+' },
  { label: 'Clinical Accuracy', value: 98, suffix: '%' },
  { label: 'Avg Analysis Time', value: 8, suffix: 's' },
];

const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  const oldRipple = button.getElementsByClassName('ripple')[0];
  if (oldRipple) oldRipple.remove();
  button.appendChild(circle);
};

export const LandingPage = () => {
  usePageTitle('MediScan AI');

  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursor, setCursor] = useState({ x: -120, y: -120 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const heroParticles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 10 + 4}px`,
        delay: `${Math.random() * 8}s`,
      })),
    [],
  );

  const prices = annualBilling ? plans.annual : plans.monthly;
  const carouselCards = useMemo(
    () => Array.from({ length: 3 }, (_, index) => testimonials[(activeTestimonial + index) % testimonials.length]),
    [activeTestimonial],
  );

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      setIsScrolled(top > 12);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (top / height) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(progress, 100)));
    };

    const onMove = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] text-[#0F172A] transition-colors duration-400 dark:bg-[#020617] dark:text-[#F8FAFC]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.15), transparent 36%), radial-gradient(circle at 82% 24%, rgba(6,182,212,0.17), transparent 40%), radial-gradient(circle at 48% 80%, rgba(59,130,246,0.12), transparent 44%)',
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] dark:opacity-[0.06] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:3px_3px]" />
      <motion.div
        className="pointer-events-none fixed z-0 hidden h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.35),transparent_70%)] blur-2xl md:block"
        animate={{ x: cursor.x - 96, y: cursor.y - 96 }}
        transition={{ type: 'spring', stiffness: 90, damping: 24, mass: 0.5 }}
      />

      <div className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-40 border-b transition-all duration-300',
          isScrolled
            ? 'border-[#E2E8F0] bg-white/82 shadow-[0_10px_40px_rgba(15,23,42,0.07)] backdrop-blur-[14px] dark:border-white/10 dark:bg-[#020617]/78'
            : 'border-transparent bg-white/45 backdrop-blur-[14px] dark:bg-[#020617]/42',
        )}
      >
        <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#cfe1fd] bg-white/85 text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.18)] dark:border-white/15 dark:bg-[#0F172A]/75 dark:text-[#60A5FA]">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563EB]/18 to-[#06B6D4]/22" />
              <ActivityPulseIcon className="relative z-10 h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-[#06B6D4]" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">MediScan AI</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group relative text-sm font-medium text-[#334155] transition-colors hover:text-[#2563EB] dark:text-[#CBD5E1] dark:hover:text-[#7DD3FC]"
              >
                {section.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f8] bg-white/80 text-[#2563EB] transition hover:scale-105 hover:border-[#9ac3ff] hover:bg-[#eff6ff] dark:border-white/15 dark:bg-[#111827]/70 dark:text-[#7DD3FC] dark:hover:bg-[#17233a]"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <MoonStar className="h-4.5 w-4.5" />}
            </button>
            <Link to="/signup">
              <Button
                className="relative h-[52px] overflow-hidden rounded-full border border-[#6ea7ff] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-7 text-base font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.32)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(6,182,212,0.35)]"
                onClick={createRipple}
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-[#E2E8F0] bg-white/95 px-4 pb-4 pt-2 backdrop-blur-xl dark:border-white/10 dark:bg-[#020617]/90 md:hidden"
            >
              <div className="flex flex-col gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#eff6ff] dark:text-[#d7e6f6] dark:hover:bg-[#0f1f38]"
                  >
                    {section.label}
                  </a>
                ))}
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="mt-2 h-11 w-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Get Started Free</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        <section className="relative overflow-hidden px-4 pb-24 pt-36 lg:px-8 lg:pb-28 lg:pt-40">
          {heroParticles.map((particle) => (
            <span
              key={particle.id}
              className="particle opacity-65 dark:opacity-40"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDelay: particle.delay,
              }}
            />
          ))}

          <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28),transparent_68%)] blur-2xl" />
          <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.24),transparent_70%)] blur-2xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.07fr_0.93fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <Badge className="mb-6 rounded-full border border-[#cde1fc] bg-white/85 px-4 py-1.5 text-sm font-semibold text-[#2563EB] shadow-sm dark:border-white/15 dark:bg-[#0F172A]/80 dark:text-[#7DD3FC]">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                AI Powered Clinical Analysis
              </Badge>
              <h1 className="font-display text-[clamp(48px,7vw,78px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0F172A] dark:text-[#F8FAFC]">
                Understand Your{' '}
                <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                  Health Reports
                </span>{' '}
                Instantly
              </h1>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                Upload any medical report. Our AI extracts key metrics, flags abnormal values, and explains results in plain language
                in seconds.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="relative h-[52px] overflow-hidden rounded-full border border-[#7ab3ff] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-7 text-base font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02]"
                    onClick={createRipple}
                  >
                    Upload Report <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-[52px] rounded-full border border-[#dbe7f6] bg-white/90 px-7 text-base font-semibold text-[#0F172A] shadow-[0_10px_28px_rgba(15,23,42,0.08)] hover:bg-white dark:border-white/15 dark:bg-[#111827]/80 dark:text-[#E2E8F0] dark:hover:bg-[#17233a]"
                >
                  <PlayCircle className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#22D3EE]" /> HIPAA Compliant
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-[#22D3EE]" /> 256-bit Encryption
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[#22D3EE]" /> SOC2 Certified
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <motion.div
                className="absolute left-4 right-4 top-6 h-full rounded-[32px] border border-[#abd0ff] bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 blur-xl dark:border-[#204a7a]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -left-8 top-28 hidden rounded-2xl border border-white/45 bg-white/65 p-4 shadow-[0_18px_50px_rgba(37,99,235,0.18)] backdrop-blur-lg dark:border-white/10 dark:bg-[#111827]/72 lg:block"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">AI Confidence</p>
                <p className="text-xl font-bold text-[#0F172A] dark:text-white">99.2%</p>
              </motion.div>
              <motion.div
                className="absolute -right-6 bottom-10 hidden rounded-2xl border border-white/45 bg-white/65 p-4 shadow-[0_18px_50px_rgba(6,182,212,0.18)] backdrop-blur-lg dark:border-white/10 dark:bg-[#111827]/72 lg:block"
                animate={{ y: [0, -11, 0] }}
                transition={{ duration: 4.9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              >
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Flags Detected</p>
                <p className="text-xl font-bold text-[#0F172A] dark:text-white">2 Alerts</p>
              </motion.div>

              <div className="relative rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0F172A]/78">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Live Clinical Dashboard</p>
                    <p className="font-display text-xl font-semibold">CBC Analysis</p>
                  </div>
                  <Badge className="rounded-full border border-[#9fe6f5] bg-[#e6fbff] text-[#0b7f95] shadow-sm dark:border-[#184f5b] dark:bg-[#08252b] dark:text-[#67d9eb]">
                    Processing Complete
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-[#dbe9fc] bg-white/80 px-3 py-3 dark:border-white/10 dark:bg-[#111827]/72"
                    >
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{stat.label}</p>
                      <p className="mt-1 text-lg font-semibold">
                        <AnimatedCount target={stat.value} />
                        {stat.suffix}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <MetricRow label="Hemoglobin" value="11.2 g/dL" status="Low" tone="amber" />
                  <MetricRow label="WBC" value="7,200 /uL" status="Normal" tone="green" />
                  <MetricRow label="LDL" value="182 mg/dL" status="High" tone="red" />
                </div>

                <p className="mt-4 rounded-2xl border border-[#d6e7fc] bg-[#f1f8ff] p-3 text-sm text-[#475d74] dark:border-white/10 dark:bg-[#17233a] dark:text-[#c7d7e8]">
                  AI Summary: Mild anemia and elevated LDL detected. Recommend hematology consultation and dietary optimization.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="mb-10 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB] dark:text-[#38BDF8]">What We Do</p>
            <h2 className="mt-3 font-display text-[clamp(32px,4.2vw,48px)] font-bold leading-tight">
              Everything you need to manage your health
            </h2>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-12">
            {featureCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.13 }}
                whileHover={{ y: -6, rotateX: 3.5, rotateY: index % 2 === 0 ? -2 : 2 }}
                className={cn(
                  'group relative overflow-hidden rounded-[26px] border border-[#dbe7f6] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111827]/70',
                  index === 0 ? 'lg:col-span-6' : 'lg:col-span-3',
                )}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="absolute -right-8 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-[#3B82F6]/30 to-[#22D3EE]/25 blur-2xl" />
                </span>
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-[0_10px_25px_rgba(37,99,235,0.36)]">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{feature.body}</p>
                <Badge className="mt-6 rounded-full border border-[#cde1fc] bg-[#f2f8ff] text-[#2563EB] dark:border-white/10 dark:bg-[#17233a] dark:text-[#67cfff]">
                  {feature.tag}
                </Badge>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="relative overflow-hidden bg-[#EEF4FA] px-4 py-24 dark:bg-[#071426] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-display text-[clamp(32px,4.2vw,48px)] font-bold">From upload to insights in 3 steps</h2>
            <div className="relative mt-14 grid gap-5 lg:grid-cols-3">
              <motion.span
                className="absolute left-[16%] right-[16%] top-[46px] hidden h-px bg-gradient-to-r from-[#60A5FA]/30 via-[#06B6D4] to-[#60A5FA]/30 lg:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                style={{ transformOrigin: 'left' }}
                transition={{ duration: 1 }}
              />

              {[
                {
                  number: '01',
                  icon: CloudUpload,
                  title: 'Upload Your Report',
                  body: 'Drag & drop PDF or image of your medical report',
                },
                {
                  number: '02',
                  icon: BrainCircuit,
                  title: 'AI Analyzes It',
                  body: 'Our model reads every value and compares to clinical reference ranges',
                },
                {
                  number: '03',
                  icon: Sparkles,
                  title: 'Review Insights',
                  body: 'Get a clear summary with flagged values, trends, and next-step recommendations',
                },
              ].map((step, index) => (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.16 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-[24px] border border-[#d5e3f4] bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.09)] backdrop-blur dark:border-white/10 dark:bg-[#0F172A]/80"
                >
                  <p className="pointer-events-none absolute right-3 top-2 font-display text-7xl font-bold leading-none text-[#2563EB]/10">
                    {step.number}
                  </p>
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-lg">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-[16px] text-[#64748B] dark:text-[#94A3B8]">{step.body}</p>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="mb-9 text-center">
            <h2 className="font-display text-[clamp(32px,4.2vw,48px)] font-bold">Trusted by patients and doctors</h2>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-[#d8e6f5] bg-white/72 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0F172A]/78 lg:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {carouselCards.map((testimonial, index) => (
                <motion.article
                  key={`${testimonial.author}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl border border-[#dbe7f6] bg-white/80 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.09)] dark:border-white/10 dark:bg-[#111827]/82"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Quote className="h-5 w-5 text-[#22D3EE]" />
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[16px] italic leading-relaxed text-[#475569] dark:text-[#CBD5E1]">"{testimonial.quote}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-sm font-semibold text-white">
                      {testimonial.author
                        .split(' ')
                        .map((token) => token[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    index === activeTestimonial ? 'w-8 bg-[#2563EB] dark:bg-[#22D3EE]' : 'w-2 bg-[#c5d8ef] dark:bg-[#334155]',
                  )}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative overflow-hidden bg-[#EFF4FA] px-4 py-24 dark:bg-[#071426] lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-[clamp(32px,4.2vw,48px)] font-bold">Simple, transparent pricing</h2>
              <div className="inline-flex items-center gap-3 rounded-full border border-[#d7e6f7] bg-white/85 px-4 py-2 shadow-sm dark:border-white/10 dark:bg-[#111827]/70">
                <span className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Monthly</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={annualBilling}
                  onClick={() => setAnnualBilling((value) => !value)}
                  className={cn(
                    'focus-ring relative h-7 w-12 rounded-full transition-colors',
                    annualBilling ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4]' : 'bg-[#c4d7ee] dark:bg-[#334155]',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
                      annualBilling ? 'translate-x-[22px]' : 'translate-x-0.5',
                    )}
                  />
                </button>
                <span className="text-sm font-medium text-[#2563EB] dark:text-[#67d9eb]">Annual (save 20%)</span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <PricingCard
                title="Free"
                price={prices.free}
                cta="Start Free"
                features={['3 reports/month', 'Basic AI Summary', '1GB storage']}
              />
              <PricingCard
                title="Pro"
                price={prices.pro}
                cta="Upgrade to Pro"
                featured
                badge="Most Popular"
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
      </main>

      <footer id="doctors" className="relative z-10 border-t border-[#d9e7f4] bg-white px-4 pb-8 pt-20 dark:border-white/10 dark:bg-[#020617] lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 overflow-hidden rounded-[30px] border border-[#cfe2fb] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] p-8 text-white shadow-[0_26px_60px_rgba(37,99,235,0.35)] dark:border-white/10">
            <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="font-display text-3xl font-bold">Ready to understand your reports smarter?</p>
                <p className="mt-2 text-white/90">Experience premium AI-powered report insights in less than a minute.</p>
              </div>
              <Link to="/signup">
                <Button className="h-[52px] rounded-full bg-white px-7 text-base font-semibold text-[#0F172A] shadow-xl hover:bg-[#f8fbff]">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white">
                  <ActivityPulseIcon className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-semibold">MediScan AI</span>
              </div>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Clinical-grade trust with modern AI clarity for every patient and provider.
              </p>
            </div>
            <FooterColumn title="Product" links={['Features', 'Pricing', 'For Doctors', 'API']} />
            <FooterColumn title="Company" links={['About', 'Careers', 'Blog', 'Contact']} />
            <FooterColumn title="Legal" links={['Privacy Policy', 'Terms', 'Security', 'HIPAA']} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#dbe8f6] pt-6 text-sm text-[#64748B] dark:border-white/10 dark:text-[#94A3B8]">
            <p>© {new Date().getFullYear()} MediScan AI. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {['X', 'LinkedIn', 'GitHub'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="rounded-full border border-[#d5e5f7] px-3 py-1.5 transition hover:border-[#9fc4f8] hover:bg-[#eff6ff] dark:border-white/15 dark:hover:bg-[#111827]"
                >
                  {platform}
                </a>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d5e5f7] hover:bg-[#eff6ff] dark:border-white/15 dark:hover:bg-[#111827]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MetricRow = ({
  label,
  value,
  status,
  tone,
}: {
  label: string;
  value: string;
  status: string;
  tone: 'green' | 'amber' | 'red';
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-[#d8e8fa] bg-white/75 px-3 py-2.5 dark:border-white/10 dark:bg-[#111827]/65">
    <p className="text-sm text-[#475569] dark:text-[#CBD5E1]">{label}</p>
    <div className="inline-flex items-center gap-2">
      <span className="metric text-sm font-semibold">{value}</span>
      <Badge
        className={cn(
          'rounded-full border px-2.5 py-0.5 text-xs font-semibold',
          tone === 'green' && 'border-[#badc99] bg-[#eaf7df] text-[#3f6f17] dark:border-[#3b5a2a] dark:bg-[#14210f] dark:text-[#8ec45d]',
          tone === 'amber' && 'border-[#f1d293] bg-[#fff5dc] text-[#85520f] dark:border-[#5b4721] dark:bg-[#251c0b] dark:text-[#f3cb7b]',
          tone === 'red' && 'border-[#f2b8b8] bg-[#ffeded] text-[#9f2d2d] dark:border-[#633434] dark:bg-[#2a1313] dark:text-[#f6a9a9]',
        )}
      >
        {status}
      </Badge>
    </div>
  </div>
);

const PricingCard = ({
  title,
  price,
  features,
  cta,
  featured,
  badge,
}: {
  title: string;
  price: number;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}) => (
  <motion.article
    whileHover={{ y: -6 }}
    className={cn(
      'relative overflow-hidden rounded-[28px] border bg-white/82 p-7 shadow-[0_20px_45px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:bg-[#111827]/72',
      featured
        ? 'scale-[1.01] border-[#60A5FA] shadow-[0_30px_70px_rgba(37,99,235,0.25)] dark:border-[#2b72d8]'
        : 'border-[#d7e6f7] dark:border-white/10',
    )}
  >
    {badge && (
      <Badge className="absolute left-6 top-5 rounded-full border border-[#8bc5ff] bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-[#2563EB] dark:border-[#2a5a8f] dark:bg-[#0f2340] dark:text-[#7ec8ff]">
        {badge}
      </Badge>
    )}
    <p className="font-display text-2xl font-semibold">{title}</p>
    <div className="mt-4 flex items-end gap-1">
      <span className="font-display text-5xl font-extrabold tracking-tight">₹{price}</span>
      <span className="pb-1 text-sm text-[#64748B] dark:text-[#94A3B8]">/ month</span>
    </div>
    <ul className="mt-7 space-y-3 text-sm">
      {features.map((feature) => (
        <li key={feature} className="inline-flex w-full items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
          {feature}
        </li>
      ))}
    </ul>
    <Button
      className={cn(
        'mt-8 h-[50px] w-full rounded-full text-base font-semibold transition-all',
        featured
          ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-[0_15px_35px_rgba(37,99,235,0.3)]'
          : 'border border-[#cde1fa] bg-white text-[#0F172A] hover:bg-[#eff6ff] dark:border-white/10 dark:bg-[#0F172A] dark:text-white dark:hover:bg-[#17233a]',
      )}
    >
      {cta}
    </Button>
  </motion.article>
);

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h4 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#2563EB] dark:text-[#67cfff]">{title}</h4>
    <ul className="mt-3 space-y-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="transition-colors hover:text-[#2563EB] dark:hover:text-[#67cfff]">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const AnimatedCount = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1600;
    const start = performance.now();

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      setValue(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <>{value.toLocaleString()}</>;
};

function ActivityPulseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h4l2.2-5 3.6 10 2.4-5H22" />
    </svg>
  );
}
