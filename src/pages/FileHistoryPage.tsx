import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, FileText, Search, Stethoscope, UploadCloud, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/utils/cn';

const files = [
  {
    id: 'f1',
    name: 'Complete Blood Count (CBC)',
    uploaded: '2 days ago',
    type: 'Blood Test',
    status: 'Needs Review',
    statusTone: 'warning',
    trend: 'stable',
    summary: 'Your hemoglobin and white blood cell levels are looking stable, but iron stores (ferritin) are on the lower side. We recommend checking back in a few weeks.',
    biomarkers: [
      { name: 'Hemoglobin', value: '13.2 g/dL', status: 'Normal', trend: 'stable' },
      { name: 'Ferritin', value: '18 ng/mL', status: 'Low', trend: 'down' },
    ],
    doctorNote: 'Let\'s repeat this CBC test in 2 weeks for trend confirmation.',
  },
  {
    id: 'f2',
    name: 'Lipid Panel',
    uploaded: '3 weeks ago',
    type: 'Cholesterol Test',
    status: 'Needs Review',
    statusTone: 'warning',
    trend: 'up',
    summary: 'Your LDL (sometimes called bad cholesterol) is slightly elevated at 180 mg/dL. Increasing daily fiber and regular movement can help support heart health.',
    biomarkers: [
      { name: 'LDL Cholesterol', value: '180 mg/dL', status: 'High', trend: 'up' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', status: 'Optimal', trend: 'stable' },
    ],
    doctorNote: 'Cardiology consult advised if unchanged in your next checkup.',
  },
  {
    id: 'f3',
    name: 'Thyroid Panel',
    uploaded: '6 weeks ago',
    type: 'Hormonal Test',
    status: 'All Clear',
    statusTone: 'success',
    trend: 'stable',
    summary: 'Your thyroid stimulating hormone (TSH) and thyroxine (T4) levels are perfectly balanced and within normal ranges. No actions needed.',
    biomarkers: [
      { name: 'TSH', value: '2.1 uIU/mL', status: 'Normal', trend: 'stable' },
      { name: 'Free T4', value: '1.2 ng/dL', status: 'Normal', trend: 'stable' },
    ],
    doctorNote: 'Continue your routine wellness schedule.',
  },
  {
    id: 'f4',
    name: 'Comprehensive Metabolic Panel',
    uploaded: '2 months ago',
    type: 'Metabolic Health',
    status: 'All Clear',
    statusTone: 'success',
    trend: 'stable',
    summary: 'Your kidney function, liver enzymes, and blood glucose are all stable and healthy. Remember to drink plenty of water throughout the day.',
    biomarkers: [
      { name: 'Fasting Glucose', value: '92 mg/dL', status: 'Normal', trend: 'stable' },
      { name: 'Kidney Function (eGFR)', value: '98 mL/min', status: 'Normal', trend: 'stable' },
    ],
    doctorNote: 'Maintain your active wellness baseline.',
  },
];

export const FileHistoryPage = () => {
  usePageTitle('Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <DashboardLayout title="Reports">
      <PageTransition>
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
          
          {/* Timeline Header Area */}
          <section className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-4 border-b border-[var(--portal-border)]">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Health Records</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Complete clinical timeline logs and biomarker reports</p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--portal-muted)]" />
                <input 
                  placeholder="Search health records..." 
                  className="input-premium !pl-10 w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to="/app/patient/upload" className="w-full sm:w-auto">
                <button
                  className="btn-premium btn-premium-primary w-full sm:w-auto"
                >
                  <UploadCloud className="mr-1.5 h-4 w-4" />
                  Upload Lab Results
                </button>
              </Link>
            </div>
          </section>

          {/* Dotted clinical timeline */}
          <section className="relative pl-8 md:pl-12 space-y-6">
            {/* Dotted Axis */}
            <div className="absolute left-[15px] md:left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#0ea5e9]/40 via-[var(--portal-border)] to-[var(--portal-border)] border-dashed border-l border-[var(--portal-border)]" />

            {filteredFiles.length === 0 ? (
              <div className="text-center py-16 text-secondary-premium text-[var(--portal-muted)]">
                No matching reports located in your profile logs.
              </div>
            ) : (
              filteredFiles.map((file) => {
                const isExpanded = expandedId === file.id;
                return (
                  <article key={file.id} className="relative group transition-all duration-300">
                    
                    {/* Glowing timeline node */}
                    <div className={cn(
                      "absolute -left-[28px] md:-left-[40px] top-[18px] z-10 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full border shadow-sm transition-all duration-300",
                      file.statusTone === 'warning'
                        ? "bg-warning/10 border-warning/20 text-warning"
                        : "bg-success/10 border-success/20 text-success"
                    )}>
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        file.statusTone === 'warning' ? "bg-warning" : "bg-success"
                      )} />
                    </div>

                    {/* Timeline Card */}
                    <div className="app-card app-card-hover overflow-hidden">
                      {/* Accordion header */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(file.id)}
                        className="flex w-full items-center justify-between py-3.5 px-5 text-left transition-colors hover:bg-[var(--portal-elevated)]/50"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--portal-elevated)] border border-[var(--portal-border)] text-[#0ea5e9]">
                            <FileText className="h-5 w-5" />
                          </span>
                          <div>
                            <h4 className="text-body-premium text-[var(--portal-text)] font-semibold">{file.name}</h4>
                            <p className="text-secondary-premium text-[var(--portal-muted)] mt-0.5">
                              {file.type} • {file.uploaded}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Mini Trend Arrow */}
                          <span className={cn(
                            "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                            file.trend === 'up'
                              ? "bg-warning/10 border-warning/20 text-warning"
                              : "bg-success/10 border-success/20 text-success"
                          )}>
                            {file.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {file.trend === 'up' ? 'Watch' : 'Stable'}
                          </span>

                          <span className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
                            file.statusTone === 'warning'
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          )}>
                            {file.status}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[var(--portal-muted)]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[var(--portal-muted)]" />
                          )}
                        </div>
                      </button>

                      {/* Expandable panel height animation */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <div className="border-t border-[var(--portal-border)] bg-gradient-to-b from-[var(--portal-elevated)]/20 to-transparent p-5 space-y-5">
                              
                              {/* Summary */}
                              <div className="space-y-1">
                                <p className="text-label-premium text-[var(--portal-muted)]">AI Companion Summary</p>
                                <p className="text-body-premium text-[var(--portal-text)]">{file.summary}</p>
                              </div>

                              {/* Biomarker details table */}
                              <div className="space-y-2">
                                <p className="text-label-premium text-[var(--portal-muted)]">Analyzed Biomarkers</p>
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                  {file.biomarkers.map((bio) => (
                                    <div key={bio.name} className="flex items-center justify-between rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] px-4 py-3 text-secondary-premium">
                                      <span className="font-semibold text-[var(--portal-text)]">{bio.name}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[var(--portal-text)]">{bio.value}</span>
                                        <span className={cn(
                                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase border",
                                          bio.status === 'Normal' || bio.status === 'Optimal'
                                            ? "bg-success/10 border-success/20 text-success"
                                            : "bg-warning/10 border-warning/20 text-warning"
                                        )}>
                                          {bio.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Companion note */}
                              <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/50 p-4 text-secondary-premium text-[var(--portal-muted)] flex items-start gap-2.5">
                                <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-[#0ea5e9]" />
                                <div>
                                  <p className="font-bold text-[var(--portal-text)] mb-0.5">Recommended Plan</p>
                                  <p className="leading-relaxed font-medium">{file.doctorNote}</p>
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="flex flex-wrap gap-2.5 pt-1">
                                <Link to={`/app/patient/analysis/${file.id}`}>
                                  <button className="btn-premium btn-premium-primary h-9 px-4 text-xs rounded-xl">
                                    Companion Analysis
                                  </button>
                                </Link>
                                <button 
                                  className="btn-premium btn-premium-secondary h-9 px-4 text-xs rounded-xl"
                                >
                                  <Download className="mr-1.5 h-3.5 w-3.5" />
                                  Download PDF
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </article>
                );
              })
            )}
          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
