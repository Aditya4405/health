import { type ReactNode, useMemo, useState } from 'react';
import { CalendarDays, Star, Users, FileClock, ClipboardPen } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageTransition } from '@/components/common/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePageTitle } from '@/hooks/usePageTitle';

interface ConsultationRequest {
  id: string;
  patientName: string;
  age: number;
  reason: string;
  report: string;
  dateRequested: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const initialRequests: ConsultationRequest[] = [
  {
    id: 'c1',
    patientName: 'Aarav Kapoor',
    age: 29,
    reason: 'Elevated LDL',
    report: 'Lipid Panel Jan 2025',
    dateRequested: 'Today 11:30 AM',
    status: 'pending',
  },
  {
    id: 'c2',
    patientName: 'Isha Verma',
    age: 41,
    reason: 'Fatigue and low hemoglobin',
    report: 'CBC Jan 2025',
    dateRequested: 'Yesterday',
    status: 'pending',
  },
  {
    id: 'c3',
    patientName: 'Rohan Das',
    age: 36,
    reason: 'Follow-up consult',
    report: 'Metabolic Panel',
    dateRequested: '2 days ago',
    status: 'pending',
  },
];

const reportQueue = [
  { id: 'r1', patient: 'Aarav Kapoor', type: 'Lipid Panel', date: 'Today', priority: 'Urgent' },
  { id: 'r2', patient: 'Isha Verma', type: 'CBC', date: 'Yesterday', priority: 'Normal' },
  { id: 'r3', patient: 'Rohan Das', type: 'Thyroid Panel', date: 'Yesterday', priority: 'Normal' },
];

export const DoctorDashboardPage = () => {
  usePageTitle('Doctor Dashboard');

  const [requests, setRequests] = useState(initialRequests);
  const [selectedPatient, setSelectedPatient] = useState<ConsultationRequest | null>(null);
  const [acceptingRequest, setAcceptingRequest] = useState<ConsultationRequest | null>(null);
  const [timeSlot, setTimeSlot] = useState('15:30');
  const [doctorMessage, setDoctorMessage] = useState('');

  const pendingCount = useMemo(() => requests.filter((request) => request.status === 'pending').length, [requests]);

  return (
    <DashboardLayout title="Doctor Dashboard">
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#dbe8f4] bg-white p-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Dr. Rahul Mehta, MD</h2>
              <Badge variant="teal" className="mt-2">
                Cardiologist
              </Badge>
            </div>
            <p className="text-sm text-[#60758a]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<Users className="h-5 w-5 text-teal" />} title="Patients Today" value="8" />
            <StatCard icon={<FileClock className="h-5 w-5 text-coral" />} title="Pending Reports" value="5" />
            <StatCard icon={<CalendarDays className="h-5 w-5 text-primary" />} title="Consultations This Week" value="23" />
            <StatCard icon={<Star className="h-5 w-5 text-amber" />} title="Avg Rating" value="4.8 ?" />
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Pending Consultation Requests</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full min-w-[840px] text-sm">
                <thead className="bg-[#f4f9fd] text-left text-[#4d6980]">
                  <tr>
                    <th className="px-4 py-3">Patient Name</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Report</th>
                    <th className="px-4 py-3">Date Requested</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className={`border-b border-[#edf2f7] ${
                        request.status === 'accepted'
                          ? 'bg-[#eff9ef]'
                          : request.status === 'rejected'
                            ? 'bg-[#fff4f3] text-[#8c4e41] line-through'
                            : 'hover:bg-[#f8fbff]'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{request.patientName}</td>
                      <td className="px-4 py-3">{request.age}</td>
                      <td className="px-4 py-3">{request.reason}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelectedPatient(request)} className="text-primary hover:underline">
                          View Report
                        </button>
                      </td>
                      <td className="px-4 py-3">{request.dateRequested}</td>
                      <td className="px-4 py-3">
                        {request.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="success" onClick={() => setAcceptingRequest(request)}>
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#e2a89b] text-[#b13a2f] hover:bg-[#faece7]"
                              onClick={() =>
                                setRequests((current) =>
                                  current.map((entry) => (entry.id === request.id ? { ...entry, status: 'rejected' } : entry)),
                                )
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge variant={request.status === 'accepted' ? 'success' : 'danger'}>{request.status}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reports Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportQueue.map((report) => (
                  <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#dbe8f4] p-4">
                    <div>
                      <p className="font-medium text-[#2d4f68]">{report.patient}</p>
                      <p className="text-sm text-[#60758a]">
                        {report.type} • {report.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.priority === 'Urgent' ? 'danger' : 'outline'}>{report.priority}</Badge>
                      <Button size="sm" onClick={() => setSelectedPatient(initialRequests[0])}>
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Notes / Prescription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="rounded-md bg-[#f3f8fd] p-3 text-sm text-[#4d6980]">
                  {selectedPatient ? `Selected: ${selectedPatient.patientName}` : 'Select a patient to add notes and prescriptions.'}
                </p>
                <Textarea placeholder="Clinical notes" />
                <div className="grid gap-2">
                  <Input placeholder="Medication name" />
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Dosage" />
                    <Input placeholder="Frequency" />
                    <Input placeholder="Duration" />
                  </div>
                  <Button variant="secondary">+ Add Row</Button>
                </div>
                <Button className="w-full" variant="success" disabled={!selectedPatient}>
                  Save & Send to Patient
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={Boolean(acceptingRequest)} onOpenChange={() => setAcceptingRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm consultation</DialogTitle>
              <DialogDescription>
                Confirm consultation with {acceptingRequest?.patientName}? Choose a time slot and optional message.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input type="time" value={timeSlot} onChange={(event) => setTimeSlot(event.target.value)} />
              <Textarea value={doctorMessage} onChange={(event) => setDoctorMessage(event.target.value)} placeholder="Add message (optional)" />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setAcceptingRequest(null)}>
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  if (!acceptingRequest) return;
                  setRequests((current) =>
                    current.map((entry) =>
                      entry.id === acceptingRequest.id
                        ? {
                            ...entry,
                            status: 'accepted',
                          }
                        : entry,
                    ),
                  );
                  setAcceptingRequest(null);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: ReactNode }) => (
  <Card className="card-hover">
    <CardContent className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[#5f7388]">{title}</p>
        {icon}
      </div>
      <p className="font-display text-3xl font-bold text-[#1f4f77]">{value}</p>
    </CardContent>
  </Card>
);


