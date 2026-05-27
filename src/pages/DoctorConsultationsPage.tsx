import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ShieldAlert, Sparkles, Check, X, Play, Clock, ClipboardList, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ConsultationSlot {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  reason: string;
  time: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  avatarBg: string;
}

const initialConsultations: ConsultationSlot[] = [
  {
    id: 'c1',
    patientId: 'pt-001',
    patientName: 'Aarav Kapoor',
    patientAge: 29,
    patientGender: 'Male',
    reason: 'Severe LDL variance follow-up',
    time: 'Today, 11:30 AM',
    status: 'SCHEDULED',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]',
  },
  {
    id: 'c2',
    patientId: 'pt-002',
    patientName: 'Isha Verma',
    patientAge: 41,
    patientGender: 'Female',
    reason: 'Anemia check & fatigue evaluation',
    time: 'Today, 12:15 PM',
    status: 'SCHEDULED',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]',
  },
  {
    id: 'c3',
    patientId: 'pt-004',
    patientName: 'Karan Malhotra',
    patientAge: 52,
    patientGender: 'Male',
    reason: 'Hypertension & cardiovascular risk',
    time: 'Tomorrow, 10:00 AM',
    status: 'PENDING',
    avatarBg: 'from-[#f59e0b] to-[#d97706]',
  },
  {
    id: 'c4',
    patientId: 'pt-003',
    patientName: 'Rohan Das',
    patientAge: 36,
    patientGender: 'Male',
    reason: 'Routine baseline panel review',
    time: 'Yesterday, 02:00 PM',
    status: 'COMPLETED',
    avatarBg: 'from-[#10b981] to-[#059669]',
  }
];

export const DoctorConsultationsPage = () => {
  const [consultations, setConsultations] = useState<ConsultationSlot[]>(initialConsultations);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const handleAccept = (id: string, name: string) => {
    setConsultations(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'SCHEDULED' } : c)
    );
    toast.success(`Consultation scheduled with ${name}! Time: Tomorrow, 10:00 AM`);
  };

  const handleReject = (id: string, name: string) => {
    setConsultations(prev => prev.filter(c => c.id !== id));
    toast.info(`Request from ${name} declined.`);
  };

  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      const matchSearch = c.patientName.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'ALL' ? true : c.status === activeTab;
      return matchSearch && matchTab;
    });
  }, [consultations, search, activeTab]);

  return (
    <DashboardLayout title="Consultations">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Practice Consultation Queue</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Manage upcoming telehealth slots and clinical inquiries
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-[#0ea5e9]/20 bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
                {consultations.filter(c => c.status === 'SCHEDULED').length} Scheduled today
              </span>
            </div>
          </div>

          {/* Filtering */}
          <div className="app-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--portal-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient by name..."
                className="input-premium w-full pl-10"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'PENDING', 'SCHEDULED', 'COMPLETED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                    activeTab === tab 
                      ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30" 
                      : "bg-[var(--portal-surface)] border-[var(--portal-border)] text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Cards */}
          <section className="grid gap-4 md:grid-cols-2">
            {filteredConsultations.map((consult) => (
              <div 
                key={consult.id}
                className={cn(
                  "app-card p-5 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-200",
                  consult.status === 'PENDING' && "border-warning/35 bg-warning/[0.005]",
                  consult.status === 'SCHEDULED' && "border-sky-500/25 bg-sky-500/[0.005]",
                  consult.status === 'COMPLETED' && "border-emerald-500/25 bg-emerald-500/[0.005]"
                )}
              >
                {/* Identity header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white text-sm font-bold shadow-md", consult.avatarBg)}>
                      {consult.patientName.split(' ').map(p => p[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-body-premium font-bold text-[var(--portal-text)]">{consult.patientName}</h3>
                      <p className="text-secondary-premium text-[var(--portal-muted)] mt-0.5">
                        {consult.patientAge} y/o • {consult.patientGender}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border",
                    consult.status === 'PENDING' && "bg-warning/10 text-warning border-warning/20",
                    consult.status === 'SCHEDULED' && "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20",
                    consult.status === 'COMPLETED' && "bg-success/10 text-success border-success/20"
                  )}>
                    {consult.status}
                  </span>
                </div>

                {/* Consult details */}
                <div className="bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#7f77dd] uppercase tracking-wider">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Clinical Symptom / Reason
                  </div>
                  <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed">
                    {consult.reason}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--portal-muted)] font-bold uppercase pt-1 border-t border-[var(--portal-border)]/50">
                    <Clock className="h-3.5 w-3.5 text-[#0ea5e9]" /> slot: {consult.time}
                  </div>
                </div>

                {/* Operations CTAs */}
                <div className="flex gap-2 pt-2 border-t border-[var(--portal-border)]/50">
                  {consult.status === 'PENDING' ? (
                    <>
                      <button 
                        onClick={() => handleAccept(consult.id, consult.patientName)}
                        className="btn-premium btn-premium-ghost h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                      >
                        <Check className="h-3 w-3 mr-1" /> Accept
                      </button>
                      <button 
                        onClick={() => handleReject(consult.id, consult.patientName)}
                        className="btn-premium btn-premium-ghost h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                      >
                        <X className="h-3 w-3 mr-1" /> Decline
                      </button>
                    </>
                  ) : consult.status === 'SCHEDULED' ? (
                    <Link to={`/app/doctor/room/${consult.patientId}`} className="w-full">
                      <button className="btn-premium btn-premium-primary h-8 w-full rounded-lg text-[10px] font-bold uppercase tracking-wider gap-1">
                        <Play className="h-3 w-3 fill-current text-white" /> Launch Consult Room
                      </button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-success font-semibold">
                      <CheckCircle className="h-4 w-4" /> Consultation successfully closed
                    </div>
                  )}

                  {consult.status !== 'SCHEDULED' && (
                    <Link to={`/app/doctor/patient/${consult.patientId}`} className="ml-auto">
                      <button className="btn-premium btn-premium-ghost h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[var(--portal-border)]">
                        Dossier
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {filteredConsultations.length === 0 && (
              <div className="col-span-2 text-center py-16 app-card border-dashed border-2 max-w-lg mx-auto space-y-4">
                <Calendar className="h-12 w-12 text-[var(--portal-muted)] mx-auto" />
                <h3 className="text-body-premium font-bold text-[var(--portal-text)]">No consultation slots found</h3>
                <p className="text-secondary-premium text-[var(--portal-muted)]">Check another filter category or search criteria</p>
              </div>
            )}
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
