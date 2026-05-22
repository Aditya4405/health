import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ProtectedRoute, RoleHomeRedirect } from '@/components/common/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';

const LandingPage = lazy(() => import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('@/pages/SignupPage').then((module) => ({ default: module.SignupPage })));
const PatientDashboardPage = lazy(() => import('@/pages/PatientDashboardPage').then((module) => ({ default: module.PatientDashboardPage })));
const UploadReportPage = lazy(() => import('@/pages/UploadReportPage').then((module) => ({ default: module.UploadReportPage })));
const ReportAnalysisPage = lazy(() => import('@/pages/ReportAnalysisPage').then((module) => ({ default: module.ReportAnalysisPage })));
const DoctorFinderPage = lazy(() => import('@/pages/DoctorFinderPage').then((module) => ({ default: module.DoctorFinderPage })));
const ChatAssistantPage = lazy(() => import('@/pages/ChatAssistantPage').then((module) => ({ default: module.ChatAssistantPage })));
const DoctorDashboardPage = lazy(() => import('@/pages/DoctorDashboardPage').then((module) => ({ default: module.DoctorDashboardPage })));
const AdminPanelPage = lazy(() => import('@/pages/AdminPanelPage').then((module) => ({ default: module.AdminPanelPage })));
const FileHistoryPage = lazy(() => import('@/pages/FileHistoryPage').then((module) => ({ default: module.FileHistoryPage })));
const UserSettingsPage = lazy(() => import('@/pages/UserSettingsPage').then((module) => ({ default: module.UserSettingsPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route path="/app" element={<ProtectedRoute />}>
          <Route index element={<RoleHomeRedirect />} />

          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route path="patient/dashboard" element={<PatientDashboardPage />} />
            <Route path="patient/reports" element={<FileHistoryPage />} />
            <Route path="patient/upload" element={<UploadReportPage />} />
            <Route path="patient/analysis/:reportId" element={<ReportAnalysisPage />} />
            <Route path="patient/doctors" element={<DoctorFinderPage />} />
            <Route path="patient/chat" element={<ChatAssistantPage />} />
            <Route path="patient/settings" element={<UserSettingsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="doctor/reports" element={<DoctorDashboardPage />} />
            <Route path="doctor/consultations" element={<DoctorDashboardPage />} />
            <Route path="doctor/notes" element={<DoctorDashboardPage />} />
            <Route path="doctor/schedule" element={<DoctorDashboardPage />} />
            <Route path="doctor/settings" element={<DoctorDashboardPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin" element={<AdminPanelPage />} />
            <Route path="admin/users" element={<AdminPanelPage />} />
            <Route path="admin/doctors" element={<AdminPanelPage />} />
            <Route path="admin/reports" element={<AdminPanelPage />} />
            <Route path="admin/analytics" element={<AdminPanelPage />} />
            <Route path="admin/system-health" element={<AdminPanelPage />} />
            <Route path="admin/settings" element={<AdminPanelPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

