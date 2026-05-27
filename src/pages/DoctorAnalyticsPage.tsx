import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { ChartBar, TrendingUp, Users, Heart, ClipboardCheck, Sparkles } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { cn } from '@/utils/cn';

const recoveryData = [
  { month: 'Jan', normalized: 65, active: 85 },
  { month: 'Feb', normalized: 68, active: 88 },
  { month: 'Mar', normalized: 75, active: 90 },
  { month: 'Apr', normalized: 82, active: 84 },
  { month: 'May', normalized: 88, active: 94 },
  { month: 'Jun', normalized: 92, active: 95 }
];

const demographicData = [
  { name: '18-29', value: 124, color: '#38bdf8' },
  { name: '30-45', value: 245, color: '#7f77dd' },
  { name: '46-60', value: 189, color: '#10b981' },
  { name: '60+', value: 98, color: '#f59e0b' }
];

export const DoctorAnalyticsPage = () => {
  const totalInquiries = useMemo(() => demographicData.reduce((acc, curr) => acc + curr.value, 0), []);

  return (
    <DashboardLayout title="Analytics">
      <PageTransition>
        <div className="space-y-6 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-4 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Practice Insights & Analytics</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Practice clinical efficacy indices, biomarker sync rates, and satisfaction metrics
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-3.5 w-3.5" /> Efficacy Index: 92% (+3.4%)
            </div>
          </div>

          {/* Stats Deck */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Active Inquiries" value={String(totalInquiries)} subtext="+12 this month" />
            <MetricCard title="AI Diagnostic Accuracy" value="98.7%" subtext="Validated by panel" />
            <MetricCard title="Avg Recovery Duration" value="42 Days" subtext="-3 days from last Q" />
            <MetricCard title="Diagnostic Trust Index" value="4.92 / 5" subtext="Patient score log" />
          </section>

          {/* Charts Section */}
          <section className="grid gap-6 lg:grid-cols-12">
            
            {/* Primary chart: Recovery Index */}
            <article className="lg:col-span-8 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Biomarker Normalization Index</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Percentage of patients achieving optimal values within 60 days</p>
              </div>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recoveryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7f77dd" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#7f77dd" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="var(--portal-muted)" />
                    <YAxis stroke="var(--portal-muted)" domain={[50, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--portal-surface)', 
                        borderColor: 'var(--portal-border)', 
                        color: 'var(--portal-text)',
                        borderRadius: '12px' 
                      }} 
                    />
                    <Area type="monotone" dataKey="normalized" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" name="Target Normalized" />
                    <Area type="monotone" dataKey="active" stroke="#7f77dd" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorActive)" name="Active Therapy" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Side Chart: Demographics */}
            <article className="lg:col-span-4 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Demographics</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Roster sorted by patient age groups</p>
              </div>
              <div className="h-60 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="var(--portal-muted)" />
                    <YAxis stroke="var(--portal-muted)" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--portal-surface)', 
                        borderColor: 'var(--portal-border)', 
                        color: 'var(--portal-text)',
                        borderRadius: '12px' 
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-[var(--portal-border)]/50 justify-center">
                {demographicData.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-[var(--portal-muted)] font-semibold uppercase">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name} ({Math.round((d.value/totalInquiries)*100)}%)</span>
                  </div>
                ))}
              </div>
            </article>

          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const MetricCard = ({ title, value, subtext }: { title: string; value: string; subtext: string }) => (
  <div className="app-card p-5 hover:scale-[1.01] transition-transform duration-200">
    <p className="text-[9px] text-[var(--portal-muted)] font-bold uppercase tracking-wider">{title}</p>
    <p className="font-mono text-3xl font-extrabold text-[var(--portal-text)] mt-2 leading-none">{value}</p>
    <p className="text-[10px] text-[var(--portal-muted)] mt-2 font-semibold">{subtext}</p>
  </div>
);
