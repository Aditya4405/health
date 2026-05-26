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
const DoctorPatientsPage = lazy(() => import('@/pages/DoctorPatientsPage').then((module) => ({ default: module.DoctorPatientsPage })));
const DoctorReportsPage = lazy(() => import('@/pages/DoctorReportsPage').then((module) => ({ default: module.DoctorReportsPage })));
const DoctorConsultationsPage = lazy(() => import('@/pages/DoctorConsultationsPage').then((module) => ({ default: module.DoctorConsultationsPage })));
const DoctorAssistantPage = lazy(() => import('@/pages/DoctorAssistantPage').then((module) => ({ default: module.DoctorAssistantPage })));
const DoctorNotesPage = lazy(() => import('@/pages/DoctorNotesPage').then((module) => ({ default: module.DoctorNotesPage })));
const DoctorSchedulePage = lazy(() => import('@/pages/DoctorSchedulePage').then((module) => ({ default: module.DoctorSchedulePage })));
const DoctorAnalyticsPage = lazy(() => import('@/pages/DoctorAnalyticsPage').then((module) => ({ default: module.DoctorAnalyticsPage })));
const DoctorMessagesPage = lazy(() => import('@/pages/DoctorMessagesPage').then((module) => ({ default: module.DoctorMessagesPage })));
const DoctorSettingsPage = lazy(() => import('@/pages/DoctorSettingsPage').then((module) => ({ default: module.DoctorSettingsPage })));
const PatientDetailViewPage = lazy(() => import('@/pages/PatientDetailViewPage').then((module) => ({ default: module.PatientDetailViewPage })));
const DoctorAnalysisWorkspacePage = lazy(() => import('@/pages/DoctorAnalysisWorkspacePage').then((module) => ({ default: module.DoctorAnalysisWorkspacePage })));
const ConsultationRoomPage = lazy(() => import('@/pages/ConsultationRoomPage').then((module) => ({ default: module.ConsultationRoomPage })));
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
            <Route path="patient/assistant" element={<ChatAssistantPage />} />
            <Route path="patient/settings" element={<UserSettingsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="doctor/dashboard" element={<DoctorDashboardPage />} />
            <Route path="doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="doctor/pending-reports" element={<DoctorReportsPage />} />
            <Route path="doctor/consultations" element={<DoctorConsultationsPage />} />
            <Route path="doctor/assistant" element={<DoctorAssistantPage />} />
            <Route path="doctor/notes" element={<DoctorNotesPage />} />
            <Route path="doctor/schedule" element={<DoctorSchedulePage />} />
            <Route path="doctor/analytics" element={<DoctorAnalyticsPage />} />
            <Route path="doctor/messages" element={<DoctorMessagesPage />} />
            <Route path="doctor/settings" element={<DoctorSettingsPage />} />
            <Route path="doctor/patient/:patientId" element={<PatientDetailViewPage />} />
            <Route path="doctor/analysis/:reportId" element={<DoctorAnalysisWorkspacePage />} />
            <Route path="doctor/room/:consultationId" element={<ConsultationRoomPage />} />
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

