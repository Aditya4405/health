import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ClipboardList, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Ban } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface ReportTriageItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  reportName: string;
  uploadDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  anomaliesCount: number;
  anomaliesSummary: string;
}

const initialReports: ReportTriageItem[] = [
  {
    id: 'r1',
    patientId: 'pt-001',
    patientName: 'Aarav Kapoor',
    patientAge: 29,
    reportName: 'Complete Blood Count (CBC)',
    uploadDate: '2 hours ago',
    urgency: 'HIGH',
    confidence: 98.4,
    anomaliesCount: 2,
    anomaliesSummary: 'Low Hemoglobin (11.2) & Low Ferritin (18)',
  },
  {
    id: 'r2',
    patientId: 'pt-002',
    patientName: 'Isha Verma',
    patientAge: 41,
    reportName: 'Metabolic Glucose Panel',
    uploadDate: 'Yesterday',
    urgency: 'MEDIUM',
    confidence: 96.2,
    anomaliesCount: 1,
    anomaliesSummary: 'Elevated Glucose (105)',
  },
  {
    id: 'r3',
    patientId: 'pt-004',
    patientName: 'Karan Malhotra',
    patientAge: 52,
    reportName: 'Lipid Cardiovascular Panel',
    uploadDate: 'Today, 08:30 AM',
    urgency: 'HIGH',
    confidence: 99.1,
    anomaliesCount: 2,
    anomaliesSummary: 'LDL spikes (198) & Systolic BP (145)',
  },
  {
    id: 'r4',
    patientId: 'pt-003',
    patientName: 'Rohan Das',
    patientAge: 36,
    reportName: 'Thyroid Baseline Test',
    uploadDate: '3 days ago',
    urgency: 'LOW',
    confidence: 95.0,
    anomaliesCount: 0,
    anomaliesSummary: 'All biomarkers within standard ranges',
  }
];

export const DoctorReportsPage = () => {
  const [reports, setReports] = useState<ReportTriageItem[]>(initialReports);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'urgency' | 'confidence'>('urgency');

  const handleApproveReport = (id: string, patientName: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Report verified & approved for ${patientName}`);
  };

  const sortedAndFilteredReports = useMemo(() => {
    const filtered = reports.filter((r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.reportName.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      
      const priorityMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityMap[b.urgency] - priorityMap[a.urgency];
    });
  }, [reports, search, sortBy]);

  return (
    <DashboardLayout title="Report Triage">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">AI Diagnostic Triage Workspace</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Approve verified laboratory results and trigger patient syncs
              </p>
            </div>
            <span className="border border-warning/20 bg-warning/10 text-warning text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
              {reports.length} pending triages
            </span>
          </div>

          {/* Filters */}
          <div className="app-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[var(--portal-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient or report name..."
                className="input-premium w-full pl-10"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('urgency')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                  sortBy === 'urgency' 
                    ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30" 
                    : "bg-[var(--portal-surface)] border-[var(--portal-border)] text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                )}
              >
                Sort: Urgency
              </button>
              <button
                onClick={() => setSortBy('confidence')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all",
                  sortBy === 'confidence' 
                    ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/30" 
                    : "bg-[var(--portal-surface)] border-[var(--portal-border)] text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                )}
              >
                Sort: AI Confidence
              </button>
            </div>
          </div>

          {/* Triage Cards List */}
          <section className="space-y-4">
            {sortedAndFilteredReports.map((report) => (
              <div 
                key={report.id}
                className={cn(
                  "app-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden transition-all duration-200",
                  report.urgency === 'HIGH' && "border-danger/25 bg-danger/[0.005]",
                  report.urgency === 'MEDIUM' && "border-warning/25 bg-warning/[0.005]"
                )}
              >
                <div className="space-y-2.5 min-w-0 flex-1">
                  {/* Patient Info & Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-semibold text-body-premium text-[var(--portal-text)]">{report.patientName}</span>
                    <span className="text-[11px] text-[var(--portal-muted)]">{report.patientAge} y/o</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--portal-border)]" />
                    <span className="text-secondary-premium text-[var(--portal-muted)]">{report.uploadDate}</span>
                    <span className={cn(
                      "text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border",
                      report.urgency === 'HIGH' && "bg-danger/10 text-danger border-danger/20",
                      report.urgency === 'MEDIUM' && "bg-warning/10 text-warning border-warning/20",
                      report.urgency === 'LOW' && "bg-success/10 text-success border-success/20"
                    )}>
                      {report.urgency} Urgency
                    </span>
                  </div>

                  {/* Report details */}
                  <h3 className="text-card-title text-[var(--portal-text)] font-bold">{report.reportName}</h3>

                  {/* Biomarker anomalies */}
                  <div className="inline-flex items-start gap-2 bg-[var(--portal-elevated)]/60 border border-[var(--portal-border)] rounded-xl p-3.5 w-full">
                    <span className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                      report.anomaliesCount > 0 ? "bg-danger/10 text-danger border-danger/20" : "bg-success/10 text-success border-success/20"
                    )}>
                      {report.anomaliesCount}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[var(--portal-text)]">
                        {report.anomaliesCount > 0 ? 'Biomarker Variances Detected' : 'No Anomalies Found'}
                      </p>
                      <p className="text-secondary-premium text-[var(--portal-muted)] mt-1">{report.anomaliesSummary}</p>
                    </div>
                  </div>
                </div>

                {/* AI Score & CTAs */}
                <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[var(--portal-border)]/50">
                  {/* AI Confidence */}
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#7f77dd]" />
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider leading-none">AI Match Confidence</p>
                      <p className="font-mono text-base font-bold text-[var(--portal-text)] mt-1 leading-none">{report.confidence}%</p>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReport(report.id, report.patientName)}
                      className="btn-premium btn-premium-ghost h-9 px-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
                    </button>
                    <Link to={`/app/doctor/analysis/${report.patientId}`}>
                      <button className="btn-premium btn-premium-primary h-9 px-3.5 rounded-xl gap-1">
                        Workspace <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-20 app-card space-y-4 max-w-xl mx-auto border-dashed border-2">
                <div className="h-12 w-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto text-success">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-card-title text-[var(--portal-text)] font-bold">Triage Queue Clear</h3>
                <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed max-w-sm mx-auto">
                  All clinical reports have been reviewed, verified, and signed off. Fresh uploads will pop up here dynamically.
                </p>
              </div>
            )}
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
