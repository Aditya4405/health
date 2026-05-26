import {
  Activity,
  FileText,
  UploadCloud,
  Search,
  Bot,
  Settings,
  Users,
  ClipboardList,
  Calendar,
  NotebookText,
  Shield,
  LayoutDashboard,
  Stethoscope,
  ChartNoAxesCombined,
  ServerCog,
  UserCheck,
  Bell,
  MessageSquare,
} from 'lucide-react';
import type { Role } from '@/types';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof Activity;
}

export const getNavItemsByRole = (role: Role): NavItem[] => {
  const patientItems: NavItem[] = [
    { label: 'Dashboard', path: '/app/patient/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/app/patient/reports', icon: FileText },
    { label: 'Doctors', path: '/app/patient/doctors', icon: Search },
    { label: 'Assistant', path: '/app/patient/assistant', icon: Bot },
    { label: 'Settings', path: '/app/patient/settings', icon: Settings },
  ];

  const doctorItems: NavItem[] = [
    { label: 'Dashboard', path: '/app/doctor/dashboard', icon: LayoutDashboard },
    { label: 'My Patients', path: '/app/doctor/patients', icon: Users },
    { label: 'Pending Reports', path: '/app/doctor/pending-reports', icon: ClipboardList },
    { label: 'Consultations', path: '/app/doctor/consultations', icon: Calendar },
    { label: 'AI Assistant', path: '/app/doctor/assistant', icon: Bot },
    { label: 'Notes', path: '/app/doctor/notes', icon: NotebookText },
    { label: 'Schedule', path: '/app/doctor/schedule', icon: Bell },
    { label: 'Practice Analytics', path: '/app/doctor/analytics', icon: ChartNoAxesCombined },
    { label: 'Messages', path: '/app/doctor/messages', icon: MessageSquare },
    { label: 'Settings', path: '/app/doctor/settings', icon: Settings },
  ];

  const adminItems: NavItem[] = [
    { label: 'Overview', path: '/app/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/app/admin/users', icon: Users },
    { label: 'Doctors', path: '/app/admin/doctors', icon: Stethoscope },
    { label: 'Reports', path: '/app/admin/reports', icon: FileText },
    { label: 'Analytics', path: '/app/admin/analytics', icon: ChartNoAxesCombined },
    { label: 'System Health', path: '/app/admin/system-health', icon: ServerCog },
    { label: 'Settings', path: '/app/admin/settings', icon: Shield },
  ];

  if (role === 'DOCTOR') return doctorItems;
  if (role === 'ADMIN') return adminItems;
  return patientItems;
};

export const roleDisplayLabel: Record<Role, string> = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  ADMIN: 'Admin',
};

export const roleAccentClass: Record<Role, string> = {
  PATIENT: 'bg-[#ddf4ed] text-[#0b6c4f]',
  DOCTOR: 'bg-[#e9ecff] text-[#4843a8]',
  ADMIN: 'bg-[#e8f2fb] text-[#1b5f9f]',
};

export const userAvatarBgByRole: Record<Role, string> = {
  PATIENT: 'bg-[#1d9e75]',
  DOCTOR: 'bg-[#7f77dd]',
  ADMIN: 'bg-[#378add]',
};

export const defaultDashboardTitleByRole: Record<Role, string> = {
  PATIENT: 'Dashboard',
  DOCTOR: 'Doctor Console',
  ADMIN: 'Admin Panel',
};

export const adminQuickMetrics = [
  { label: 'Total Users', value: '12,483', delta: '+8.2%' },
  { label: 'Verified Doctors', value: '312', delta: '+2.4%' },
  { label: 'Reports Analyzed', value: '89,241', delta: '+11.1%' },
  { label: 'Active Today', value: '1,204', delta: '+6.0%' },
  { label: 'Revenue MTD', value: '?2.4L', delta: '+13.5%' },
  { label: 'System Uptime', value: '99.97%', delta: '+0.02%' },
];

export const patientNotifications = [
  { id: '1', tone: 'danger', icon: '??', text: 'Your LDL is above normal range', time: '2 hrs ago' },
  { id: '2', tone: 'warning', icon: '??', text: 'Report analysis complete', time: 'Yesterday' },
  { id: '3', tone: 'success', icon: '??', text: 'Dr. Sharma confirmed appointment', time: '2 days ago' },
];

export const bloodSugarTrend = [
  { month: 'Jan', value: 98 },
  { month: 'Feb', value: 102 },
  { month: 'Mar', value: 115 },
  { month: 'Apr', value: 108 },
  { month: 'May', value: 121 },
  { month: 'Jun', value: 118 },
];

export const lipidPanel = [
  { name: 'LDL', value: 180, status: 'high' },
  { name: 'HDL', value: 45, status: 'low' },
  { name: 'Triglycerides', value: 160, status: 'low' },
  { name: 'Total', value: 240, status: 'high' },
];

export const recentPatientReports = [
  {
    id: 'r1',
    name: 'CBC Report - Jan 2025',
    date: '2 days ago',
    type: 'Blood Test',
    status: 'ALERT',
    statusText: '2 Alerts',
  },
  {
    id: 'r2',
    name: 'Lipid Panel - Dec 2024',
    date: '3 weeks ago',
    type: 'Cholesterol',
    status: 'NORMAL',
    statusText: 'Normal',
  },
  {
    id: 'r3',
    name: 'Thyroid Panel - Nov 2024',
    date: '6 weeks ago',
    type: 'Hormones',
    status: 'NORMAL',
    statusText: 'Normal',
  },
];

