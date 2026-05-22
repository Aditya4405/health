import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDownUp, Download, Printer, Share2, TriangleAlert } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useEffect } from 'react';
import { reportService } from '@/services/reportService';
import type { ReportMetric } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusStyles: Record<ReportMetric['status'], string> = {
  NORMAL: 'bg-[#eaf3de] text-[#3b6d11]',
  HIGH: 'border border-[#e2b5a7] bg-[#faece7] text-[#993c1d]',
  LOW: 'bg-[#faeeda] text-[#854f0b]',
  CRITICAL: 'animate-pulse border-2 border-[#a32d2d] bg-[#fcebeb] text-[#a32d2d]',
};

const priorityBadge: Record<'High' | 'Medium' | 'Low', string> = {
  High: 'bg-[#faece7] text-[#993c1d]',
  Medium: 'bg-[#faeeda] text-[#854f0b]',
  Low: 'bg-[#eaf3de] text-[#3b6d11]',
};

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
          <header className="flex flex-col gap-4 rounded-md border border-[#dbe8f4] bg-white p-5 shadow-card lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">{reportName}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">Blood Test</Badge>
                <Badge variant="outline">Uploaded 2 days ago</Badge>
                <Badge variant="outline">PDF</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="secondary">
                <Share2 className="mr-2 h-4 w-4" /> Share with Doctor
              </Button>
              <Button variant="secondary">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </header>

          {abnormalCount > 0 && (
            <div className="flex items-center gap-3 rounded-md border border-[#efc6b9] bg-[#faece7] px-4 py-3 text-[#90391f]">
              <TriangleAlert className="h-5 w-5" />
              <p>? {abnormalCount} values outside normal range - review highlighted results below</p>
            </div>
          )}

          <Card className="border-[#afa9ec] bg-[#eeedfe]">
            <CardHeader>
              <CardTitle className="text-[#5247af]">? AI-Generated Summary</CardTitle>
              <CardDescription className="text-[#4f5d7f]">{summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#6572a1]">This summary is AI-generated. Always consult a licensed physician.</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="summary">
            <TabsList className="w-full justify-start bg-transparent p-0">
              <TabsTrigger value="summary" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Summary
              </TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                Detailed Values
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <Card key={metric.id} className={metric.status === 'CRITICAL' ? 'border-2 border-[#a32d2d]' : ''}>
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-wide text-[#6c8297]">{metric.name}</p>
                      <p className="metric mt-2 text-2xl font-bold">
                        {metric.value} <span className="text-sm text-[#6c8297]">{metric.unit}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${metric.status === 'NORMAL' ? 'bg-[#639922]' : metric.status === 'HIGH' ? 'bg-[#e24b4a]' : metric.status === 'LOW' ? 'bg-[#ba7517]' : 'bg-[#a32d2d]'}`} />
                        <Badge className={statusStyles[metric.status]}>{metric.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Detailed Values</CardTitle>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search values..." className="md:w-64" />
                    <Button variant="secondary" onClick={() => setSortBy((current) => (current === 'name' ? 'value' : current === 'value' ? 'status' : 'name'))}>
                      <ArrowDownUp className="mr-2 h-4 w-4" /> Sort: {sortBy}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead className="bg-[#f4f9fd] text-left text-[#4d6980]">
                      <tr>
                        <th className="px-4 py-3">Test</th>
                        <th className="px-4 py-3">Result</th>
                        <th className="px-4 py-3">Unit</th>
                        <th className="px-4 py-3">Reference Range</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMetrics.map((metric) => (
                        <tr key={metric.id} className={`border-b border-[#ebf2f8] ${metric.status === 'HIGH' || metric.status === 'CRITICAL' ? 'bg-[#fff8f6]' : metric.status === 'LOW' ? 'bg-[#fffbf3]' : ''}`}>
                          <td className="px-4 py-3 font-medium">{metric.name}</td>
                          <td className="metric px-4 py-3">{metric.value}</td>
                          <td className="px-4 py-3">{metric.unit}</td>
                          <td className="px-4 py-3">{metric.referenceRange}</td>
                          <td className="px-4 py-3">
                            <Badge className={statusStyles[metric.status]}>{metric.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
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
                  <Card key={recommendation.title} className="card-hover">
                    <CardContent className="space-y-3 p-5">
                      <Badge className={priorityBadge[recommendation.priority]}>{recommendation.priority} Priority</Badge>
                      <h3 className="font-display text-lg font-semibold">{recommendation.title}</h3>
                      <p className="text-sm text-[#60758a]">{recommendation.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className="mt-5" onClick={() => navigate('/app/patient/doctors')}>
                Find a Specialist
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

