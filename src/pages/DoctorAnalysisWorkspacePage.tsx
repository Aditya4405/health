import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  X, 
  FileDown, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  minRange: number;
  maxRange: number;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}

const mockBiomarkers: ExtractedBiomarker[] = [
  { 
    name: 'Hemoglobin', 
    value: 11.2, 
    unit: 'g/dL', 
    minRange: 13.5, 
    maxRange: 17.5, 
    status: 'LOW'
  },
  { 
    name: 'LDL Cholesterol', 
    value: 182, 
    unit: 'mg/dL', 
    minRange: 50, 
    maxRange: 100, 
    status: 'CRITICAL'
  },
  { 
    name: 'Serum Glucose', 
    value: 105, 
    unit: 'mg/dL', 
    minRange: 70, 
    maxRange: 100, 
    status: 'HIGH'
  }
];

export const DoctorAnalysisWorkspacePage = () => {
  const navigate = useNavigate();
  const { reportId = 'mock-report' } = useParams();

  const [biomarkers] = useState<ExtractedBiomarker[]>(mockBiomarkers);
  const [summaryText, setSummaryText] = useState('Patient Aarav Kapoor shows critical LDL cholesterol elevations (182 mg/dL) and mild microcytic anemia patterns. Suggest Atorvastatin 10mg regimen + Carbonyl Iron supplement.');
  
  const [medications, setMedications] = useState([
    { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '30 days' },
    { name: 'Carbonyl Iron', dosage: '45mg element', frequency: 'Once daily', duration: '60 days' }
  ]);
  
  const [saving, setSaving] = useState(false);
  const [reportTab, setReportTab] = useState<'summary' | 'original' | 'extracted'>('summary');
  const [normalFindingsExpanded, setNormalFindingsExpanded] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  const handleAddMedication = () => {
    setMedications(prev => [...prev, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleMedChange = (index: number, field: string, value: string) => {
    setMedications(prev => prev.map((med, idx) => idx === index ? { ...med, [field]: value } : med));
  };

  const handleDeleteMed = (index: number) => {
    setMedications(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSignOff = () => {
    setSaving(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Signing off diagnosis & compiling patient summary packet...',
        success: () => {
          setSaving(false);
          navigate('/app/doctor/pending-reports');
          return 'Diagnosis signed off! Patient dossier updated and synced.';
        },
        error: 'Failed to sign off report.'
      }
    );
  };

  return (
    <DashboardLayout title="Clinical Workspace">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)] max-w-[1600px] mx-auto px-8 py-6 pb-28 relative">
          
          {/* Header row */}
          <div className="flex items-center gap-4 pb-4 border-b border-[var(--portal-border)] shrink-0">
            <button 
              type="button"
              onClick={() => navigate('/app/doctor/pending-reports')} 
              className="h-8 w-8 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] flex items-center justify-center text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:border-[#0ea5e9]/40 transition-all select-none cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-[32px] font-semibold text-[var(--portal-text)] tracking-tight leading-none">AI Diagnostic Triage Workspace</h2>
              <p className="text-[13px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-1.5">Triage Dossier ID: {reportId}</p>
            </div>
          </div>

          {/* 1. Patient Summary Overview Section */}
          <article className="app-card p-5 bg-[var(--portal-surface)] border border-[var(--portal-border)] shadow-md">
            <div className="grid gap-6 md:grid-cols-4 items-center">
              <div className="space-y-1 border-r border-[var(--portal-border)]/35 pr-4">
                <span className="text-[11px] font-bold text-[#0ea5e9] uppercase tracking-wider block">Patient Dossier</span>
                <h3 className="text-[20px] font-semibold text-[var(--portal-text)]">Aarav Kapoor</h3>
                <p className="text-[13px] text-[var(--portal-muted)]">29 Years • Male</p>
              </div>

              <div className="space-y-1.5 border-r border-[var(--portal-border)]/35 pr-4">
                <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Risk status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  Critical Risk
                </span>
              </div>

              <div className="space-y-1 border-r border-[var(--portal-border)]/35 pr-4">
                <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Primary Finding</span>
                <h4 className="text-[15px] font-bold text-[var(--portal-text)] leading-tight">LDL Cholesterol: 182 mg/dL</h4>
                <p className="text-[12px] font-medium text-red-400">Critical Anomaly (+82 Outlier)</p>
              </div>

              <div className="space-y-1.5 pl-2">
                <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">AI Decision Integrity</span>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-mono font-extrabold text-[#7f77dd] bg-[#7f77dd]/10 border border-[#7f77dd]/20 px-2.5 py-0.5 rounded-lg">98.4%</span>
                  <div>
                    <span className="text-[12px] font-bold text-[#7f77dd] block leading-none">AI Confidence</span>
                    <span className="text-[11px] text-[var(--portal-muted)] mt-0.5 block leading-none">Verified against clinical dataset</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* 2. Clinical Report & Biomarkers (Side-by-side) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Tabbed Clinical Report Card (7 columns) */}
            <article className="lg:col-span-7 app-card p-5 border border-[var(--portal-border)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--portal-border)]/40 pb-3 gap-2">
                <h3 className="text-[18px] font-semibold text-[var(--portal-text)]">Clinical Report Findings</h3>
                
                {/* Tabs selection */}
                <div className="flex bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setReportTab('summary')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer",
                      reportTab === 'summary' ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    Summary
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('original')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer",
                      reportTab === 'original' ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    Original Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('extracted')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer",
                      reportTab === 'extracted' ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                    )}
                  >
                    Extracted Data
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[220px]">
                {reportTab === 'summary' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="bg-[var(--portal-elevated)]/20 border border-[var(--portal-border)] rounded-xl p-4">
                      <h4 className="font-semibold text-[var(--portal-text)] text-[15px] mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="h-4.5 w-4.5 text-[#7f77dd]" />
                        AI Clinical Interpretation
                      </h4>
                      <p className="text-[15px] text-[var(--portal-text)] leading-relaxed">
                        Patient Aarav Kapoor shows critical LDL cholesterol elevations (182 mg/dL) combined with mild microcytic anemia patterns. AI model suggests initiating a standard low-dose statin therapy (Atorvastatin 10mg) and prescribing oral iron supplements. Hemoglobin levels and lipid indicators should be re-monitored in 30 days.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border border-[var(--portal-border)] rounded-xl p-3.5 space-y-2 bg-[var(--portal-surface)]">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--portal-muted)] block">Key Scanned Findings</span>
                        <ul className="space-y-1.5 text-[13px] text-[var(--portal-text)]">
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>LDL Cholesterol is severely elevated at 182 mg/dL</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>Hemoglobin level is low at 11.2 g/dL</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border border-[var(--portal-border)] rounded-xl p-3.5 space-y-2 bg-[var(--portal-surface)]">
                        <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--portal-muted)] block">Clinical Recommendations</span>
                        <ul className="space-y-1.5 text-[13px] text-[var(--portal-text)]">
                          <li className="flex items-start gap-2">
                            <span className="text-[#0ea5e9] font-bold">•</span>
                            <span>Prescribe daily Atorvastatin lipid therapy (10mg)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#0ea5e9] font-bold">•</span>
                            <span>Initiate daily Carbonyl Iron supplement (45mg element)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {reportTab === 'original' && (
                  <div className="font-mono text-[12px] bg-[#090D1A] text-slate-300 p-4 rounded-xl border border-[var(--portal-border)] overflow-x-auto leading-relaxed animate-in fade-in duration-150 select-text">
                    <div className="text-center pb-3 border-b border-[var(--portal-border)]/40 mb-3">
                      <p className="font-bold text-[14px] text-white">MEDISCAN LABS INC.</p>
                      <p className="text-[10px] text-[var(--portal-muted)]">EHR Synced Report Feed</p>
                    </div>
                    <p>PATIENT: Aarav Kapoor   | AGE: 29          | SEX: Male</p>
                    <p>SAMPLE ID: B-745928-MD  | SOURCE: City Labs | DATE: Jan 15, 2026</p>
                    <div className="my-3 border-t border-dashed border-[var(--portal-border)]/40" />
                    <p className="font-bold text-white">HEMATOLOGY & LIPID PANEL RESULTS:</p>
                    <div className="space-y-1 mt-2">
                      <p className="flex justify-between"><span>Hemoglobin:</span><span className="font-bold text-amber-500">11.2 g/dL</span><span>(Range: 13.5 - 17.5)</span></p>
                      <p className="flex justify-between"><span>Serum Glucose:</span><span className="font-bold text-amber-500">105 mg/dL</span><span>(Range: 70 - 100)</span></p>
                      <p className="flex justify-between"><span>LDL Cholesterol:</span><span className="font-bold text-red-500">182 mg/dL</span><span>(Range: 50 - 100)</span></p>
                      <p className="flex justify-between"><span>White Blood Cells:</span><span>7,200 /uL</span><span>(Range: 4,000 - 11,000)</span></p>
                    </div>
                    <div className="my-3 border-t border-dashed border-[var(--portal-border)]/40" />
                    <p className="text-[10px] text-[var(--portal-muted)] italic">Verified Electronic Scanned Copy. Signed: Dr. S. Sharma, MD</p>
                  </div>
                )}

                {reportTab === 'extracted' && (
                  <div className="border border-[var(--portal-border)] rounded-xl overflow-hidden animate-in fade-in duration-150">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[var(--portal-elevated)]/30 text-[var(--portal-muted)] font-semibold uppercase tracking-wider border-b border-[var(--portal-border)]">
                          <th className="py-2 px-3">Biomarker</th>
                          <th className="py-2 px-3 text-right">Value</th>
                          <th className="py-2 px-3">Range</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--portal-border)]/30 text-[13px]">
                        {biomarkers.map((b, idx) => (
                          <tr key={idx} className="hover:bg-[var(--portal-elevated)]/20">
                            <td className="py-2.5 px-3 font-semibold text-[var(--portal-text)]">{b.name}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-[var(--portal-text)]">{b.value} {b.unit}</td>
                            <td className="py-2.5 px-3 text-[var(--portal-muted)] font-mono">{b.minRange}-{b.maxRange}</td>
                            <td className="py-2.5 px-3">
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded",
                                b.status === 'CRITICAL' && "bg-red-500/10 text-red-500 border border-red-500/20",
                                b.status === 'HIGH' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                                b.status === 'LOW' && "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                                b.status === 'NORMAL' && "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              )}>{b.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button className="btn-premium btn-premium-secondary gap-1.5 h-8.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border-[var(--portal-border)] bg-[var(--portal-surface)]">
                  <FileDown className="h-3.5 w-3.5" /> Download original PDF
                </button>
              </div>
            </article>

            {/* Right side: Biomarker Telemetry Card (5 columns) */}
            <article className="lg:col-span-5 app-card p-5 border border-[var(--portal-border)] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--portal-border)]/40">
                <BrainCircuit className="h-4.5 w-4.5 text-[#7f77dd]" />
                <h3 className="text-[18px] font-semibold text-[var(--portal-text)]">Biomarker Findings</h3>
              </div>

              {/* Critical Findings Panel */}
              <div className="space-y-3.5">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--portal-muted)] block">Critical Findings (2)</span>
                
                <div className="space-y-2">
                  <div className="p-3 border border-red-500/25 bg-red-500/[0.02] rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[15px] font-bold text-[var(--portal-text)] block leading-none">LDL Cholesterol</span>
                      <span className="text-[13px] font-mono text-[var(--portal-muted)] block">182 mg/dL &gt; [Normal Range: &lt;100]</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">Critical Anomaly</span>
                  </div>

                  <div className="p-3 border border-amber-500/25 bg-amber-500/[0.02] rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[15px] font-bold text-[var(--portal-text)] block leading-none">Hemoglobin</span>
                      <span className="text-[13px] font-mono text-[var(--portal-muted)] block">11.2 g/dL &lt; [Normal Range: 13.5-17.5]</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">Low Anomaly</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Normal Findings Panel */}
              <div className="border border-[var(--portal-border)] rounded-xl bg-[var(--portal-surface)] overflow-hidden mt-3">
                <button 
                  type="button"
                  onClick={() => setNormalFindingsExpanded(!normalFindingsExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between font-semibold text-[var(--portal-text)] bg-[var(--portal-elevated)]/20 hover:bg-[var(--portal-elevated)]/40 transition-colors select-none cursor-pointer"
                >
                  <span className="text-[15px]">Normal Findings (8)</span>
                  {normalFindingsExpanded ? <ChevronUp className="h-4 w-4 text-[var(--portal-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--portal-muted)]" />}
                </button>
                {normalFindingsExpanded && (
                  <div className="p-3 divide-y divide-[var(--portal-border)]/40 animate-in fade-in slide-in-from-top-1 duration-150 text-[13px]">
                    <NormalBiomarkerRow name="Serum Glucose" value="105" unit="mg/dL" range="70 - 100 (Slightly High)" status="high" />
                    <NormalBiomarkerRow name="White Blood Cells" value="7,200" unit="/uL" range="4,000 - 11,000" />
                    <NormalBiomarkerRow name="HDL Cholesterol" value="45" unit="mg/dL" range=">40" />
                    <NormalBiomarkerRow name="Triglycerides" value="125" unit="mg/dL" range="<150" />
                    <NormalBiomarkerRow name="TSH Hormone" value="2.4" unit="uIU/mL" range="0.4 - 4.0" />
                    <NormalBiomarkerRow name="Ferritin Serum" value="68" unit="ng/mL" range="24 - 336" />
                    <NormalBiomarkerRow name="Calcium" value="9.4" unit="mg/dL" range="8.5 - 10.2" />
                    <NormalBiomarkerRow name="Potassium" value="4.1" unit="mEq/L" range="3.5 - 5.0" />
                  </div>
                )}
              </div>
            </article>

          </div>

          {/* 3. Treatment Plan Section (Flat list, no cards nesting) */}
          <article className="app-card p-5 border border-[var(--portal-border)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)]/40">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#0ea5e9]" />
                <h3 className="text-[20px] font-semibold text-[var(--portal-text)]">EHR Treatment Plan</h3>
              </div>
              <button 
                type="button"
                onClick={handleAddMedication}
                className="text-[13px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1 select-none cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Medication
              </button>
            </div>

            {/* Prescriptions inputs list */}
            <div className="space-y-2">
              {medications.map((row, index) => (
                <div key={index} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/20 relative group">
                  
                  {/* Delete button */}
                  <button 
                    type="button"
                    onClick={() => handleDeleteMed(index)}
                    className="absolute right-2 top-2 md:relative md:top-auto md:right-auto text-[var(--portal-muted)] hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove Medication"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="grid gap-3 grid-cols-1 md:grid-cols-4 flex-1 md:mr-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Drug Name</span>
                      <input
                        type="text"
                        placeholder="e.g. Atorvastatin"
                        value={row.name}
                        onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                        className="input-premium h-8 px-2 text-[13px] w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Dosage</span>
                      <input
                        type="text"
                        placeholder="e.g. 10mg"
                        value={row.dosage}
                        onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                        className="input-premium h-8 px-2 text-[13px] w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Frequency</span>
                      <input
                        type="text"
                        placeholder="e.g. Once daily"
                        value={row.frequency}
                        onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                        className="input-premium h-8 px-2 text-[13px] w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Duration</span>
                      <input
                        type="text"
                        placeholder="e.g. 30 days"
                        value={row.duration}
                        onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                        className="input-premium h-8 px-2 text-[13px] w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {medications.length === 0 && (
                <p className="text-[13px] text-[var(--portal-muted)] italic py-2">No medications currently in treatment plan regimen. Click "+ Add Medication" to create one.</p>
              )}
            </div>

            {/* Clinical Remarks */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider ml-1">Clinical Remarks</label>
              <textarea
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                placeholder="Type clinical diagnosis remarks here..."
                className="input-premium w-full h-20 py-2 text-[13px] resize-none"
              />
            </div>
          </article>

          {/* 4. Sticky Action Footer */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-surface)]/95 backdrop-blur-md shadow-xl relative z-30 font-sans">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <div className="text-left font-sans">
                <span className="text-[11px] font-bold text-[var(--portal-muted)] uppercase tracking-wider block">Active Triage Case</span>
                <span className="text-[13px] font-bold text-[var(--portal-text)]">Aarav Kapoor • LDL Level: {biomarkers[1].value} mg/dL ({biomarkers[1].status})</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2.5 justify-end w-full sm:w-auto relative">
              {/* More Actions Dropdown Toggle */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="btn-premium px-3.5 py-2 border border-[var(--portal-border)] bg-[var(--portal-surface)] text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer flex items-center gap-1.5"
                >
                  More Actions <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {showMoreActions && (
                  <div className="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-1 shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        toast.success("Draft saved successfully.");
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Escalated to expert specialist.");
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-[#7f77dd] hover:bg-[#7f77dd]/10 rounded-lg transition-colors cursor-pointer"
                    >
                      Escalate Case
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={() => {
                  toast.error("Triage case rejected.");
                  navigate('/app/doctor/pending-reports');
                }}
                className="btn-premium px-3.5 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer"
              >
                Reject
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  toast.info("Follow-up tests requested.");
                }}
                className="btn-premium px-3.5 py-2 border border-[#0ea5e9]/20 text-[#0ea5e9] hover:bg-[#0ea5e9]/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer"
              >
                Request Tests
              </button>
              
              <button 
                type="button"
                onClick={handleSignOff}
                disabled={saving}
                className="btn-premium btn-premium-primary px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none cursor-pointer"
              >
                {saving ? 'Signing off...' : 'Approve & Sign Off'}
              </button>
            </div>
          </div>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const NormalBiomarkerRow = ({ name, value, unit, range, status }: { name: string; value: string; unit: string; range: string; status?: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-[var(--portal-border)]/20 last:border-b-0 text-[13px]">
    <div>
      <span className="font-semibold text-[var(--portal-text)]">{name}</span>
      <span className="block text-[11px] text-[var(--portal-muted)] mt-0.5 font-mono">Reference: {range}</span>
    </div>
    <div className="text-right">
      <span className="font-mono font-bold text-[var(--portal-text)] block">{value} {unit}</span>
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded mt-0.5 inline-block",
        status === 'high' ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
      )}>
        {status === 'high' ? 'High' : 'Normal'}
      </span>
    </div>
  </div>
);
