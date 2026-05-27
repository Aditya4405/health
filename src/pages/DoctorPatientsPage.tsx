import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, ShieldAlert, ArrowRight, Activity, MessageSquare, HeartPulse } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { cn } from '@/utils/cn';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  urgency: 'URGENT' | 'ATTENTION' | 'STABLE';
  lastActivity: string;
  biomarkers: { name: string; value: string; status: 'high' | 'low' | 'normal' }[];
  clinicalInsights: string;
  avatarBg: string;
}

const patientDossiers: PatientRecord[] = [
  {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    age: 29,
    gender: 'Male',
    urgency: 'URGENT',
    lastActivity: 'Synced today',
    biomarkers: [
      { name: 'LDL Cholesterol', value: '182 mg/dL', status: 'high' },
      { name: 'Hemoglobin', value: '11.2 g/dL', status: 'low' },
      { name: 'Ferritin', value: '18 ng/mL', status: 'low' }
    ],
    clinicalInsights: 'Pattern matches moderate iron deficiency anemia combined with cardiovascular risk.',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]'
  },
  {
    id: 'pt-002',
    name: 'Isha Verma',
    age: 41,
    gender: 'Female',
    urgency: 'ATTENTION',
    lastActivity: 'Synced yesterday',
    biomarkers: [
      { name: 'Hemoglobin', value: '10.5 g/dL', status: 'low' },
      { name: 'Glucose', value: '105 mg/dL', status: 'high' }
    ],
    clinicalInsights: 'Requires iron supplementation monitoring and secondary glucose check.',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]'
  },
  {
    id: 'pt-003',
    name: 'Rohan Das',
    age: 36,
    gender: 'Male',
    urgency: 'STABLE',
    lastActivity: 'Synced 3 days ago',
    biomarkers: [
      { name: 'Glucose', value: '98 mg/dL', status: 'normal' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', status: 'normal' }
    ],
    clinicalInsights: 'Metabolic panels are normal. Next routine checkup in 6 months.',
    avatarBg: 'from-[#10b981] to-[#059669]'
  },
  {
    id: 'pt-004',
    name: 'Karan Malhotra',
    age: 52,
    gender: 'Male',
    urgency: 'URGENT',
    lastActivity: 'Synced today',
    biomarkers: [
      { name: 'LDL Cholesterol', value: '198 mg/dL', status: 'high' },
      { name: 'Systolic BP', value: '145 mmHg', status: 'high' }
    ],
    clinicalInsights: 'Stage 1 hypertension combined with extreme hypercholesterolemia. High cardiac risk.',
    avatarBg: 'from-[#f59e0b] to-[#d97706]'
  }
];

export const DoctorPatientsPage = () => {
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'URGENT' | 'ATTENTION' | 'STABLE'>('ALL');

  const filteredPatients = useMemo(() => {
    return patientDossiers.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchUrgency = urgencyFilter === 'ALL' ? true : p.urgency === urgencyFilter;
      return matchSearch && matchUrgency;
    });
  }, [search, urgencyFilter]);

  return (
    <DashboardLayout title="Patient Intelligence">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Patient Intelligence Dossiers</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Practice-wide telemetry and longitudinal records search index
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-success/20 bg-success/10 text-success text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
                {patientDossiers.length} Synced patients
              </span>
            </div>
          </div>

          {/* Filtering Console */}
          <div className="app-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--portal-muted)]" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Filter patients by name..." 
                className="input-premium w-full pl-10"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'URGENT', 'ATTENTION', 'STABLE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setUrgencyFilter(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                    urgencyFilter === mode 
                      ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30" 
                      : "bg-[var(--portal-surface)] border-[var(--portal-border)] text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Dossiers Grid */}
          <section className="grid gap-4 md:grid-cols-2">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id} 
                className={cn(
                  "app-card app-card-hover p-6 flex flex-col justify-between space-y-4 relative overflow-hidden",
                  patient.urgency === 'URGENT' && "border-danger/30 bg-danger/[0.005]",
                  patient.urgency === 'ATTENTION' && "border-warning/30 bg-warning/[0.005]"
                )}
              >
                {/* Profile Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white text-sm font-bold shadow-md", patient.avatarBg)}>
                      {patient.name.split(' ').map(p => p[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-body-premium font-bold text-[var(--portal-text)]">{patient.name}</h3>
                      <p className="text-secondary-premium text-[var(--portal-muted)] mt-0.5">
                        {patient.age} y/o • {patient.gender} • {patient.lastActivity}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border",
                    patient.urgency === 'URGENT' && "bg-danger/10 text-danger border-danger/20",
                    patient.urgency === 'ATTENTION' && "bg-warning/10 text-warning border-warning/20",
                    patient.urgency === 'STABLE' && "bg-success/10 text-success border-success/20"
                  )}>
                    {patient.urgency}
                  </span>
                </div>

                {/* Biomarker list */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  {patient.biomarkers.map((b, idx) => (
                    <div key={idx} className="bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl p-2.5 space-y-1 text-center">
                      <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">{b.name}</p>
                      <p className={cn(
                        "text-xs font-bold font-mono",
                        b.status === 'high' && "text-danger",
                        b.status === 'low' && "text-warning",
                        b.status === 'normal' && "text-success"
                      )}>{b.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI clinical insight */}
                <div className="bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl p-3 flex items-start gap-2">
                  <Activity className="h-4 w-4 text-[#7f77dd] shrink-0 mt-0.5" />
                  <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed">
                    <span className="font-semibold text-[var(--portal-text)]">AI Telemetry: </span>
                    {patient.clinicalInsights}
                  </p>
                </div>

                {/* Operations links */}
                <div className="flex gap-2 pt-2 border-t border-[var(--portal-border)]/50">
                  <Link to={`/app/doctor/patient/${patient.id}`}>
                    <button className="btn-premium btn-premium-secondary h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                      Health Dossier
                    </button>
                  </Link>
                  <Link to={`/app/doctor/analysis/${patient.id}`}>
                    <button className="btn-premium btn-premium-primary h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                      Analyse Report
                    </button>
                  </Link>
                  <Link to={`/app/doctor/messages?pt=${patient.id}`} className="ml-auto">
                    <button className="btn-premium btn-premium-ghost h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--portal-border)]" title="Contact Patient">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredPatients.length === 0 && (
              <div className="col-span-2 text-center py-16 space-y-4">
                <HeartPulse className="h-12 w-12 text-[var(--portal-muted)] mx-auto animate-bounce" />
                <h3 className="text-body-premium font-bold text-[var(--portal-text)]">No patient records found</h3>
                <p className="text-secondary-premium text-[var(--portal-muted)]">Check spelling or try shifting the urgency filter console</p>
              </div>
            )}
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
