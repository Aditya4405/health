import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, CalendarClock, FileStack, HeartPulse } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { NotificationsPanel } from '@/components/common/NotificationsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { bloodSugarTrend, lipidPanel, recentPatientReports } from '@/data/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';

export const PatientDashboardPage = () => {
  usePageTitle('Patient Dashboard');

  return (
    <DashboardLayout title="Dashboard" rightPanel={<NotificationsPanel />}>
      <PageTransition>
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="card-hover">
              <CardContent className="p-5">
                <p className="text-sm text-[#5f7388]">Overall Health Score</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-bold text-teal">78</p>
                    <p className="mt-1 text-sm text-[#2f8a68]">? +3 from last month</p>
                  </div>
                  <MiniDonut progress={78} />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-5">
                <p className="text-sm text-[#5f7388]">Abnormal Values</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-bold text-coral">2</p>
                    <p className="mt-1 text-sm text-[#6f3a2c]">High cholesterol, Low iron</p>
                  </div>
                  <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-coral" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-5">
                <p className="text-sm text-[#5f7388]">Total Reports</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-bold text-primary">12</p>
                    <p className="mt-1 text-sm text-[#5f7388]">Last upload: 2 days ago</p>
                  </div>
                  <FileStack className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-5">
                <p className="text-sm text-[#5f7388]">Doctor Appointments</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="font-display text-4xl font-bold text-purple">1</p>
                    <p className="mt-1 text-sm text-[#5f7388]">Dr. Sharma - Tomorrow 3PM</p>
                  </div>
                  <CalendarClock className="h-6 w-6 text-purple" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-5 w-5 text-teal" />
                  Blood Glucose (mg/dL) - Last 6 months
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodSugarTrend} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e6f3" />
                    <XAxis dataKey="month" stroke="#5f7388" />
                    <YAxis stroke="#5f7388" />
                    <ReferenceArea y1={70} y2={100} fill="#eaf3de" fillOpacity={0.55} />
                    <ReferenceArea y1={100} y2={125} fill="#faeeda" fillOpacity={0.45} />
                    <ReferenceArea y1={125} y2={180} fill="#faece7" fillOpacity={0.4} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#378add" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-coral" />
                  Lipid Panel - Latest Report
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lipidPanel} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d7e6f3" />
                    <XAxis dataKey="name" stroke="#5f7388" />
                    <YAxis stroke="#5f7388" />
                    <ReferenceLine y={100} stroke="#1d9e75" strokeDasharray="4 4" />
                    <ReferenceLine y={160} stroke="#ba7517" strokeDasharray="4 4" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {lipidPanel.map((item) => (
                        <Cell key={item.name} fill={item.status === 'high' ? '#d85a30' : '#ba7517'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="ghost" size="sm">
                View All ?
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-y border-[#d9e4ee] bg-[#f4f9fd] text-[#4d6980]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Report Name</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatientReports.map((report) => (
                    <tr key={report.id} className="border-b border-[#edf2f7] hover:bg-[#f8fbff]">
                      <td className="px-5 py-4 font-medium text-[#2f4e67]">{report.name}</td>
                      <td className="px-5 py-4 text-[#60758a]">{report.date}</td>
                      <td className="px-5 py-4 text-[#60758a]">{report.type}</td>
                      <td className="px-5 py-4">
                        <Badge variant={report.status === 'ALERT' ? 'danger' : 'success'}>
                          {report.status === 'ALERT' ? '?' : '?'} {report.statusText}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

const MiniDonut = ({ progress }: { progress: number }) => {
  const radius = 22;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle stroke="#dbe8f3" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        stroke="#1d9e75"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 600ms ease' }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

