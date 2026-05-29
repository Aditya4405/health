import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  ChartBar, 
  TrendingUp, 
  Users, 
  Heart, 
  ClipboardCheck, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Star,
  FileText
} from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { cn } from '@/utils/cn';

// Mock data mapping based on timeframe filter
const analyticsDataByFilter = {
  Today: {
    recovery: [
      { label: '09:00', normalized: 90, active: 94 },
      { label: '12:00', normalized: 91, active: 95 },
      { label: '15:00', normalized: 92, active: 95 },
      { label: '18:00', normalized: 92, active: 96 }
    ],
    volume: [
      { label: '09:00', volume: 2, accuracy: 98.2 },
      { label: '12:00', volume: 4, accuracy: 98.9 },
      { label: '15:00', volume: 3, accuracy: 98.4 },
      { label: '18:00', volume: 1, accuracy: 99.1 }
    ],
    metrics: { recoveryRate: '92.4%', reportVolume: '10 files', aiAccuracy: '98.6%', consultSuccess: '100%', patientSatisfaction: '4.95 / 5' }
  },
  Week: {
    recovery: [
      { label: 'Mon', normalized: 82, active: 89 },
      { label: 'Tue', normalized: 85, active: 91 },
      { label: 'Wed', normalized: 88, active: 92 },
      { label: 'Thu', normalized: 87, active: 94 },
      { label: 'Fri', normalized: 92, active: 95 }
    ],
    volume: [
      { label: 'Mon', volume: 12, accuracy: 98.1 },
      { label: 'Tue', volume: 15, accuracy: 98.4 },
      { label: 'Wed', volume: 8, accuracy: 98.7 },
      { label: 'Thu', volume: 14, accuracy: 98.6 },
      { label: 'Fri', volume: 10, accuracy: 98.9 }
    ],
    metrics: { recoveryRate: '92.0%', reportVolume: '59 files', aiAccuracy: '98.5%', consultSuccess: '99.2%', patientSatisfaction: '4.92 / 5' }
  },
  Month: {
    recovery: [
      { label: 'Wk 1', normalized: 76, active: 84 },
      { label: 'Wk 2', normalized: 81, active: 88 },
      { label: 'Wk 3', normalized: 86, active: 91 },
      { label: 'Wk 4', normalized: 92, active: 95 }
    ],
    volume: [
      { label: 'Wk 1', volume: 42, accuracy: 97.9 },
      { label: 'Wk 2', volume: 48, accuracy: 98.2 },
      { label: 'Wk 3', volume: 38, accuracy: 98.5 },
      { label: 'Wk 4', volume: 53, accuracy: 98.8 }
    ],
    metrics: { recoveryRate: '91.8%', reportVolume: '181 files', aiAccuracy: '98.3%', consultSuccess: '99.4%', patientSatisfaction: '4.90 / 5' }
  },
  Year: {
    recovery: [
      { label: 'Jan', normalized: 65, active: 85 },
      { label: 'Feb', normalized: 68, active: 88 },
      { label: 'Mar', normalized: 75, active: 90 },
      { label: 'Apr', normalized: 82, active: 84 },
      { label: 'May', normalized: 88, active: 94 },
      { label: 'Jun', normalized: 92, active: 95 }
    ],
    volume: [
      { label: 'Jan', volume: 120, accuracy: 97.2 },
      { label: 'Feb', volume: 145, accuracy: 97.5 },
      { label: 'Mar', volume: 189, accuracy: 98.1 },
      { label: 'Apr', volume: 160, accuracy: 98.0 },
      { label: 'May', volume: 210, accuracy: 98.4 },
      { label: 'Jun', volume: 224, accuracy: 98.7 }
    ],
    metrics: { recoveryRate: '92.2%', reportVolume: '1,048 files', aiAccuracy: '98.1%', consultSuccess: '99.5%', patientSatisfaction: '4.88 / 5' }
  }
};

const demographicData = [
  { name: '18-29', value: 124, color: '#38bdf8' },
  { name: '30-45', value: 245, color: '#7f77dd' },
  { name: '46-60', value: 189, color: '#10b981' },
  { name: '60+', value: 98, color: '#f59e0b' }
];

export const DoctorAnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Week');
  
  const data = useMemo(() => analyticsDataByFilter[timeframe], [timeframe]);
  const totalDemographics = useMemo(() => demographicData.reduce((acc, c) => acc + c.value, 0), []);

  return (
    <DashboardLayout title="Insights & Analytics">
      <PageTransition>
        <div className="space-y-5 text-[var(--portal-text)]">
          
          {/* Header */}
          <div className="pb-3 border-b border-[var(--portal-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-section-title text-[var(--portal-text)]">Practice Insights & Efficacy Analytics</h2>
              <p className="text-[11px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">
                Practice clinical efficacy indices, AI diagnostic trust ratios, and patient satisfaction parameters
              </p>
            </div>
            
            {/* Timeframe selector toolbar */}
            <div className="flex bg-[var(--portal-elevated)]/40 border border-[var(--portal-border)] rounded-xl p-0.5 self-start md:self-auto shrink-0">
              {(['Today', 'Week', 'Month', 'Year'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTimeframe(mode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                    timeframe === mode 
                      ? "bg-[var(--portal-surface)] text-[#0ea5e9] shadow-sm" 
                      : "text-[var(--portal-muted)] hover:text-[var(--portal-text)]"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Metric cards deck */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricWidget 
              icon={<Heart className="h-4.5 w-4.5 text-[#0ea5e9]" />}
              title="Recovery Rate"
              value={data.metrics.recoveryRate}
              subtext="Biomarker normalization"
            />
            <MetricWidget 
              icon={<FileText className="h-4.5 w-4.5 text-amber-500" />}
              title="Report Volume"
              value={data.metrics.reportVolume}
              subtext="Triage files processed"
            />
            <MetricWidget 
              icon={<Sparkles className="h-4.5 w-4.5 text-[#7f77dd]" />}
              title="AI Accuracy"
              value={data.metrics.aiAccuracy}
              subtext="Validation index"
            />
            <MetricWidget 
              icon={<CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />}
              title="Consult Success"
              value={data.metrics.consultSuccess}
              subtext="Completed video slots"
            />
            <MetricWidget 
              icon={<Star className="h-4.5 w-4.5 text-yellow-500" />}
              title="Satisfaction"
              value={data.metrics.patientSatisfaction}
              subtext="Patient scoring log"
            />
          </section>

          {/* Primary Efficacy & Volume Graphs */}
          <section className="grid gap-5 lg:grid-cols-12">
            
            {/* Left Primary Chart: Recovery trends */}
            <article className="lg:col-span-7 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Biomarker Normalization Index</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Percentage of patients achieving optimal values within 60 days</p>
              </div>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.recovery} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                    <XAxis dataKey="label" stroke="var(--portal-muted)" />
                    <YAxis stroke="var(--portal-muted)" domain={[50, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--portal-surface)', 
                        borderColor: 'var(--portal-border)', 
                        color: 'var(--portal-text)',
                        borderRadius: '12px' 
                      }} 
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }} />
                    <Area type="monotone" dataKey="normalized" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" name="Target Normalized" />
                    <Area type="monotone" dataKey="active" stroke="#7f77dd" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorActive)" name="Active Therapy" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Right Primary Chart: Volume and matching accuracy */}
            <article className="lg:col-span-5 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Report Volume & AI Efficacy</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Triage intake quantities mapped with model diagnostic accuracy</p>
              </div>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.volume} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="label" stroke="var(--portal-muted)" />
                    <YAxis stroke="var(--portal-muted)" />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--portal-surface)', 
                        borderColor: 'var(--portal-border)', 
                        color: 'var(--portal-text)',
                        borderRadius: '12px' 
                      }} 
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }} />
                    <Line type="monotone" dataKey="volume" stroke="#38bdf8" strokeWidth={2} name="Intake Files" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={1.5} strokeDasharray="2 2" name="AI Match %" dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

          </section>

          {/* Demographic summary panels */}
          <section className="grid gap-5 lg:grid-cols-12">
            
            {/* Demographics Bar Chart */}
            <article className="lg:col-span-6 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Patient Demographics</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Roster sorted by patient age cohorts</p>
              </div>
              <div className="h-60 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
            </article>

            {/* Recovery Success Summary list */}
            <article className="lg:col-span-6 app-card p-5 space-y-4">
              <div>
                <h3 className="text-card-title text-[var(--portal-text)]">Efficacy Normalization Records</h3>
                <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase tracking-wider mt-0.5">Recent clinical sign-offs achieving normal baselines</p>
              </div>

              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                <RecoveryRecordRow patient="Aarav Kapoor" lab="CBC Hematology" normalTime="14 Days" rating="Highly Responsive" />
                <RecoveryRecordRow patient="Isha Verma" lab="Lipid Panel" normalTime="28 Days" rating="Stable Recovery" />
                <RecoveryRecordRow patient="Karan Malhotra" lab="Cardiology ECG" normalTime="42 Days" rating="Responsive Statin" />
              </div>
            </article>

          </section>

        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const MetricWidget = ({ icon, title, value, subtext }: { icon: React.ReactNode; title: string; value: string; subtext: string }) => (
  <div className="app-card p-4 space-y-3 hover:scale-[1.01] transition-transform duration-200">
    <div className="flex justify-between items-center gap-2">
      <p className="text-[10px] text-[var(--portal-muted)] font-bold uppercase tracking-wider">{title}</p>
      <span className="h-8.5 w-8.5 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-elevated)]/30 flex items-center justify-center">
        {icon}
      </span>
    </div>
    <div className="space-y-1">
      <p className="font-mono text-2xl font-extrabold text-[var(--portal-text)] leading-none">{value}</p>
      <p className="text-[10px] text-[var(--portal-muted)] font-medium leading-tight">{subtext}</p>
    </div>
  </div>
);

const RecoveryRecordRow = ({ patient, lab, normalTime, rating }: { patient: string; lab: string; normalTime: string; rating: string }) => (
  <div className="flex justify-between items-center p-3 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/20 text-xs">
    <div>
      <span className="font-bold text-[var(--portal-text)]">{patient}</span>
      <span className="block text-[9px] text-[var(--portal-muted)] mt-0.5">{lab}</span>
    </div>
    <div className="text-right space-y-1">
      <span className="font-mono font-bold block text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded text-[10px]">{normalTime}</span>
      <span className="text-[9px] text-emerald-500 font-semibold uppercase">{rating}</span>
    </div>
  </div>
);
