import { type ReactElement, type ReactNode, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Activity, DatabaseZap, ServerCrash, UsersRound } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { adminQuickMetrics } from '@/data/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePageTitle } from '@/hooks/usePageTitle';

const activeUsersData = Array.from({ length: 30 }, (_, index) => ({ day: index + 1, users: 900 + Math.round(Math.random() * 460) }));
const reportsByType = [
  { type: 'CBC', count: 1400 },
  { type: 'Lipid', count: 1220 },
  { type: 'Thyroid', count: 860 },
  { type: 'Metabolic', count: 940 },
];
const userPlanDistribution = [
  { name: 'Free', value: 62, color: '#378add' },
  { name: 'Pro', value: 28, color: '#1d9e75' },
  { name: 'Team', value: 10, color: '#7f77dd' },
];
const revenueData = [
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
].map((month, index) => ({ month, value: 1.2 + index * 0.18 + Math.random() * 0.2 }));

const initialUsers = [
  { id: 'U1021', name: 'Aarav Kapoor', email: 'aarav@email.com', plan: 'PRO', reports: 12, status: 'Active', joined: '2025-01-10' },
  { id: 'U2044', name: 'Isha Verma', email: 'isha@email.com', plan: 'FREE', reports: 4, status: 'Pending', joined: '2025-02-06' },
  { id: 'U3772', name: 'Rohan Das', email: 'rohan@email.com', plan: 'TEAM', reports: 33, status: 'Suspended', joined: '2024-11-19' },
  { id: 'U4110', name: 'Meera Jain', email: 'meera@email.com', plan: 'PRO', reports: 18, status: 'Active', joined: '2025-01-26' },
];

const doctorQueue = [
  { id: 'D201', name: 'Dr. Sneha Roy', specialty: 'Cardiologist', credential: 'MBBS, MD', regNo: 'UPMCI-12213' },
  { id: 'D202', name: 'Dr. Akash Nair', specialty: 'Endocrinologist', credential: 'MBBS, DM', regNo: 'UPMCI-99312' },
];

export const AdminPanelPage = () => {
  usePageTitle('Admin Panel');

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dangerTarget, setDangerTarget] = useState<{ id: string; action: 'Suspend' | 'Delete' } | null>(null);
  const [confirmationText, setConfirmationText] = useState('');

  const filteredUsers = useMemo(
    () => users.filter((user) => `${user.id} ${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())),
    [search, users],
  );

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  };

  return (
    <DashboardLayout title="Admin Panel">
      <PageTransition>
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {adminQuickMetrics.map((metric) => (
              <Card key={metric.label} className="card-hover">
                <CardContent className="p-5">
                  <p className="text-sm text-[#60758a]">{metric.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-[#1d4d75]">{metric.value}</p>
                  <p className="mt-1 text-sm text-[#1d9e75]">{metric.delta}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <ChartCard title="Daily Active Users - Last 30 days">
              <LineChart data={activeUsersData} margin={{ left: -8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e7f3" />
                <XAxis dataKey="day" stroke="#617a8f" />
                <YAxis stroke="#617a8f" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#378add" strokeWidth={3} dot={false} />
              </LineChart>
            </ChartCard>

            <ChartCard title="Reports by Type">
              <BarChart data={reportsByType} margin={{ left: -8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e7f3" />
                <XAxis dataKey="type" stroke="#617a8f" />
                <YAxis stroke="#617a8f" />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#1d9e75" />
              </BarChart>
            </ChartCard>

            <ChartCard title="User Plan Distribution">
              <PieChart>
                <Pie data={userPlanDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={4}>
                  {userPlanDistribution.map((segment) => (
                    <Cell key={segment.name} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartCard>

            <ChartCard title="Revenue Trend - Last 12 months">
              <AreaChart data={revenueData} margin={{ left: -8, right: 8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7f77dd" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#7f77dd" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e7f3" />
                <XAxis dataKey="month" stroke="#617a8f" />
                <YAxis stroke="#617a8f" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7f77dd" fill="url(#revFill)" strokeWidth={2.5} />
              </AreaChart>
            </ChartCard>
          </section>

          <Card>
            <CardHeader className="flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="flex flex-col gap-2 md:flex-row">
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users..." className="md:w-72" />
                <Button variant="secondary">Bulk Action ({selectedUsers.length})</Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[930px] text-sm">
                <thead className="bg-[#f4f9fd] text-left text-[#4d6980]">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onChange={(event) =>
                          setSelectedUsers(event.target.checked ? filteredUsers.map((user) => user.id) : [])
                        }
                      />
                    </th>
                    {['ID', 'Name', 'Email', 'Plan', 'Reports', 'Status', 'Joined', 'Actions'].map((label) => (
                      <th key={label} className="px-4 py-3 font-medium">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={`border-b border-[#edf2f7] ${index % 2 === 0 ? 'bg-[#fcfeff]' : 'bg-white'} hover:bg-[#f5faff]`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUserSelection(user.id)} />
                      </td>
                      <td className="px-4 py-3 font-medium">{user.id}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.plan}</td>
                      <td className="px-4 py-3">{user.reports}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            user.status === 'Active'
                              ? 'bg-[#eaf3de] text-[#3b6d11]'
                              : user.status === 'Suspended'
                                ? 'bg-[#faece7] text-[#993c1d]'
                                : 'bg-[#faeeda] text-[#854f0b]'
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{user.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setDangerTarget({ id: user.id, action: 'Suspend' })}>
                            Suspend
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => setDangerTarget({ id: user.id, action: 'Delete' })}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Approval Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {doctorQueue.map((doctor) => (
                  <div key={doctor.id} className="rounded-md border border-[#dbe8f4] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#2d4f68]">{doctor.name}</p>
                        <p className="text-sm text-[#60758a]">
                          {doctor.specialty} • {doctor.credential} • {doctor.regNo}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">
                          Approve
                        </Button>
                        <Button size="sm" variant="danger">
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          Request Info
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <HealthMetric icon={<Activity className="h-4 w-4 text-[#639922]" />} label="API Response Time" value="182ms" tone="green" />
                <HealthMetric icon={<DatabaseZap className="h-4 w-4 text-[#639922]" />} label="DB Queries/sec" value="2,142" tone="green" />
                <HealthMetric icon={<UsersRound className="h-4 w-4 text-[#ba7517]" />} label="Storage Used" value="73%" tone="amber" />
                <HealthMetric icon={<ServerCrash className="h-4 w-4 text-[#e24b4a]" />} label="Error Rate" value="0.7%" tone="red" />
                <div>
                  <p className="mb-2 text-sm font-medium text-[#4d6980]">Last 24h Uptime</p>
                  <div className="grid grid-cols-24 gap-1">
                    {Array.from({ length: 24 }, (_, index) => (
                      <span key={index} className={`h-3 rounded-sm ${index === 7 || index === 17 ? 'bg-[#e24b4a]' : 'bg-[#5ca335]'}`} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={Boolean(dangerTarget)} onOpenChange={() => setDangerTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dangerTarget?.action} user account</DialogTitle>
              <DialogDescription>
                This is a sensitive action. Type {dangerTarget?.action?.toUpperCase()} to confirm.
              </DialogDescription>
            </DialogHeader>
            <Input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} placeholder="Type confirmation" />
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDangerTarget(null)}>
                Cancel
              </Button>
              <Button
                variant={dangerTarget?.action === 'Delete' ? 'danger' : 'outline'}
                disabled={confirmationText !== dangerTarget?.action?.toUpperCase()}
                onClick={() => {
                  if (!dangerTarget) return;
                  if (dangerTarget.action === 'Delete') {
                    setUsers((current) => current.filter((entry) => entry.id !== dangerTarget.id));
                  } else {
                    setUsers((current) =>
                      current.map((entry) => (entry.id === dangerTarget.id ? { ...entry, status: 'Suspended' } : entry)),
                    );
                  }
                  setConfirmationText('');
                  setDangerTarget(null);
                }}
              >
                Confirm {dangerTarget?.action}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

const ChartCard = ({ title, children }: { title: string; children: ReactElement }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const HealthMetric = ({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'red';
  icon: ReactNode;
}) => (
  <div className="rounded-md border border-[#dbe8f4] p-3">
    <div className="mb-1 flex items-center justify-between">
      <p className="inline-flex items-center gap-1 text-sm text-[#4e6880]">
        {icon} {label}
      </p>
      <span className={`text-sm font-semibold ${tone === 'green' ? 'text-[#3b6d11]' : tone === 'amber' ? 'text-[#854f0b]' : 'text-[#a32d2d]'}`}>
        {value}
      </span>
    </div>
  </div>
);


