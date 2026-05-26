import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  ArrowLeft, 
  ShieldAlert, 
  Plus, 
  X, 
  CheckCircle2, 
  FileDown, 
  Heart,
  AlertCircle
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
  { name: 'Hemoglobin', value: 11.2, unit: 'g/dL', minRange: 13.5, maxRange: 17.5, status: 'LOW' },
  { name: 'LDL Cholesterol', value: 182, unit: 'mg/dL', minRange: 50, maxRange: 100, status: 'CRITICAL' },
  { name: 'White Blood Cells (WBC)', value: 7200, unit: '/uL', minRange: 4000, maxRange: 11000, status: 'NORMAL' },
  { name: 'Serum Glucose', value: 105, unit: 'mg/dL', minRange: 70, maxRange: 100, status: 'HIGH' }
];

export const DoctorAnalysisWorkspacePage = () => {
  const navigate = useNavigate();
  const { reportId = 'mock-report' } = useParams();

  const [biomarkers, setBiomarkers] = useState<ExtractedBiomarker[]>(mockBiomarkers);
  const [summaryText, setSummaryText] = useState('Patient shows symptoms of hypercholesterolemia and secondary microcytic anemia. Started Atorvastatin regimen.');
  const [medications, setMedications] = useState([
    { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '30 days' }
  ]);
  const [saving, setSaving] = useState(false);

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
      new Promise((resolve) => setTimeout(resolve, 1400)),
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
        <div className="space-y-4 text-[var(--portal-text)] h-[calc(100vh-100px)] min-h-[550px] flex flex-col justify-between">
          
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--portal-border)] shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/app/doctor/pending-reports')} className="text-[var(--portal-muted)] hover:text-[var(--portal-text)] transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-[var(--portal-text)] uppercase tracking-wider">Report Analysis Studio</h2>
                <p className="text-[10px] text-[var(--portal-muted)]">Triage ID: {reportId}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOff} 
              disabled={saving}
              className="btn-premium btn-premium-primary h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider"
            >
              Sign-Off & Sync Patient
            </button>
          </div>

          {/* Three-pane layout split screen */}
          <div className="flex-1 grid gap-4 lg:grid-cols-12 min-h-0 overflow-hidden py-1">
            
            {/* Left Panel: Simulated report PDF (4 columns) */}
            <article className="lg:col-span-4 app-card p-5 h-full overflow-y-auto flex flex-col justify-between border-dashed bg-[var(--portal-elevated)]/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--portal-border)]">
                  <span className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Raw Clinical Report</span>
                  <FileText className="h-4 w-4 text-[var(--portal-muted)]" />
                </div>
                
                {/* Styled sheet */}
                <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 space-y-4 text-[10px] font-mono shadow-sm">
                  <div className="text-center pb-2 border-b border-[var(--portal-border)]">
                    <p className="font-bold uppercase tracking-wide">MEDISCAN LABS INC.</p>
                    <p className="text-[8px] text-[var(--portal-muted)]">EHR Synced Report Feed</p>
                  </div>
                  <div className="space-y-1 text-[8px] text-[var(--portal-muted)]">
                    <p>PATIENT: Aarav Kapoor  | AGE: 29</p>
                    <p>SAMPLE ID: B-745928-MD | DATE: Jan 15, 2026</p>
                  </div>
                  
                  <div className="space-y-2.5 pt-2">
                    <p className="font-bold border-b border-[var(--portal-border)] pb-1 text-[8px] text-[var(--portal-muted)] uppercase">HEMATOLOGY TEST RESULTS</p>
                    <div className="space-y-1">
                      <div className="flex justify-between"><span>Hemoglobin</span><span>11.2 g/dL</span></div>
                      <div className="flex justify-between"><span>WBC Count</span><span>7,200 /uL</span></div>
                      <div className="flex justify-between"><span>Glucose Serum</span><span>105 mg/dL</span></div>
                      <div className="flex justify-between"><span>LDL Cholesterol</span><span>182 mg/dL</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-premium btn-premium-secondary w-full gap-1.5 h-8.5 rounded-lg text-[10px] font-bold uppercase tracking-wide mt-4">
                <FileDown className="h-3.5 w-3.5" /> Download original PDF
              </button>
            </article>

            {/* Center Panel: Biomarkers range indicators (4 columns) */}
            <article className="lg:col-span-4 app-card p-5 h-full overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                <BrainCircuit className="h-4.5 w-4.5 text-[#7f77dd]" />
                <h3 className="text-xs font-bold text-[var(--portal-text)] uppercase tracking-wider">AI Extracted Biomarkers</h3>
              </div>

              <div className="space-y-4">
                {biomarkers.map((b, idx) => {
                  const pct = Math.min(100, Math.max(0, ((b.value - b.minRange) / (b.maxRange - b.minRange)) * 100));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[var(--portal-text)]">{b.name}</span>
                        <span className={cn(
                          "font-bold font-mono",
                          b.status === 'CRITICAL' && "text-danger animate-pulse",
                          b.status === 'HIGH' && "text-danger",
                          b.status === 'LOW' && "text-warning",
                          b.status === 'NORMAL' && "text-success"
                        )}>
                          {b.value} {b.unit}
                        </span>
                      </div>
                      
                      {/* Visual Range bar */}
                      <div className="h-1.5 w-full bg-[var(--portal-elevated)] rounded-full relative overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            b.status === 'CRITICAL' && "bg-danger shadow-[0_0_8px_rgba(226,75,74,0.6)]",
                            b.status === 'HIGH' && "bg-danger",
                            b.status === 'LOW' && "bg-warning",
                            b.status === 'NORMAL' && "bg-success"
                          )} 
                          style={{ width: `${b.status === 'NORMAL' ? 50 : pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-[var(--portal-muted)] uppercase tracking-wider">
                        <span>Ref range: {b.minRange} - {b.maxRange}</span>
                        <span>{b.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Right Panel: Doctor treatment editor (4 columns) */}
            <article className="lg:col-span-4 app-card p-5 h-full overflow-y-auto flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--portal-border)]">
                  <Sparkles className="h-4.5 w-4.5 text-[#0ea5e9]" />
                  <h3 className="text-xs font-bold text-[var(--portal-text)] uppercase tracking-wider">EHR Treatment Plan</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wide ml-1">Clinical Remarks</label>
                  <textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Enter diagnostic summary notes..."
                    className="input-premium w-full h-20 py-2 text-xs resize-none"
                  />
                </div>

                {/* Medication editor list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[var(--portal-muted)] uppercase tracking-wide ml-1">Prescription Dosing</label>
                    <button 
                      onClick={handleAddMedication}
                      className="text-[9px] font-bold text-[#0ea5e9] uppercase tracking-wider flex items-center hover:underline"
                    >
                      <Plus className="h-3 w-3 mr-0.5" /> Add Drug
                    </button>
                  </div>

                  <div className="space-y-2">
                    {medications.map((row, index) => (
                      <div key={index} className="bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-lg p-2.5 space-y-2 relative">
                        <button 
                          onClick={() => handleDeleteMed(index)}
                          className="absolute right-2 top-2 text-[var(--portal-muted)] hover:text-red-500 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="text"
                          placeholder="Drug name"
                          value={row.name}
                          onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                          className="input-premium h-8 px-2 text-[10px] w-[90%]"
                        />
                        <div className="grid grid-cols-3 gap-1">
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={row.dosage}
                            onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                            className="input-premium h-7 px-1.5 text-[9px] w-full"
                          />
                          <input
                            type="text"
                            placeholder="Freq"
                            value={row.frequency}
                            onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                            className="input-premium h-7 px-1.5 text-[9px] w-full"
                          />
                          <input
                            type="text"
                            placeholder="Dur"
                            value={row.duration}
                            onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                            className="input-premium h-7 px-1.5 text-[9px] w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--portal-border)]">
                <button 
                  onClick={handleSignOff} 
                  disabled={saving}
                  className="btn-premium btn-premium-primary w-full h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {saving ? 'Saving...' : 'Sign-Off Report & Sync'}
                </button>
              </div>
            </article>

          </div>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
