import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDownUp, Download, Printer, Share2, TriangleAlert, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { reportService } from '@/services/reportService';
import type { ReportMetric } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export const ReportAnalysisPage = () => {
  usePageTitle('Report Analysis');

  const navigate = useNavigate();
  const { reportId = 'mock-report-id' } = useParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'status'>('name');
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [summary, setSummary] = useState('');
  const [reportName, setReportName] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const report = await reportService.analyzeReport(reportId);
      setMetrics(report.metrics);
      setSummary(report.summary);
      setReportName(report.reportName);
      setLoading(false);
    };

    void load();
  }, [reportId]);

  const handleDownload = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Preparing PDF download...',
        success: 'Report PDF downloaded successfully!',
        error: 'Failed to download PDF.',
      }
    );
  };

  const handleShare = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Sharing report details with doctor...',
        success: 'Report shared successfully with Dr. Aarav Kapoor!',
        error: 'Failed to share report.',
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const abnormalCount = metrics.filter((metric) => metric.status !== 'NORMAL').length;

  const filteredMetrics = useMemo(() => {
    const normalized = search.toLowerCase();
    const searched = metrics.filter((metric) => metric.name.toLowerCase().includes(normalized));
    return [...searched].sort((a, b) => {
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return a.name.localeCompare(b.name);
    });
  }, [metrics, search, sortBy]);

  if (loading) {
    return (
      <DashboardLayout title="Report Analysis">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-[440px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Report Analysis">
      <PageTransition>
        <div className="space-y-5">
          <header className="flex flex-col gap-4 app-card p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-page-title text-[var(--portal-text)]">{reportName}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">Blood Test</span>
                <span className="border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">Uploaded 2 days ago</span>
                <span className="border border-[var(--portal-border)] bg-[var(--portal-elevated)] text-[var(--portal-muted)] text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">PDF</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button className="btn-premium btn-premium-secondary" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </button>
              <button className="btn-premium btn-premium-secondary" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share with Doctor
              </button>
              <button className="btn-premium btn-premium-secondary" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </button>
            </div>
          </header>

          {abnormalCount > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3.5 text-warning">
              <TriangleAlert className="h-5 w-5 shrink-0" />
              <p className="text-secondary-premium font-semibold uppercase tracking-wider">
                {abnormalCount} values outside normal range — review highlighted results below
              </p>
            </div>
          )}

          <div className="app-card p-6 relative overflow-hidden bg-gradient-to-br from-[#7f77dd]/5 to-transparent border-[#7f77dd]/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#7f77dd]" />
                <h3 className="text-card-title text-[#7f77dd] font-bold">AI-Generated Summary</h3>
              </div>
              <p className="text-body-premium text-[var(--portal-text)]/90 leading-relaxed">{summary}</p>
              <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider">
                This summary is AI-generated. Always consult a licensed physician.
              </p>
            </div>
          </div>

          <Tabs defaultValue="summary">
            <TabsList className="w-full justify-start bg-transparent p-0 border-b border-[var(--portal-border)] gap-6 mb-5">
              <TabsTrigger 
                value="summary" 
                className="rounded-none pb-3 border-b-2 border-transparent text-[var(--portal-muted)] data-[state=active]:text-[#0ea5e9] data-[state=active]:border-[#0ea5e9] bg-transparent text-sm font-semibold tracking-wide"
              >
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="rounded-none pb-3 border-b-2 border-transparent text-[var(--portal-muted)] data-[state=active]:text-[#0ea5e9] data-[state=active]:border-[#0ea5e9] bg-transparent text-sm font-semibold tracking-wide"
              >
                Detailed Values
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="rounded-none pb-3 border-b-2 border-transparent text-[var(--portal-muted)] data-[state=active]:text-[#0ea5e9] data-[state=active]:border-[#0ea5e9] bg-transparent text-sm font-semibold tracking-wide"
              >
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <div 
                    key={metric.id} 
                    className={cn(
                      "app-card app-card-hover p-5 space-y-3 relative overflow-hidden",
                      metric.status === 'CRITICAL' && "border-danger/60 bg-danger/5 shadow-[0_0_15px_rgba(226,75,74,0.15)] animate-pulse"
                    )}
                  >
                    <p className="text-label-premium text-[var(--portal-muted)]">{metric.name}</p>
                    <p className="metric text-3xl font-bold text-[var(--portal-text)]">
                      {metric.value} <span className="text-sm font-normal text-[var(--portal-muted)]">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        metric.status === 'NORMAL' && "bg-success",
                        metric.status === 'HIGH' && "bg-danger",
                        metric.status === 'LOW' && "bg-warning",
                        metric.status === 'CRITICAL' && "bg-danger animate-ping"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border",
                        metric.status === 'NORMAL' && "bg-success/10 text-success border-success/20",
                        metric.status === 'HIGH' && "bg-danger/10 text-danger border-danger/20",
                        metric.status === 'LOW' && "bg-warning/10 text-warning border-warning/20",
                        metric.status === 'CRITICAL' && "bg-danger/20 text-danger border-danger/30"
                      )}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="app-card overflow-hidden">
                <div className="p-6 flex flex-col gap-4 border-b border-[var(--portal-border)] md:flex-row md:items-center md:justify-between">
                  <h3 className="text-card-title text-[var(--portal-text)]">Detailed Values</h3>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input 
                      value={search} 
                      onChange={(event) => setSearch(event.target.value)} 
                      placeholder="Search values..." 
                      className="input-premium w-full sm:w-64" 
                    />
                    <button 
                      className="btn-premium btn-premium-secondary"
                      onClick={() => setSortBy((current) => (current === 'name' ? 'value' : current === 'value' ? 'status' : 'name'))}
                    >
                      <ArrowDownUp className="mr-2 h-4 w-4" /> Sort: {sortBy}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--portal-elevated)]/50 border-b border-[var(--portal-border)]">
                        <th className="px-6 py-3.5 text-label-premium text-[var(--portal-muted)]">Test</th>
                        <th className="px-6 py-3.5 text-label-premium text-[var(--portal-muted)]">Result</th>
                        <th className="px-6 py-3.5 text-label-premium text-[var(--portal-muted)]">Unit</th>
                        <th className="px-6 py-3.5 text-label-premium text-[var(--portal-muted)]">Reference Range</th>
                        <th className="px-6 py-3.5 text-label-premium text-[var(--portal-muted)]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--portal-border)]">
                      {filteredMetrics.map((metric) => (
                        <tr 
                          key={metric.id} 
                          className={cn(
                            "hover:bg-[var(--portal-elevated)]/30 transition-colors duration-150",
                            (metric.status === 'HIGH' || metric.status === 'CRITICAL') && "bg-danger/[0.02]",
                            metric.status === 'LOW' && "bg-warning/[0.02]"
                          )}
                        >
                          <td className="px-6 py-4 text-body-premium font-semibold text-[var(--portal-text)]">{metric.name}</td>
                          <td className="metric px-6 py-4 text-body-premium font-bold text-[var(--portal-text)]">{metric.value}</td>
                          <td className="px-6 py-4 text-body-premium text-[var(--portal-muted)]">{metric.unit}</td>
                          <td className="px-6 py-4 text-body-premium text-[var(--portal-muted)]">{metric.referenceRange}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border inline-block",
                              metric.status === 'NORMAL' && "bg-success/10 text-success border-success/20",
                              metric.status === 'HIGH' && "bg-danger/10 text-danger border-danger/20",
                              metric.status === 'LOW' && "bg-warning/10 text-warning border-warning/20",
                              metric.status === 'CRITICAL' && "bg-danger/20 text-danger border-danger/30"
                            )}>
                              {metric.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Consult a hematologist for low hemoglobin',
                    body: 'Your hemoglobin trend is mildly below normal. A specialist can guide further tests and treatment.',
                    priority: 'High' as const,
                  },
                  {
                    title: 'Increase iron-rich foods in your diet',
                    body: 'Include spinach, lentils, legumes, and iron-fortified foods with vitamin C sources for absorption.',
                    priority: 'Medium' as const,
                  },
                  {
                    title: 'Follow up CBC test in 4 weeks',
                    body: 'A follow-up test helps validate whether interventions are improving your values.',
                    priority: 'Low' as const,
                  },
                ].map((recommendation) => (
                  <div key={recommendation.title} className="app-card app-card-hover p-6 space-y-4">
                    <div>
                      <span className={cn(
                        "text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border",
                        recommendation.priority === 'High' && "bg-danger/10 text-danger border-danger/20",
                        recommendation.priority === 'Medium' && "bg-warning/10 text-warning border-warning/20",
                        recommendation.priority === 'Low' && "bg-success/10 text-success border-success/20"
                      )}>
                        {recommendation.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-card-title text-[var(--portal-text)] font-semibold leading-snug">{recommendation.title}</h3>
                    <p className="text-secondary-premium text-[var(--portal-muted)] leading-relaxed">{recommendation.body}</p>
                  </div>
                ))}
              </div>
              <button 
                className="btn-premium btn-premium-primary mt-6" 
                onClick={() => navigate('/app/patient/doctors')}
              >
                Find a Specialist
              </button>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};
