import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileClock, 
  CalendarDays, 
  Star, 
  Activity, 
  ShieldAlert, 
  Play, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface PatientQueueItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatarInitials: string;
  avatarBg: string;
  time: string;
  reason: string;
  urgency: 'URGENT' | 'ATTENTION' | 'STABLE';
  aiSummary: string;
  biomarkers: string[];
}

const initialQueue: PatientQueueItem[] = [
  {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    age: 29,
    gender: 'Male',
    avatarInitials: 'AK',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]',
    time: '11:30 AM',
    reason: 'Severe LDL variance follow-up',
    urgency: 'URGENT',
    aiSummary: 'LDL levels at 182 mg/dL. Recommending immediate clinical evaluation and lifestyle modifications.',
    biomarkers: ['LDL: 182 HIGH', 'Hemoglobin: 11.2 LOW'],
  },
  {
    id: 'pt-002',
    name: 'Isha Verma',
    age: 41,
    gender: 'Female',
    avatarInitials: 'IV',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]',
    time: '12:15 PM',
    reason: 'Fatigue & low hemoglobin check',
    urgency: 'ATTENTION',
    aiSummary: 'Mild microcytic anemia pattern. Hemoglobin remains low. Ferritin check recommended.',
    biomarkers: ['Hemoglobin: 10.5 LOW', 'WBC: Normal'],
  },
  {
    id: 'pt-003',
    name: 'Rohan Das',
    age: 36,
    gender: 'Male',
    avatarInitials: 'RD',
    avatarBg: 'from-[#10b981] to-[#059669]',
    time: '02:00 PM',
    reason: 'Metabolic baseline review',
    urgency: 'STABLE',
    aiSummary: 'Stable metabolic profile. Blood glucose is stable at 98 mg/dL. Monitor again in 3 months.',
    biomarkers: ['Glucose: 98 NORMAL', 'HDL: 45 NORMAL'],
  },
];

export const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<PatientQueueItem[]>(initialQueue);
  const [alerts, setAlerts] = useState([
    { id: 'a1', message: 'Critical: Aarav Kapoor LDL spike verified by AI model (Confidence 98.4%)', type: 'urgent' },
    { id: 'a2', message: 'Insight: Isha Verma shows potential iron deficiency anemias trend', type: 'info' }
  ]);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert triaged & archived.');
  };

  const handleActionToast = (action: string, patientName: string) => {
    toast.info(`Initiated ${action} for ${patientName}`);
  };

  return (
    <DashboardLayout title="Clinical Command Center">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Futuristic Clinical Hero Card */}
          <article className="app-card relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[#172033] via-[#111827] to-[#0B1020] border-[#3b82f6]/20">
            {/* Ambient cyan backdrop glow */}
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent blur-[100px] pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 -mb-10 h-40 w-80 rounded-full bg-gradient-to-tr from-[#7f77dd]/5 to-transparent blur-[60px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  Clinical OS Active
                </div>
                <h2 className="text-page-title leading-tight">
                  Good evening, <span className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">Dr. Rahul Mehta</span>.
                </h2>
                <p className="text-body-premium text-[var(--portal-muted)]">
                  You have <span className="text-[#0ea5e9] font-bold">5 pending AI-reviewed reports</span> and <span className="text-danger font-bold">{queue.filter(p => p.urgency === 'URGENT').length} high-risk patients</span> requiring active clinical sign-offs.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--portal-muted)] bg-[var(--portal-elevated)] px-2.5 py-1 rounded-md border border-[var(--portal-border)]">
                    <Clock className="h-3 w-3 text-[#0ea5e9]" /> Next session: Aarav Kapoor at 11:30 AM
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap md:flex-col gap-3 justify-end shrink-0">
                <Link to="/app/doctor/pending-reports" className="w-full sm:w-auto">
                  <button className="btn-premium btn-premium-primary w-full gap-2">
                    <Play className="h-3.5 w-3.5 fill-current" /> Triage Report Queue
                  </button>
                </Link>
                <Link to="/app/doctor/assistant" className="w-full sm:w-auto">
                  <button className="btn-premium btn-premium-secondary w-full gap-2 border-[var(--portal-border)] bg-[var(--portal-surface)]">
                    <Sparkles className="h-3.5 w-3.5 text-[#7f77dd]" /> Consult Companion AI
                  </button>
                </Link>
              </div>
            </div>
          </article>

          {/* AI Clinical Alerts Board */}
          {alerts.length > 0 && (
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-danger animate-ping" />
                <p className="text-label-premium text-[var(--portal-muted)]">Active AI Risk Telemetry</p>
              </div>
              <div className="grid gap-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200",
                      alert.type === 'urgent' 
                        ? "bg-danger/5 border-danger/20 text-danger" 
                        : "bg-[#7f77dd]/5 border-[#7f77dd]/20 text-[#7f77dd]"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                      <p className="text-xs font-semibold truncate leading-none">{alert.message}</p>
                    </div>
                    <button 
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-[10px] font-bold uppercase tracking-wider border border-current/20 hover:bg-current/5 px-2.5 py-1 rounded-md shrink-0 transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Command Stats Deck */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              icon={<Users className="h-5 w-5 text-[#0ea5e9]" />} 
              title="Patients Today" 
              value="8" 
              trend="+2 new queue"
              trendUp={true}
            />
            <StatCard 
              icon={<FileClock className="h-5 w-5 text-warning" />} 
              title="Pending Reports" 
              value="5" 
              trend="3 urgent files"
              trendUp={false}
            />
            <StatCard 
              icon={<Activity className="h-5 w-5 text-danger" />} 
              title="Critical Cases" 
              value="2" 
              trend="Monitoring live"
              trendUp={false}
            />
            <StatCard 
              icon={<BrainCircuit className="h-5 w-5 text-[#7f77dd]" />} 
              title="AI Confidence Score" 
              value="98.4%" 
              trend="Diagnostic index"
              trendUp={true}
            />
          </section>

          {/* Patients Queue Command Grid */}
          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            
            {/* Active Patient Roster */}
            <article className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-card-title text-[var(--portal-text)]">Active Patient Queue</h3>
                  <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Clinical workflow timeline for today</p>
                </div>
                <Link to="/app/doctor/patients" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0ea5e9] hover:underline">
                  All Patient Records <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3.5">
                {queue.map((patient) => (
                  <div 
                    key={patient.id} 
                    className={cn(
                      "app-card app-card-hover p-5 space-y-4 relative overflow-hidden transition-all duration-200",
                      patient.urgency === 'URGENT' && "border-danger/30 bg-danger/[0.01]",
                      patient.urgency === 'ATTENTION' && "border-warning/30 bg-warning/[0.01]"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Patient Identity */}
                      <div className="flex items-center gap-3">
                        <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white text-sm font-bold shadow-md", patient.avatarBg)}>
                          {patient.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-body-premium font-bold text-[var(--portal-text)]">{patient.name}</h4>
                            <span className="text-[10px] text-[var(--portal-muted)] font-semibold">{patient.age} y/o • {patient.gender}</span>
                          </div>
                          <p className="text-secondary-premium text-[var(--portal-muted)] flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3 w-3 text-[#0ea5e9]" /> Scheduled: {patient.time}
                          </p>
                        </div>
                      </div>

                      {/* Status Urgency Tag */}
                      <div>
                        <span className={cn(
                          "text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border",
                          patient.urgency === 'URGENT' && "bg-danger/10 text-danger border-danger/20",
                          patient.urgency === 'ATTENTION' && "bg-warning/10 text-warning border-warning/20",
                          patient.urgency === 'STABLE' && "bg-success/10 text-success border-success/20"
                        )}>
                          {patient.urgency}
                        </span>
                      </div>
                    </div>

                    {/* AI Reasoning Summary snippet */}
                    <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/60 p-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#7f77dd] uppercase tracking-wider">
                        <BrainCircuit className="h-3.5 w-3.5" />
                        AI Diagnostic Telemetry
                      </div>
                      <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed">
                        {patient.aiSummary}
                      </p>
                      {/* Biomarker highlights */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {patient.biomarkers.map((b, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-[var(--portal-surface)] border border-[var(--portal-border)] text-[var(--portal-text)] px-2 py-0.5 rounded-md">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Action CTA triggers */}
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-[var(--portal-border)]/50">
                      <Link to={`/app/doctor/analysis/${patient.id}`}>
                        <button className="btn-premium btn-premium-secondary h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          Triage Lab File
                        </button>
                      </Link>
                      <Link to={`/app/doctor/room/${patient.id}`}>
                        <button className="btn-premium btn-premium-primary h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider gap-1.5">
                          <Play className="h-2.5 w-2.5 fill-current text-white" /> Start Consult
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleActionToast('AI Biomarker check', patient.name)}
                        className="btn-premium btn-premium-ghost h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-[var(--portal-border)]"
                      >
                        AI Risk Test
                      </button>
                      <Link to={`/app/doctor/patient/${patient.id}`} className="ml-auto">
                        <button className="btn-premium btn-premium-ghost h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          Full Health Index
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Quick Actions & AI Recommendations Panel */}
            <aside className="space-y-5">
              {/* Daily Operations Quick Actions */}
              <div className="app-card p-5 space-y-4">
                <h4 className="text-card-title text-[var(--portal-text)]">Clinical Operations</h4>
                <div className="grid gap-2">
                  <button 
                    onClick={() => navigate('/app/doctor/schedule')}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 hover:bg-[#0ea5e9]/5 hover:border-[#0ea5e9]/30 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Manage Availability</p>
                      <p className="text-[10px] text-[var(--portal-muted)] mt-0.5">Toggle clinic calendar blocks</p>
                    </div>
                    <CalendarDays className="h-4.5 w-4.5 text-[#0ea5e9]" />
                  </button>
                  <button 
                    onClick={() => navigate('/app/doctor/assistant')}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 hover:bg-[#7f77dd]/5 hover:border-[#7f77dd]/30 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Clinical AI Inquiry</p>
                      <p className="text-[10px] text-[var(--portal-muted)] mt-0.5">Ask questions or write recipes</p>
                    </div>
                    <BrainCircuit className="h-4.5 w-4.5 text-[#7f77dd]" />
                  </button>
                </div>
              </div>

              {/* Practice Stats Summary */}
              <div className="app-card p-5 space-y-4 bg-gradient-to-br from-[#121620] to-[#161B2B]">
                <h4 className="text-card-title text-[var(--portal-text)]">Practice Insights</h4>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--portal-muted)]">Patient Satisfaction</span>
                    <span className="text-xs font-bold text-[var(--portal-text)]">4.9 / 5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--portal-border)] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--portal-muted)]">Weekly Triage Volume</span>
                    <span className="text-xs font-bold text-[var(--portal-text)]">43 reports</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--portal-border)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0ea5e9] rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </aside>
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }: { title: string; value: string; icon: React.ReactNode; trend: string; trendUp: boolean }) => (
  <div className="app-card p-5 hover:scale-[1.01] transition-transform duration-200">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] text-[var(--portal-muted)] font-bold uppercase tracking-wider">{title}</p>
      <span className="h-8 w-8 rounded-lg bg-[var(--portal-elevated)] border border-[var(--portal-border)] flex items-center justify-center text-[var(--portal-text)]">
        {icon}
      </span>
    </div>
    <p className="font-mono text-3xl font-extrabold text-[var(--portal-text)] mt-3 leading-none">{value}</p>
    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[var(--portal-border)]/50 text-[10px] text-[var(--portal-muted)]">
      <TrendingUp className={cn("h-3.5 w-3.5 shrink-0", trendUp ? "text-success" : "text-warning")} />
      <span className={cn("font-semibold", trendUp ? "text-success" : "text-warning")}>{trend}</span>
    </div>
  </div>
);
