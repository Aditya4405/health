import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  User, 
  Activity, 
  Heart, 
  TrendingUp, 
  ArrowLeft, 
  Clock, 
  PlusCircle, 
  Play, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { cn } from '@/utils/cn';

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  urgency: 'URGENT' | 'ATTENTION' | 'STABLE';
  avatarBg: string;
  lastSynced: string;
  historyTimeline: { date: string; title: string; summary: string; type: string }[];
  medications: { name: string; dosage: string; started: string }[];
  biomarkerHistory: { date: string; value: number }[];
  notes: { date: string; author: string; text: string }[];
}

const patientData: Record<string, PatientProfile> = {
  'pt-001': {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    age: 29,
    gender: 'Male',
    urgency: 'URGENT',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]',
    lastSynced: 'Today, 10:45 AM',
    historyTimeline: [
      { date: 'Jan 15, 2026', title: 'Complete Blood Count (CBC)', summary: 'Hemoglobin low at 11.2 g/dL. Minor microcytic variance.', type: 'Blood Test' },
      { date: 'Dec 12, 2025', title: 'Lipid Cardiovascular Panel', summary: 'LDL high at 182 mg/dL. Elevated cardiac risk.', type: 'Cholesterol' }
    ],
    medications: [
      { name: 'Atorvastatin', dosage: '10mg once daily', started: 'Dec 14, 2025' },
      { name: 'Carbonyl Iron', dosage: '45mg once daily', started: 'Jan 16, 2026' }
    ],
    biomarkerHistory: [
      { date: 'Oct 25', value: 160 },
      { date: 'Nov 25', value: 168 },
      { date: 'Dec 25', value: 182 },
      { date: 'Jan 26', value: 180 }
    ],
    notes: [
      { date: 'Jan 16, 2026', author: 'Dr. Rahul Mehta', text: 'Iron deficiency anemia patterns detected. Recommending Ferritin panel and iron supplements. Keep monitoring LDL responses to Atorvastatin.' }
    ]
  },
  'pt-002': {
    id: 'pt-002',
    name: 'Isha Verma',
    age: 41,
    gender: 'Female',
    urgency: 'ATTENTION',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]',
    lastSynced: 'Yesterday',
    historyTimeline: [
      { date: 'Jan 10, 2026', title: 'Complete Blood Count (CBC)', summary: 'Hemoglobin low at 10.5 g/dL. Fatigue reported.', type: 'Blood Test' }
    ],
    medications: [
      { name: 'Ferate (Ferrous Gluconate)', dosage: '324mg once daily', started: 'Jan 11, 2026' }
    ],
    biomarkerHistory: [
      { date: 'Nov 25', value: 11.8 },
      { date: 'Dec 25', value: 11.2 },
      { date: 'Jan 26', value: 10.5 }
    ],
    notes: [
      { date: 'Jan 11, 2026', author: 'Dr. Rahul Mehta', text: 'Anemia follow-up. Initiated ferrous gluconate daily. Fatigue remains present. Schedule check in 4 weeks.' }
    ]
  }
};

export const PatientDetailViewPage = () => {
  const { patientId = 'pt-001' } = useParams();

  const profile = useMemo(() => {
    return patientData[patientId] || patientData['pt-001'];
  }, [patientId]);

  return (
    <DashboardLayout title="Patient Dossier">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Back Action button */}
          <div>
            <Link to="/app/doctor/patients" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea5e9] hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to patients list
            </Link>
          </div>

          {/* Identity Dossier block */}
          <article className="app-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden bg-gradient-to-br from-[#121620] to-[#161B2B]">
            <div className="flex items-center gap-4">
              <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-tr flex items-center justify-center text-white text-base font-bold shadow-md", profile.avatarBg)}>
                {profile.name.split(' ').map(p => p[0]).join('')}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-section-title text-[var(--portal-text)] font-bold">{profile.name}</h2>
                  <span className={cn(
                    "text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border",
                    profile.urgency === 'URGENT' && "bg-danger/10 text-danger border-danger/20 animate-pulse",
                    profile.urgency === 'ATTENTION' && "bg-warning/10 text-warning border-warning/20",
                    profile.urgency === 'STABLE' && "bg-success/10 text-success border-success/20"
                  )}>
                    {profile.urgency}
                  </span>
                </div>
                <p className="text-secondary-premium text-[var(--portal-muted)]">
                  {profile.age} y/o • {profile.gender} • Telemetry Synced {profile.lastSynced}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/app/doctor/analysis/${profile.id}`}>
                <button className="btn-premium btn-premium-secondary h-9 text-[10px] uppercase font-bold tracking-wide">
                  Analyse Reports
                </button>
              </Link>
              <Link to={`/app/doctor/room/${profile.id}`}>
                <button className="btn-premium btn-premium-primary h-9 text-[10px] uppercase font-bold tracking-wide gap-1">
                  <Play className="h-3 w-3 fill-current text-white" /> Start Consult
                </button>
              </Link>
            </div>
          </article>

          {/* Dossier Grid layout */}
          <section className="grid gap-6 lg:grid-cols-12">
            
            {/* Left Column: Timeline, Meds */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* History Timeline Accordion list */}
              <article className="app-card p-5 space-y-4">
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Clinical Records Timeline</h3>
                <div className="relative border-l border-[var(--portal-border)] pl-4 ml-2 space-y-5">
                  {profile.historyTimeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full bg-[#121620] border-2 border-[#0ea5e9] flex items-center justify-center" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">{item.date}</span>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[var(--portal-text)]">{item.title}</h4>
                          <span className="text-[9px] bg-[var(--portal-elevated)] border border-[var(--portal-border)] text-[var(--portal-muted)] px-2 py-0.5 rounded-full font-semibold">{item.type}</span>
                        </div>
                        <p className="text-[11px] text-[var(--portal-muted)] leading-relaxed mt-1">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* Vitals & Active Medications list */}
              <article className="app-card p-5 space-y-4">
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Active Medical Regimens</h3>
                <div className="divide-y divide-[var(--portal-border)]/50">
                  {profile.medications.map((med, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-xs font-bold text-[var(--portal-text)]">{med.name}</p>
                        <p className="text-[10px] text-[var(--portal-muted)] mt-0.5">Started: {med.started}</p>
                      </div>
                      <span className="border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* Right Column: Biomarkers graph & notes */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Biomarkers longitudinal chart */}
              <article className="app-card p-5 space-y-4">
                <div>
                  <h3 className="text-card-title text-[var(--portal-text)]">Biomarker Longitudinal Trends</h3>
                  <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Historical telemetry for tracking recovery</p>
                </div>
                <div className="h-60 w-full text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profile.biomarkerHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--portal-border)" />
                      <XAxis dataKey="date" stroke="var(--portal-muted)" />
                      <YAxis stroke="var(--portal-muted)" />
                      <Tooltip
                        contentStyle={{ 
                          background: 'var(--portal-surface)', 
                          borderColor: 'var(--portal-border)', 
                          color: 'var(--portal-text)',
                          borderRadius: '12px' 
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} activeDot={{ r: 6 }} name="Biomarker Value" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              {/* Doctors remarks log */}
              <article className="app-card p-5 space-y-4">
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Past Consultation Notes</h3>
                <div className="space-y-3">
                  {profile.notes.map((note, idx) => (
                    <div key={idx} className="bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wide">
                        <span>{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-xs text-[var(--portal-text)] leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
