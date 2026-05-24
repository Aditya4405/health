import { ArrowRight, CheckCircle2, FileText, Heart, ShieldAlert, Stethoscope, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const recentReports = [
  {
    id: 'r1',
    name: 'Complete Blood Count (CBC)',
    date: '2 days ago',
    type: 'Blood Test',
    status: 'ALERT',
    statusText: 'Needs Review',
    trend: 'improving',
  },
  {
    id: 'r2',
    name: 'Lipid Panel',
    date: '3 weeks ago',
    type: 'Cholesterol',
    status: 'ALERT',
    statusText: 'Needs Review',
    trend: 'attention',
  },
  {
    id: 'r3',
    name: 'Metabolic Panel',
    date: '6 weeks ago',
    type: 'Metabolic Table',
    status: 'NORMAL',
    statusText: 'All Clear',
    trend: 'stable',
  },
];

export const PatientDashboardPage = () => {
  usePageTitle('Patient Dashboard');
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Aarav';

  return (
    <DashboardLayout title="Health Companion">
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          
          {/* Main 12-Column Engineered Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Cinematic Hero panel - spans full 12 columns */}
            <article className="col-span-12 app-card relative overflow-hidden p-6 md:p-8 transition-all duration-300">
              {/* Background ambient lighting element - extremely subtle */}
              <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#0ea5e9]/10 to-[#0284c7]/10 blur-[80px] pointer-events-none dark:from-[#0ea5e9]/20 dark:to-[#0284c7]/20" />

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                  <Heart className="h-4 w-4 fill-current" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  AI Healthcare Companion
                </span>
              </div>

              <h2 className="mt-6 font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--portal-text)] leading-tight">
                Good news, {firstName} —<br />
                <span className="text-[var(--portal-muted)]">
                  your latest health markers are improving.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-xs md:text-sm leading-relaxed text-[var(--portal-muted)] font-medium">
                Your iron levels have stabilized, though cholesterol still needs attention. We suggest scheduling a brief clinic checkup.
              </p>

              {/* Layered indicators */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--portal-elevated)] border border-[var(--portal-border)] px-3 py-1 text-[10px] font-semibold tracking-wide text-amber-600 dark:text-amber-400 shadow-sm">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  LDL Cholesterol Watch
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--portal-elevated)] border border-[var(--portal-border)] px-3 py-1 text-[10px] font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Iron Levels Normal
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--portal-elevated)] border border-[var(--portal-border)] px-3 py-1 text-[10px] font-semibold tracking-wide text-[#0ea5e9] shadow-sm">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Follow-up in 2 weeks
                </span>
              </div>

              {/* Reflective Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/app/patient/upload">
                  <Button className="btn-premium-primary h-10 rounded-xl px-5 text-xs font-semibold tracking-wide transition-all duration-200">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Upload Lab Results
                  </Button>
                </Link>
                <Link to="/app/patient/chat">
                  <Button className="h-10 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:bg-[var(--portal-elevated)] px-5 text-xs font-semibold tracking-wide text-[var(--portal-text)] transition-all duration-200">
                    Consult Companion AI
                  </Button>
                </Link>
              </div>
            </article>

            {/* Things To Review - Spans 7 columns on large desktop */}
            <article className="col-span-12 lg:col-span-7 app-card app-card-hover p-6 relative overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-muted)]">Things To Review</span>
              </div>

              <h4 className="mt-3 font-display text-base font-bold text-[var(--portal-text)] tracking-tight">LDL Cholesterol</h4>
              
              <p className="mt-2 text-xs leading-relaxed text-[var(--portal-muted)] font-medium">
                Your LDL levels are slightly elevated (180 mg/dL). We recommend focusing on a fiber-rich nutrition plan and introducing regular light cardio.
              </p>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--portal-border)]">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Moderate Priority
                </span>
                <Link to="/app/patient/reports">
                  <Button size="sm" variant="ghost" className="h-8 rounded-lg border border-[var(--portal-border)] px-3.5 text-[10px] font-semibold tracking-wide text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] transition-all">
                    View Details
                  </Button>
                </Link>
              </div>
            </article>

            {/* Recommended Next Step - Spans 5 columns on large desktop */}
            <article className="col-span-12 lg:col-span-5 app-card app-card-hover p-6 relative overflow-hidden transition-all duration-300">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--portal-muted)]">Next Action</span>
              </div>

              <h4 className="mt-3 font-display text-base font-bold text-[var(--portal-text)] tracking-tight">Schedule follow-up</h4>

              <p className="mt-2 text-xs leading-relaxed text-[var(--portal-muted)] font-medium">
                Consult a general physician or cardiologist in 2 weeks to verify that your iron metrics remain stabilized.
              </p>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--portal-border)]">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#0ea5e9] font-semibold uppercase tracking-wider">
                  <Stethoscope className="h-3.5 w-3.5" />
                  Clinical Review
                </span>
                <Link to="/app/patient/doctors">
                  <Button size="sm" className="btn-premium-primary h-8 rounded-lg px-4 text-[10px] font-semibold tracking-wide">
                    Find Doctor
                  </Button>
                </Link>
              </div>
            </article>

            {/* Recent Reports Timeline Row - Spans full 12 columns */}
            <article className="col-span-12 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-[var(--portal-text)] tracking-tight">Recent Records</h3>
                  <p className="text-[10px] text-[var(--portal-muted)]">Laboratory analyses verified by MediScan AI</p>
                </div>
                <Link to="/app/patient/reports" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors">
                  Open Health History <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="app-card app-card-hover p-4 flex items-center justify-between transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--portal-elevated)] border border-[var(--portal-border)] text-[#0ea5e9]">
                        <FileText className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[var(--portal-text)] tracking-tight">{report.name}</p>
                        <p className="text-[10px] text-[var(--portal-muted)] mt-0.5">{report.type} • {report.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        "text-[9px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                        report.trend === 'improving' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                        report.trend === 'attention' && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                        report.trend === 'stable' && "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
                      )}>
                        {report.trend === 'improving' ? '↗ Stable' : report.trend === 'attention' ? '⚠ Review' : '→ Normal'}
                      </span>

                      <span className={cn(
                        "rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border shadow-sm",
                        report.status === 'ALERT'
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      )}>
                        {report.statusText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
