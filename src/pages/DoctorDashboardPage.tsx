import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileClock, 
  CalendarDays, 
  Activity, 
  ShieldAlert, 
  Play, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  BrainCircuit,
  Sparkles,
  MessageSquare,
  BadgeAlert
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface TimelineAppointment {
  time: string;
  patientId: string;
  patientName: string;
  age: number;
  reason: string;
  type: 'Consultation' | 'Follow Up' | 'Emergency';
  urgency: 'URGENT' | 'ATTENTION' | 'STABLE';
}

const todayTimeline: TimelineAppointment[] = [
  { time: '09:00 AM', patientId: 'pt-001', patientName: 'Aarav Kapoor', age: 29, reason: 'LDL lipid level spike follow-up', type: 'Emergency', urgency: 'URGENT' },
  { time: '10:30 AM', patientId: 'pt-002', patientName: 'Isha Verma', age: 41, reason: 'Fatigue & microcytic anemia review', type: 'Consultation', urgency: 'ATTENTION' },
  { time: '12:00 PM', patientId: 'pt-003', patientName: 'Rohan Das', age: 36, reason: 'Metabolic panels check', type: 'Follow Up', urgency: 'STABLE' },
  { time: '02:30 PM', patientId: 'pt-004', patientName: 'Karan Malhotra', age: 52, reason: 'Hypertension thresholds test', type: 'Consultation', urgency: 'URGENT' }
];

export const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<TimelineAppointment[]>(todayTimeline);
  const [alerts, setAlerts] = useState([
    { id: 'a1', patientId: 'pt-001', patientName: 'Aarav Kapoor', risk: 'CRITICAL', trigger: 'LDL Cholesterol spike: 182 mg/dL', confidence: 98.4 },
    { id: 'a2', patientId: 'pt-002', patientName: 'Isha Verma', risk: 'HIGH RISK', trigger: 'Hemoglobin count critical: 10.5 g/dL', confidence: 96.2 },
    { id: 'a3', patientId: 'pt-004', patientName: 'Karan Malhotra', risk: 'HIGH RISK', trigger: 'Blood Pressure anomaly: 145 mmHg', confidence: 95.0 }
  ]);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alert triaged & archived.');
  };

  return (
    <DashboardLayout title="Clinical Dashboard">
      <PageTransition>
        <div className="space-y-5 text-[var(--portal-text)]">
          
          {/* ZONE 1: Doctor Greeting & AI Summary Hub */}
          <article className="app-card relative overflow-hidden p-4 sm:p-5 bg-[var(--portal-surface)] border-[var(--portal-border)] shadow-md">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gradient-to-tr from-[#0ea5e9]/5 to-transparent blur-[80px] pointer-events-none" />
            
            <div className="grid gap-4 md:grid-cols-12 relative z-10">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/10 bg-sky-500/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0ea5e9]">
                  <BrainCircuit className="h-3 w-3 animate-pulse" />
                  Clinical Operating System
                </div>
                <h2 className="text-page-title leading-tight text-[var(--portal-text)]">
                  Good Evening, <span className="bg-gradient-to-r from-[#0ea5e9] to-[#7f77dd] bg-clip-text text-transparent">Dr. Rahul Mehta</span>
                </h2>
                
                {/* AI Assistant Summary - Concise */}
                <div className="rounded-lg border border-[var(--portal-border)] bg-[var(--portal-elevated)]/40 p-2.5 text-xs text-[var(--portal-muted)] mt-2 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#7f77dd] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--portal-text)] mr-1">AI Clinical Summary:</span>
                    3 critical anomalies require immediate triage (LDL levels &gt; 180 for Aarav Kapoor, hemoglobin level 10.5 for Isha Verma).
                  </div>
                </div>
              </div>

              {/* Status Stats Block */}
              <div className="md:col-span-5 flex flex-col justify-between gap-3 md:border-l md:border-[var(--portal-border)]/40 md:pl-5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-[var(--portal-surface)] border border-[var(--portal-border)] text-center">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Consults</p>
                    <p className="font-mono text-base font-bold text-emerald-400 mt-1">8 Today</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--portal-surface)] border border-[var(--portal-border)] text-center">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Pending</p>
                    <p className="font-mono text-base font-bold text-[#7f77dd] mt-1">5 Files</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--portal-surface)] border border-[var(--portal-border)] text-center">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Critical</p>
                    <p className="font-mono text-base font-bold text-red-500 mt-1">3 Cases</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 w-full justify-end">
                  <Link to="/app/doctor/pending-reports" className="flex-1 sm:flex-initial">
                    <button className="btn-premium btn-premium-primary h-8 px-3.5 gap-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider w-full select-none cursor-pointer">
                      <Play className="h-3 w-3 fill-current" /> Triage Queue
                    </button>
                  </Link>
                  <Link to="/app/doctor/assistant" className="flex-1 sm:flex-initial">
                    <button className="btn-premium btn-premium-secondary h-8 px-3.5 gap-1.5 border-[var(--portal-border)] bg-[var(--portal-surface)] text-[10px] font-bold uppercase tracking-wider text-[var(--portal-muted)] w-full select-none cursor-pointer">
                      Ask AI
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* ZONE 1.5: Premium Metric Grid with Sparklines */}
          <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <div className="app-card app-card-hover p-4 flex flex-col justify-between gap-2 shadow-sm">
              <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Patients Today</p>
              <div className="flex items-end justify-between mt-1">
                <div className="space-y-1">
                  <h3 className="font-mono text-2xl font-extrabold text-[var(--portal-text)]">8</h3>
                  <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">+12.5%</span>
                </div>
                <svg className="h-7 w-20 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0,25 Q15,5 30,15 T60,10 T90,20 L100,5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="app-card app-card-hover p-4 flex flex-col justify-between gap-2 shadow-sm">
              <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Pending Reports</p>
              <div className="flex items-end justify-between mt-1">
                <div className="space-y-1">
                  <h3 className="font-mono text-2xl font-extrabold text-[var(--portal-text)]">5</h3>
                  <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">-15.2%</span>
                </div>
                <svg className="h-7 w-20 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0,5 Q15,20 30,12 T60,22 T90,8 L100,25" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="app-card app-card-hover p-4 flex flex-col justify-between gap-2 shadow-sm">
              <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Critical Cases</p>
              <div className="flex items-end justify-between mt-1">
                <div className="space-y-1">
                  <h3 className="font-mono text-2xl font-extrabold text-[var(--portal-text)]">3</h3>
                  <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">+1 Case</span>
                </div>
                <svg className="h-7 w-20 text-amber-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0,25 Q15,25 30,25 T60,15 T90,5 L100,5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="app-card app-card-hover p-4 flex flex-col justify-between gap-2 shadow-sm">
              <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">AI Accuracy</p>
              <div className="flex items-end justify-between mt-1">
                <div className="space-y-1">
                  <h3 className="font-mono text-2xl font-extrabold text-[var(--portal-text)]">98.7%</h3>
                  <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">+0.3%</span>
                </div>
                <svg className="h-7 w-20 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0,20 Q15,15 30,18 T60,12 T90,5 L100,2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </section>

          {/* ZONE 2: Critical Alerts Panel (Max 3) */}
          {alerts.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <p className="text-label-premium text-[var(--portal-muted)]">Critical Telemetry (Immediate Action Required)</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id} 
                    className="app-card p-4 flex flex-col justify-between gap-3 border-red-500/30 bg-red-500/[0.02] shadow-[0_0_15px_rgba(239,68,68,0.06)] animate-in fade-in zoom-in duration-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 animate-pulse mt-0.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-xs font-bold text-[var(--portal-text)] truncate">{alert.patientName}</h4>
                        <p className="text-[12px] font-medium text-red-400/90 leading-tight">{alert.trigger}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--portal-border)]/35 text-[10px]">
                      <div className="flex flex-wrap gap-2">
                        <span className="font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded tracking-wide">{alert.risk}</span>
                        <span className="text-[var(--portal-muted)] bg-[var(--portal-elevated)]/60 px-1.5 py-0.5 rounded font-mono">AI: {alert.confidence}%</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleDismissAlert(alert.id)}
                          className="font-bold text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] px-2 py-1 rounded transition-colors select-none cursor-pointer"
                        >
                          Archive
                        </button>
                        <Link to={`/app/doctor/analysis/${alert.patientId}`}>
                          <button className="font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded transition-all select-none cursor-pointer">
                            Review
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ZONE 3 & ZONE 4: Timeline and Analytics widgets */}
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            
            {/* ZONE 3: Today's High-Density Timeline View */}
            <article className="app-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)]">
                <div>
                  <h3 className="text-card-title text-[var(--portal-text)]">Today's Schedule</h3>
                  <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Chronological workflow timeline</p>
                </div>
                <Link to="/app/doctor/patients" className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0ea5e9] hover:underline uppercase tracking-wider">
                  All Patients <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="relative border-l border-[var(--portal-border)] ml-3 pl-5 space-y-4 py-2">
                {timeline.map((slot, index) => (
                  <div key={index} className="relative group">
                    {/* Circle marker on timeline */}
                    <div className={cn(
                      "absolute -left-[26px] top-1 h-3 w-3 rounded-full border bg-[var(--portal-surface)] transition-all group-hover:scale-110",
                      slot.urgency === 'URGENT' ? "border-red-500" : slot.urgency === 'ATTENTION' ? "border-amber-500" : "border-emerald-500"
                    )} />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 hover:bg-[var(--portal-elevated)]/60 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#0ea5e9] bg-[#0ea5e9]/10 px-1.5 py-0.5 rounded">{slot.time}</span>
                          <span className="font-semibold text-xs text-[var(--portal-text)]">{slot.patientName}</span>
                          <span className="text-[10px] text-[var(--portal-muted)]">Age {slot.age}</span>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-wider px-1.5 rounded",
                            slot.type === 'Emergency' ? "bg-red-500/10 text-red-500" : slot.type === 'Consultation' ? "bg-sky-500/10 text-sky-500" : "bg-purple-500/10 text-purple-500"
                          )}>{slot.type}</span>
                        </div>
                        <p className="text-[12px] text-[var(--portal-muted)]">{slot.reason}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Link to={`/app/doctor/analysis/${slot.patientId}`}>
                          <button className="btn-premium btn-premium-secondary h-7 px-2.5 rounded-lg text-[9px] uppercase font-bold tracking-wider">
                            Triage Labs
                          </button>
                        </Link>
                        <Link to={`/app/doctor/room/${slot.patientId}`}>
                          <button className="btn-premium btn-premium-primary h-7 px-2.5 rounded-lg text-[9px] uppercase font-bold tracking-wider gap-1">
                            <Play className="h-2 w-2 fill-current" /> Start
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* ZONE 4: Dedicated Analytics Micro-widgets */}
            <aside className="space-y-5">
              
              <div className="app-card p-5 space-y-4">
                <h4 className="text-card-title text-[var(--portal-text)]">Diagnostic Index</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 text-center">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">AI Accuracy</p>
                    <p className="font-mono text-xl font-extrabold text-[var(--portal-text)] mt-1.5">98.7%</p>
                    <span className="text-[9px] text-emerald-500 font-semibold flex items-center justify-center gap-0.5 mt-1">
                      <TrendingUp className="h-3 w-3" /> +0.3%
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 text-center">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Triage Efficacy</p>
                    <p className="font-mono text-xl font-extrabold text-[var(--portal-text)] mt-1.5">94.2%</p>
                    <span className="text-[9px] text-emerald-500 font-semibold flex items-center justify-center gap-0.5 mt-1">
                      <TrendingUp className="h-3 w-3" /> +1.2%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/20 p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[var(--portal-text)]">Consensus Rate</p>
                    <p className="text-[10px] text-[var(--portal-muted)]">Agreement with EHR panels</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">99.1%</span>
                </div>
              </div>

              {/* Operations Widgets */}
              <div className="app-card p-5 space-y-3.5">
                <h4 className="text-card-title text-[var(--portal-text)]">Clinical Operations</h4>
                
                <div className="grid gap-2">
                  <button 
                    onClick={() => navigate('/app/doctor/schedule')}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 hover:bg-[#0ea5e9]/5 hover:border-[#0ea5e9]/20 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Clinic Calendar</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Edit availability slots</p>
                    </div>
                    <CalendarDays className="h-4 w-4 text-[#0ea5e9]" />
                  </button>
                  <button 
                    onClick={() => navigate('/app/doctor/analytics')}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 hover:bg-[#7f77dd]/5 hover:border-[#7f77dd]/20 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">Efficacy Metrics</p>
                      <p className="text-[9px] text-[var(--portal-muted)] mt-0.5">Explore practice recovery trends</p>
                    </div>
                    <Activity className="h-4 w-4 text-[#7f77dd]" />
                  </button>
                </div>
              </div>

            </aside>
          </div>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
