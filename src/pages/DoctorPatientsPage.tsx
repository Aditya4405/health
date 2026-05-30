import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  UserCheck, 
  Sparkles, 
  SlidersHorizontal,
  CheckSquare,
  Square,
  FileText,
  User,
  Eye
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  urgency: 'URGENT' | 'ATTENTION' | 'STABLE';
  lastActivity: string;
  latestReport: string;
  aiScore: number;
  nextConsult: string;
  biomarkers: { name: string; value: string; status: 'high' | 'low' | 'normal' }[];
  clinicalInsights: string;
  avatarBg: string;
  tags: string[];
  previousReports: { name: string; date: string }[];
  timeline: { title: string; date: string; desc: string }[];
}

const patientDossiers: PatientRecord[] = [
  {
    id: 'pt-001',
    name: 'Aarav Kapoor',
    age: 29,
    gender: 'Male',
    urgency: 'URGENT',
    lastActivity: 'Synced today',
    latestReport: 'Complete Blood Count (CBC)',
    aiScore: 98.4,
    nextConsult: 'Today, 09:00 AM',
    tags: ['Anemia', 'Cardio Risk'],
    biomarkers: [
      { name: 'LDL Cholesterol', value: '182 mg/dL', status: 'high' },
      { name: 'Hemoglobin', value: '11.2 g/dL', status: 'low' },
      { name: 'Ferritin', value: '18 ng/mL', status: 'low' }
    ],
    clinicalInsights: 'Pattern matches moderate iron deficiency anemia combined with cardiovascular risk. Low statin dose initiated.',
    avatarBg: 'from-[#3b82f6] to-[#0ea5e9]',
    previousReports: [
      { name: 'Lipid Panel - Dec 2025', date: '3 months ago' },
      { name: 'CBC Panel - Aug 2025', date: '7 months ago' }
    ],
    timeline: [
      { title: 'Prescription Written', date: 'Today', desc: 'Atorvastatin 10mg + Carbonyl Iron 45mg element.' },
      { title: 'Lab Uploaded', date: '2 days ago', desc: 'Patient uploaded lab results from City Clinic.' },
      { title: 'Initial Consultation', date: '1 month ago', desc: 'Primary checkup regarding fatigue symptoms.' }
    ]
  },
  {
    id: 'pt-002',
    name: 'Isha Verma',
    age: 41,
    gender: 'Female',
    urgency: 'ATTENTION',
    lastActivity: 'Synced yesterday',
    latestReport: 'Metabolic Glucose Panel',
    aiScore: 96.2,
    nextConsult: 'Today, 10:30 AM',
    tags: ['Diabetic Watch', 'Fatigue'],
    biomarkers: [
      { name: 'Hemoglobin', value: '10.5 g/dL', status: 'low' },
      { name: 'Glucose', value: '105 mg/dL', status: 'high' }
    ],
    clinicalInsights: 'Requires iron supplementation monitoring and secondary glucose check. Iron levels are slightly lower than baseline.',
    avatarBg: 'from-[#ec4899] to-[#f43f5e]',
    previousReports: [
      { name: 'HbA1c Blood Test', date: '2 months ago' }
    ],
    timeline: [
      { title: 'Triage Check', date: 'Yesterday', desc: 'Glucose variance identified by clinical model.' },
      { title: 'Consult Completed', date: '1 month ago', desc: 'Review of lipid parameters and metabolic stability.' }
    ]
  },
  {
    id: 'pt-003',
    name: 'Rohan Das',
    age: 36,
    gender: 'Male',
    urgency: 'STABLE',
    lastActivity: 'Synced 3 days ago',
    latestReport: 'Thyroid Baseline Test',
    aiScore: 95.0,
    nextConsult: 'Today, 12:00 PM',
    tags: ['Thyroid', 'Routine'],
    biomarkers: [
      { name: 'Glucose', value: '98 mg/dL', status: 'normal' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', status: 'normal' }
    ],
    clinicalInsights: 'Metabolic panels are normal. Next routine checkup in 6 months.',
    avatarBg: 'from-[#10b981] to-[#059669]',
    previousReports: [
      { name: 'TSH Hormone Test', date: '6 months ago' }
    ],
    timeline: [
      { title: 'Scheduled Check', date: '3 days ago', desc: 'Standard semi-annual laboratory analysis.' }
    ]
  },
  {
    id: 'pt-004',
    name: 'Karan Malhotra',
    age: 52,
    gender: 'Male',
    urgency: 'URGENT',
    lastActivity: 'Synced today',
    latestReport: 'Lipid Cardiovascular Panel',
    aiScore: 99.1,
    nextConsult: 'Tomorrow, 02:30 PM',
    tags: ['Hypertension', 'Lipid Watch'],
    biomarkers: [
      { name: 'LDL Cholesterol', value: '198 mg/dL', status: 'high' },
      { name: 'Systolic BP', value: '145 mmHg', status: 'high' }
    ],
    clinicalInsights: 'Stage 1 hypertension combined with extreme hypercholesterolemia. High cardiovascular event risk.',
    avatarBg: 'from-[#f59e0b] to-[#d97706]',
    previousReports: [
      { name: 'Stress EKG Test', date: '4 weeks ago' }
    ],
    timeline: [
      { title: 'Emergency Intake', date: 'Today', desc: 'BP variance flagged by patient monitor application.' }
    ]
  }
];

export const DoctorPatientsPage = () => {
  const [search, setSearch] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'URGENT' | 'ATTENTION' | 'STABLE'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'age'>('risk');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Expand row helper
  const toggleRow = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  // Bulk selection helpers
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAll = (filteredIds: string[]) => {
    if (selectedIds.size === filteredIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  // Bulk operations simulation
  const handleBulkAction = (action: string) => {
    if (selectedIds.size === 0) {
      toast.warning('Select patients to execute bulk operations.');
      return;
    }
    toast.success(`Executed bulk ${action} for ${selectedIds.size} selected patient records.`);
    setSelectedIds(new Set());
  };

  const filteredPatients = useMemo(() => {
    let list = patientDossiers.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchUrgency = urgencyFilter === 'ALL' ? true : p.urgency === urgencyFilter;
      return matchSearch && matchUrgency;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'age') return b.age - a.age;
      
      const priorityMap = { URGENT: 3, ATTENTION: 2, STABLE: 1 };
      return priorityMap[b.urgency] - priorityMap[a.urgency];
    });
  }, [search, urgencyFilter, sortBy]);

  const filteredIds = useMemo(() => filteredPatients.map(p => p.id), [filteredPatients]);

  return (
    <DashboardLayout title="Patients Console">
      <PageTransition>
        <div className="space-y-5 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-3 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Patient Intelligence Dossiers</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Practice-wide EHR telemetry, biomarker profiles, and clinical records indexes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-success/20 bg-success/10 text-success text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
                {patientDossiers.length} Synced patients
              </span>
            </div>
          </div>

          {/* Table Operations Toolbar */}
          <div className="app-card p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full sm:w-80 shrink-0">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--portal-muted)]" />
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="Search by name, tags (e.g. Anemia)..." 
                  className="input-premium w-full pl-10"
                />
              </div>

              {/* Filters grid */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center sm:justify-end">
                {/* Urgency buttons */}
                <div className="flex bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] rounded-xl p-0.5">
                  {(['ALL', 'URGENT', 'ATTENTION', 'STABLE'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setUrgencyFilter(mode)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                        urgencyFilter === mode 
                          ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" 
                          : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-1 bg-[var(--portal-surface)] border border-[var(--portal-border)] rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--portal-muted)]">
                  <SlidersHorizontal className="h-3 w-3" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none outline-none text-[var(--portal-text)] cursor-pointer"
                  >
                    <option value="risk" className="bg-[#0B1020]">Sort: Risk Level</option>
                    <option value="name" className="bg-[#0B1020]">Sort: Alphabetical</option>
                    <option value="age" className="bg-[#0B1020]">Sort: Patient Age</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk actions tools */}
            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0ea5e9]/5 border border-[#0ea5e9]/15 animate-in fade-in slide-in-from-top-2 duration-150">
                <span className="text-[11px] font-bold text-[#0ea5e9] tracking-wide ml-1">
                  {selectedIds.size} Patients Selected
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('Sign-off')}
                    className="btn-premium btn-premium-ghost h-7 px-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-[#0ea5e9]/35 text-[#0ea5e9]"
                  >
                    Bulk Sign-Off
                  </button>
                  <button 
                    onClick={() => handleBulkAction('Sync AI Alert')}
                    className="btn-premium btn-premium-ghost h-7 px-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-[#0ea5e9]/35 text-[#0ea5e9]"
                  >
                    Sync AI Monitor
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table-card Hybrid Roster */}
          <article className="app-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-[var(--portal-border)] text-[var(--portal-muted)] font-semibold uppercase tracking-wider bg-[var(--portal-elevated)]/25">
                    {/* Checkbox col */}
                    <th className="py-3 px-4 w-10">
                      <button 
                        onClick={() => selectAll(filteredIds)}
                        className="text-[var(--portal-muted)] hover:text-[#0ea5e9]"
                      >
                        {selectedIds.size === filteredIds.length ? (
                          <CheckSquare className="h-4.5 w-4.5 text-[#0ea5e9]" />
                        ) : (
                          <Square className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Patient Profile</th>
                    <th className="py-3 px-4">Age / Sex</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Latest Lab File</th>
                    <th className="py-3 px-4 text-center">AI Match Score</th>
                    <th className="py-3 px-4">Next Consult</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--portal-border)]/40">
                  {filteredPatients.map((patient) => {
                    const isExpanded = expandedIds.has(patient.id);
                    const isSelected = selectedIds.has(patient.id);
                    return (
                      <React.Fragment key={patient.id}>
                        {/* Table row */}
                        <tr className={cn(
                          "transition-colors hover:bg-[var(--portal-elevated)]/30",
                          isSelected && "bg-[#0ea5e9]/[0.015]"
                        )}>
                          {/* Selection Checkbox */}
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => toggleSelect(patient.id)}
                              className="text-[var(--portal-muted)] hover:text-[#0ea5e9]"
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4.5 w-4.5 text-[#0ea5e9]" />
                              ) : (
                                <Square className="h-4.5 w-4.5" />
                              )}
                            </button>
                          </td>

                          {/* Profile */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white text-xs font-bold shadow-sm", patient.avatarBg)}>
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <Link to={`/app/doctor/patient/${patient.id}`} className="font-bold text-[var(--portal-text)] hover:text-[#0ea5e9] transition-colors">{patient.name}</Link>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {patient.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[9px] font-bold text-[var(--portal-muted)] bg-[var(--portal-elevated)] px-1.5 py-0.2 rounded border border-[var(--portal-border)]">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Age/Gender */}
                          <td className="py-3 px-4 font-semibold text-[var(--portal-muted)]">
                            {patient.age} y/o • {patient.gender}
                          </td>

                          {/* Risk */}
                          <td className="py-3 px-4">
                            <span className={cn(
                              "text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border",
                              patient.urgency === 'URGENT' && "bg-danger/10 text-danger border-danger/20 shadow-sm",
                              patient.urgency === 'ATTENTION' && "bg-warning/10 text-warning border-warning/20 shadow-sm",
                              patient.urgency === 'STABLE' && "bg-success/10 text-success border-success/20 shadow-sm"
                            )}>
                              {patient.urgency === 'URGENT' ? 'Critical' : patient.urgency === 'ATTENTION' ? 'Monitoring' : 'Stable'}
                            </span>
                          </td>

                          {/* Latest Lab File */}
                          <td className="py-3 px-4 font-semibold text-[var(--portal-text)] flex items-center gap-1.5 mt-2.5">
                            <FileText className="h-3.5 w-3.5 text-[#0ea5e9]" />
                            <span className="truncate max-w-[150px]" title={patient.latestReport}>{patient.latestReport}</span>
                          </td>

                          {/* AI Score */}
                          <td className="py-3 px-4 text-center">
                            <span className="font-mono font-bold text-xs bg-[#7f77dd]/10 text-[#7f77dd] border border-[#7f77dd]/20 px-2 py-0.5 rounded-md">
                              {patient.aiScore}%
                            </span>
                          </td>

                          {/* Next Consult */}
                          <td className="py-3 px-4 font-semibold text-[var(--portal-muted)]">
                            {patient.nextConsult}
                          </td>

                          {/* Row actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link to={`/app/doctor/analysis/${patient.id}`} title="Review Report">
                                <button className="h-7 w-7 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:border-[#0ea5e9]/40 hover:text-[#0ea5e9] flex items-center justify-center transition-all">
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              </Link>
                              <Link to={`/app/doctor/messages?pt=${patient.id}`} title="Contact Patient">
                                <button className="h-7 w-7 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:border-[#0ea5e9]/40 hover:text-[#0ea5e9] flex items-center justify-center transition-all">
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </button>
                              </Link>
                              <button 
                                onClick={() => toggleRow(patient.id)}
                                className={cn(
                                  "h-7 w-7 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:bg-[var(--portal-elevated)] flex items-center justify-center transition-all",
                                  isExpanded && "border-sky-500/35 text-sky-400"
                                )}
                                title="Expand Details"
                              >
                                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable row content */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="bg-[#0B1020]/45 p-4 border-l-2 border-sky-500 border-r border-[var(--portal-border)]">
                              <div className="grid gap-4 lg:grid-cols-12 animate-in fade-in slide-in-from-top-2 duration-200">
                                
                                {/* Card 1: Biomarker Summary (4 cols) */}
                                <div className="lg:col-span-4 app-card p-4 space-y-3 bg-[var(--portal-surface)]">
                                  <p className="text-[10px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center justify-between">
                                    <span>Biomarker Summary</span>
                                    <span className="text-[9px] font-mono text-[var(--portal-muted)]">Reference Ranges</span>
                                  </p>
                                  <div className="grid gap-2.5">
                                    {patient.biomarkers.map((b, idx) => (
                                      <div key={idx} className="flex flex-col gap-1 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-elevated)]/25 p-2">
                                        <div className="flex items-center justify-between text-[11px]">
                                          <span className="font-semibold text-[var(--portal-text)]">{b.name}</span>
                                          <span className={cn(
                                            "font-bold font-mono",
                                            b.status === 'high' && "text-danger",
                                            b.status === 'low' && "text-warning",
                                            b.status === 'normal' && "text-success"
                                          )}>{b.value}</span>
                                        </div>
                                        {/* Mini indicator bar */}
                                        <div className="h-1.5 w-full bg-[var(--portal-surface)] rounded-full overflow-hidden border border-[var(--portal-border)] mt-1">
                                          <div className={cn(
                                            "h-full rounded-full",
                                            b.status === 'high' ? "bg-red-500 w-[80%]" : b.status === 'low' ? "bg-amber-500 w-[30%]" : "bg-emerald-500 w-[55%]"
                                          )} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Card 2: Patient Timeline (4 cols) */}
                                <div className="lg:col-span-4 app-card p-4 space-y-3 bg-[var(--portal-surface)]">
                                  <p className="text-[10px] font-bold text-[#7f77dd] uppercase tracking-wider">Patient Timeline</p>
                                  <div className="relative border-l border-[var(--portal-border)] pl-3.5 ml-2 space-y-3 py-1">
                                    {patient.timeline.map((event, idx) => (
                                      <div key={idx} className="relative text-[11px] leading-tight">
                                        <span className="absolute -left-[19.5px] top-1.5 h-2 w-2 rounded-full bg-[#7f77dd]" />
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="font-bold text-[var(--portal-text)]">{event.title}</span>
                                          <span className="text-[8px] text-[var(--portal-muted)] font-mono uppercase">{event.date}</span>
                                        </div>
                                        <p className="text-[10px] text-[var(--portal-muted)] mt-0.5 leading-snug">{event.desc}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Card 3: AI Clinical Analysis & Previous Scans (4 cols) */}
                                <div className="lg:col-span-4 app-card p-4 space-y-3.5 bg-[var(--portal-surface)]">
                                  <div className="bg-[var(--portal-elevated)]/30 border border-[var(--portal-border)] rounded-xl p-3 flex items-start gap-2.5">
                                    <Activity className="h-4.5 w-4.5 text-[#7f77dd] shrink-0 mt-0.5 animate-pulse" />
                                    <div>
                                      <p className="text-[10px] font-bold text-[#7f77dd] uppercase tracking-wider">AI Clinical Interpretation</p>
                                      <p className="text-[11px] text-[var(--portal-muted)] mt-1.5 leading-relaxed">{patient.clinicalInsights}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider mb-2">Longitudinal Scans</p>
                                    <div className="space-y-1.5">
                                      {patient.previousReports.map((rep, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[10px] bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] px-2.5 py-1.5 rounded-lg">
                                          <span className="font-semibold truncate max-w-[170px] text-[var(--portal-text)]">{rep.name}</span>
                                          <span className="text-[9px] text-[var(--portal-muted)] font-mono">{rep.date}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-16 space-y-3">
                <ShieldAlert className="h-10 w-10 text-[var(--portal-muted)] mx-auto animate-pulse" />
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">No patient files found</h3>
                <p className="text-xs text-[var(--portal-muted)] leading-relaxed max-w-xs mx-auto">
                  Try adjusting your query string or toggle the urgency filter buttons to search again.
                </p>
              </div>
            )}
          </article>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
