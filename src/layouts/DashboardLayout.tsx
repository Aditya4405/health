import { 
  Bell, 
  LogOut, 
  Menu, 
  Search as SearchIcon, 
  Sparkles, 
  X, 
  Bot, 
  ClipboardList, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Settings, 
  User, 
  Activity, 
  Command,
  FileText,
  Plus
} from 'lucide-react';
import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { NotificationsPanel } from '@/components/common/NotificationsPanel';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { getNavItemsByRole, roleDisplayLabel, userAvatarBgByRole, NavItem } from '@/data/navigation';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  title?: string;
  rightPanel?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ title, rightPanel, children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHoverExpanded, setSidebarHoverExpanded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Section toggle states for expanded sidebar
  const [clinicalCoreExpanded, setClinicalCoreExpanded] = useState(true);
  const [intelligenceToolsExpanded, setIntelligenceToolsExpanded] = useState(true);
  const [supportAdminExpanded, setSupportAdminExpanded] = useState(true);

  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = useMemo(() => (user ? getNavItemsByRole(user.role) : []), [user]);

  // Global search and keyboard shortcuts listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl + K / Cmd + K to toggle command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }

      // Shortcut N: Notes
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        navigate('/app/doctor/notes');
        toast.info('Navigated to Notes Workspace');
      }

      // Shortcut R: Review Report
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        navigate('/app/doctor/pending-reports');
        toast.info('Navigated to Pending Reports');
      }

      // Shortcut P: Patients
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        navigate('/app/doctor/patients');
        toast.info('Navigated to Patients Roster');
      }

      // Shortcut A: AI Assistant
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        navigate('/app/doctor/assistant');
        toast.info('Navigated to AI Assistant');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!user) return null;

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or WEBP image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        updateUser?.({ avatarUrl: result });
        toast.success('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isCollapsed = !isMobile && sidebarCollapsed && !sidebarHoverExpanded && user.role === 'DOCTOR';
    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={isCollapsed ? item.label : undefined}
        onClick={() => {
          if (isMobile) setMobileMenuOpen(false);
        }}
        className={({ isActive }) =>
          cn(
            'nav-item-premium group flex items-center gap-3 transition-all duration-200 h-11 px-3.5 rounded-xl border border-transparent',
            isActive && 'nav-item-active-premium',
            isCollapsed && 'justify-center px-0 h-11 w-11 mx-auto rounded-xl'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span className="nav-item-active-indicator" />
            )}
            <item.icon className={cn(
              "h-[18px] w-[18px] shrink-0 transition-all duration-200 group-hover:scale-105",
              isActive ? "text-[#0ea5e9] dark:text-[#38bdf8]" : "text-[var(--portal-muted)] group-hover:text-[var(--portal-text)]"
            )} />
            {!isCollapsed && (
              <span className={cn(
                "transition-all duration-200 text-xs font-semibold tracking-wide",
                isActive ? "text-[#0ea5e9] dark:text-[#38bdf8]" : "text-[var(--portal-muted)] group-hover:text-[var(--portal-text)]"
              )}>
                {item.label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  // Static searchable list for Command Palette
  const commandPaletteItems = [
    { name: 'Aarav Kapoor', type: 'patient', path: '/app/doctor/patient/pt-001', category: 'Patients', detail: 'Age 29 • Urgent' },
    { name: 'Isha Verma', type: 'patient', path: '/app/doctor/patient/pt-002', category: 'Patients', detail: 'Age 41 • Attention' },
    { name: 'Rohan Das', type: 'patient', path: '/app/doctor/patient/pt-003', category: 'Patients', detail: 'Age 36 • Stable' },
    { name: 'Karan Malhotra', type: 'patient', path: '/app/doctor/patient/pt-004', category: 'Patients', detail: 'Age 52 • Urgent' },
    { name: 'Complete Blood Count (CBC) - Aarav Kapoor', type: 'report', path: '/app/doctor/analysis/pt-001', category: 'Reports', detail: '2 anomalies' },
    { name: 'Metabolic Glucose Panel - Isha Verma', type: 'report', path: '/app/doctor/analysis/pt-002', category: 'Reports', detail: '1 anomaly' },
    { name: 'AI Clinical Companion Chat', type: 'tool', path: '/app/doctor/assistant', category: 'Tools', detail: 'Interactive assistant' },
    { name: 'Availability Calendar scheduler', type: 'tool', path: '/app/doctor/schedule', category: 'Tools', detail: 'Manage slots' },
    { name: 'Practice Analytics Console', type: 'tool', path: '/app/doctor/analytics', category: 'Tools', detail: 'Efficacy charts' },
    { name: 'Console Settings', type: 'tool', path: '/app/doctor/settings', category: 'Tools', detail: 'Configure license & alerts' }
  ];

  const filteredCommandItems = searchQuery.trim() === '' 
    ? commandPaletteItems 
    : commandPaletteItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="relative min-h-screen portal-app-bg text-[var(--portal-text)] transition-colors duration-300">
      <div className="flex min-h-screen">
        
        {/* Collapsible Sidebar Dock */}
        <aside 
          onMouseEnter={() => {
            if (sidebarCollapsed) setSidebarHoverExpanded(true);
          }}
          onMouseLeave={() => {
            setSidebarHoverExpanded(false);
          }}
          className={cn(
            "hidden shrink-0 sidebar-premium-bg lg:block relative border-r border-[var(--portal-border)] rounded-r-2xl transition-all duration-300 z-40 shadow-xl",
            user.role === 'DOCTOR' 
              ? ((sidebarCollapsed && !sidebarHoverExpanded) ? "w-[88px]" : "w-[320px]") 
              : "w-[275px]"
          )}
        >
          <div className="sticky top-0 flex h-screen flex-col justify-between p-4 rounded-r-2xl overflow-hidden">
            
            {/* Top Logo & Menu */}
            <div className="flex flex-col w-full animate-in fade-in slide-in-from-left duration-300 shrink-0">
              <div className={cn("flex flex-col gap-1 px-3", (sidebarCollapsed && !sidebarHoverExpanded) && user.role === 'DOCTOR' && "items-center px-0")}>
                <Link to="/" className="inline-flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] shadow-md shadow-sky-500/10 hover:scale-[1.02] transition-transform">
                    <ActivityPulseIcon className="h-4.5 w-4.5 text-white" />
                  </span>
                  {(!(sidebarCollapsed && !sidebarHoverExpanded) || user.role !== 'DOCTOR') && (
                    <span className="font-display text-base font-bold tracking-tight text-[var(--portal-text)]">MediScan AI</span>
                  )}
                </Link>
                {(!(sidebarCollapsed && !sidebarHoverExpanded) || user.role !== 'DOCTOR') && (
                  <span className="text-[10px] font-bold text-[var(--portal-muted)] mt-1 ml-0.5 tracking-wider uppercase">
                    {user.role === 'DOCTOR' ? 'Clinical Operating System' : 'Intelligent Companion'}
                  </span>
                )}
              </div>

              {/* Quick Hub Links (Expanded mode only) */}
              {user.role === 'DOCTOR' && !(sidebarCollapsed && !sidebarHoverExpanded) && (
                <div className="px-3 mt-5">
                  <div className="rounded-xl border border-[var(--portal-border)] bg-[var(--portal-elevated)]/40 p-3.5 space-y-2">
                    <p className="text-[9px] font-bold text-[var(--portal-muted)] uppercase tracking-wider">Clinical Workspace Hub</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to="/app/doctor/pending-reports" 
                        className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[var(--portal-surface)] border border-[var(--portal-border)] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 transition-all text-center group"
                      >
                        <ClipboardList className="h-4.5 w-4.5 text-[#0ea5e9] mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-[var(--portal-text)]">Triage</span>
                      </Link>
                      <Link 
                        to="/app/doctor/consultations" 
                        className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[var(--portal-surface)] border border-[var(--portal-border)] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 transition-all text-center group"
                      >
                        <Calendar className="h-4.5 w-4.5 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-[var(--portal-text)]">Consults</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation container - Scrollable */}
            <div className="flex-1 overflow-y-auto hide-scrollbar my-3 py-1 w-full">
              <nav className="flex flex-col gap-1 w-full">
                {user.role === 'DOCTOR' ? (
                  (sidebarCollapsed && !sidebarHoverExpanded) ? (
                    <div className="space-y-2">
                      {navItems.map((item) => renderNavItem(item))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <button 
                          type="button" 
                          onClick={() => setClinicalCoreExpanded(!clinicalCoreExpanded)}
                          className="w-full px-3 flex items-center justify-between text-[10px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5 hover:text-[var(--portal-text)] transition-colors"
                        >
                          <span>Clinical Core</span>
                          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !clinicalCoreExpanded && "-rotate-90")} />
                        </button>
                        {clinicalCoreExpanded && (
                          <div className="space-y-0.5">
                            {navItems.slice(0, 4).map((item) => renderNavItem(item))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <button 
                          type="button" 
                          onClick={() => setIntelligenceToolsExpanded(!intelligenceToolsExpanded)}
                          className="w-full px-3 flex items-center justify-between text-[10px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5 hover:text-[var(--portal-text)] transition-colors"
                        >
                          <span>Intelligence Tools</span>
                          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !intelligenceToolsExpanded && "-rotate-90")} />
                        </button>
                        {intelligenceToolsExpanded && (
                          <div className="space-y-0.5">
                            {navItems.slice(4, 8).map((item) => renderNavItem(item))}
                          </div>
                        )}
                      </div>

                      <div>
                        <button 
                          type="button" 
                          onClick={() => setSupportAdminExpanded(!supportAdminExpanded)}
                          className="w-full px-3 flex items-center justify-between text-[10px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5 hover:text-[var(--portal-text)] transition-colors"
                        >
                          <span>Support & Settings</span>
                          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !supportAdminExpanded && "-rotate-90")} />
                        </button>
                        {supportAdminExpanded && (
                          <div className="space-y-0.5">
                            {navItems.slice(8).map((item) => renderNavItem(item))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  navItems.map((item) => renderNavItem(item))
                )}
              </nav>
            </div>
            {/* Bottom Profile Footer & Collapse Toggle */}
            <div className="flex flex-col gap-3 w-full px-1 shrink-0 pt-3 border-t border-[var(--portal-border)]">
              {user.role === 'DOCTOR' && (
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] text-[10px] font-bold uppercase tracking-wider text-[var(--portal-muted)] hover:text-[var(--portal-text)] transition-all"
                  title={(sidebarCollapsed && !sidebarHoverExpanded) ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {(sidebarCollapsed && !sidebarHoverExpanded) ? <ChevronRight className="h-4 w-4" /> : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Collapse Sidebar</span>
                    </>
                  )}
                </button>
              )}

              {/* Profile Card Summary */}
              {(!(sidebarCollapsed && !sidebarHoverExpanded) || user.role !== 'DOCTOR') ? (
                <div className="profile-card-premium flex items-center justify-between gap-3 p-3 rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-surface)] relative overflow-hidden group">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative cursor-pointer">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] shadow-sm">
                          {user.avatarInitials}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[var(--portal-surface)] animate-pulse" />
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={handleAvatarChange} 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Upload Avatar image"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[var(--portal-text)] leading-tight">{user.name}</p>
                      <p className="text-[9px] text-[var(--portal-muted)] font-semibold mt-1 leading-none uppercase tracking-wider flex flex-wrap items-center gap-1.5">
                        <span>{user.role === 'DOCTOR' ? `${user.specialty ?? 'Cardiologist'}` : `${roleDisplayLabel[user.role]}`}</span>
                        {user.role === 'DOCTOR' && (
                          <span className="inline-flex rounded-full bg-success/15 border border-success/20 px-1.5 py-0.5 text-[8px] font-bold text-success uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center relative group">
                  <div className="relative cursor-pointer">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] shadow-sm"
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        user.avatarInitials
                      )}
                    </button>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[var(--portal-surface)]" />
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleAvatarChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Upload Avatar image"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </aside>

        {/* Content Rail */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          
          {/* Top Navigation - height 72px */}
          <header className="sticky top-0 z-30 h-[72px] topbar-glass px-6">
            <div className="flex h-full items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-[var(--portal-text)] lg:hidden h-9 w-9 rounded-lg"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {user.role === 'DOCTOR' ? (
                  /* Command Palette Query Box */
                  <div 
                    onClick={() => setCommandPaletteOpen(true)}
                    className="hidden md:flex items-center justify-between cursor-pointer bg-[var(--portal-elevated)] border border-[var(--portal-border)] rounded-xl px-3.5 py-2 w-80 lg:w-96 text-[var(--portal-muted)] hover:border-[#0ea5e9]/40 hover:bg-[var(--portal-elevated)]/80 transition-all select-none"
                  >
                    <div className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4 shrink-0 text-[var(--portal-muted)]" />
                      <span className="text-[12px] font-medium text-[var(--portal-muted)]">Search patients, reports, notes...</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] font-mono font-bold bg-[var(--portal-surface)] border border-[var(--portal-border)] px-1.5 py-0.5 rounded text-[var(--portal-muted)]">
                      <Command className="h-2.5 w-2.5" />
                      <span>K</span>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <h1 className="truncate font-display text-base font-bold tracking-tight text-[var(--portal-text)]">{title ?? 'Companion'}</h1>
                  </div>
                )}
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-3">
                {user.role === 'DOCTOR' && (
                  <>
                    {/* Critical Alerts Counter Indicator */}
                    <Link 
                      to="/app/doctor/pending-reports"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger text-[10px] font-bold uppercase tracking-wider animate-pulse"
                      title="Urgent Alerts"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                      2 Critical Alerts
                    </Link>

                    {/* AI Clinical Companion shortcut */}
                    <Link 
                      to="/app/doctor/assistant"
                      className="h-9 w-9 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] flex items-center justify-center text-[var(--portal-muted)] hover:text-[#0ea5e9] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 transition-colors animate-in fade-in zoom-in duration-200"
                      title="Launch AI Clinical Assistant"
                    >
                      <Bot className="h-4.5 w-4.5" />
                    </Link>

                    {/* Quick Actions Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQuickActions(!showQuickActions)}
                        className="h-9 px-3 gap-1.5 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] flex items-center justify-center text-[var(--portal-muted)] hover:text-[#0ea5e9] hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/5 transition-all text-xs font-semibold select-none cursor-pointer"
                        title="Quick Actions Center"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#0ea5e9]" />
                        <span className="hidden sm:inline">Actions</span>
                      </button>
                      {showQuickActions && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
                          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <button
                              onClick={() => {
                                setShowQuickActions(false);
                                navigate('/app/doctor/consultations');
                                toast.success('Ready to schedule new Consultation session.');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors text-left border-none outline-none"
                            >
                              <Plus className="h-3.5 w-3.5 text-sky-500" />
                              <span>New Consultation</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowQuickActions(false);
                                navigate('/app/doctor/notes');
                                toast.success('Opened Clinical Notes Editor.');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors text-left border-none outline-none"
                            >
                              <Plus className="h-3.5 w-3.5 text-purple-500" />
                              <span>Add EMR Note</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowQuickActions(false);
                                navigate('/app/doctor/messages');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors text-left border-none outline-none"
                            >
                              <Plus className="h-3.5 w-3.5 text-pink-500" />
                              <span>Message Patient</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowQuickActions(false);
                                navigate('/app/doctor/pending-reports');
                                toast.success('Loading Reports Queue...');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors text-left border-none outline-none"
                            >
                              <Plus className="h-3.5 w-3.5 text-amber-500" />
                              <span>Review Report</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowQuickActions(false);
                                navigate('/app/doctor/schedule');
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors text-left border-none outline-none"
                            >
                              <Plus className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Schedule Follow-up</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                <ThemeToggle />
                
                {/* Notifications drawer trigger */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(true)}
                    className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:bg-[var(--portal-elevated)] transition-colors text-[var(--portal-text)]" 
                    aria-label="Notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Profile menu dropdown (Header right) */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex h-9 w-9 rounded-xl border border-[var(--portal-border)] overflow-hidden bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] items-center justify-center text-white text-xs font-bold transition-transform hover:scale-105"
                  >
                    {user.avatarInitials}
                  </button>
                  
                  {showProfileDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-2.5 py-2 border-b border-[var(--portal-border)] mb-1">
                          <p className="text-xs font-bold text-[var(--portal-text)]">{user.name}</p>
                          <p className="text-[10px] text-[var(--portal-muted)] font-semibold uppercase mt-0.5">{user.role}</p>
                        </div>
                        {user.role === 'DOCTOR' && (
                          <Link 
                            to="/app/doctor/settings" 
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center gap-2 px-2.5 py-2 text-xs text-[var(--portal-muted)] hover:text-[var(--portal-text)] hover:bg-[var(--portal-elevated)] rounded-lg transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Console Settings</span>
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-red-500 hover:bg-red-500/5 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout Session</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Sliding Notifications Drawer */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/60"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ x: 400 }}
                  animate={{ x: 0 }}
                  exit={{ x: 400 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="fixed right-0 top-0 bottom-0 w-80 sm:w-[400px] z-50 bg-[var(--portal-surface)] border-l border-[var(--portal-border)] p-6 shadow-2xl overflow-y-auto flex flex-col"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--portal-border)] mb-4 shrink-0">
                    <div>
                      <h3 className="text-card-title font-bold text-[var(--portal-text)]">Alerts Center</h3>
                      <p className="text-[10px] text-[var(--portal-muted)] uppercase tracking-wider font-semibold mt-0.5">Critical risk alarms feed</p>
                    </div>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[var(--portal-muted)] hover:text-[var(--portal-text)] h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[var(--portal-elevated)]"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1">
                    <NotificationsPanel />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Command Palette Overlay Modal (Ctrl+K) */}
          <AnimatePresence>
            {commandPaletteOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80" 
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    setSearchQuery('');
                  }} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.97, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="w-full max-w-xl bg-[#0F1424] border border-[var(--portal-border)] rounded-2xl shadow-2xl z-50 overflow-hidden text-[var(--portal-text)]"
                >
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--portal-border)] bg-[var(--portal-surface)]">
                    <SearchIcon className="h-4.5 w-4.5 text-[var(--portal-muted)]" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patient, report, notes, schedule slots..."
                      className="bg-transparent border-none outline-none text-sm w-full text-[var(--portal-text)] placeholder-[var(--portal-muted)]"
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono border border-[var(--portal-border)] px-1.5 py-0.5 rounded text-[var(--portal-muted)] shadow-sm">ESC</span>
                    </div>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-2.5 space-y-3 bg-[#0B1020]/75">
                    {filteredCommandItems.length > 0 ? (
                      Object.entries(
                        filteredCommandItems.reduce((acc, curr) => {
                          if (!acc[curr.category]) acc[curr.category] = [];
                          acc[curr.category].push(curr);
                          return acc;
                        }, {} as Record<string, typeof commandPaletteItems>)
                      ).map(([category, items]) => (
                        <div key={category} className="space-y-1">
                          <p className="px-2.5 py-1 text-[9px] font-bold text-[var(--portal-muted)]/80 uppercase tracking-wider">{category}</p>
                          {items.map((item, idx) => (
                            <div 
                              key={idx}
                              onClick={() => {
                                navigate(item.path);
                                setCommandPaletteOpen(false);
                                setSearchQuery('');
                              }}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--portal-elevated)] cursor-pointer text-xs transition-all border border-transparent hover:border-[var(--portal-border)]"
                            >
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-[10px] text-[var(--portal-muted)] font-mono">{item.detail}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-xs text-[var(--portal-muted)]">No search results found for "{searchQuery}"</p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Mobile navigation sidebar overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-[#050816]/45 lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.aside
                  initial={{ x: -275, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -275, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="fixed inset-y-0 left-0 z-50 w-[275px] border-r border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 shadow-2xl lg:hidden flex flex-col justify-between"
                >
                  <div className="flex flex-col w-full">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7]">
                          <ActivityPulseIcon className="h-4.5 w-4.5 text-white" />
                        </span>
                        <span className="font-display text-base font-bold text-[var(--portal-text)]">MediScan AI</span>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <nav className="flex flex-col gap-2 w-full">
                      {user.role === 'DOCTOR' ? (
                        <div className="space-y-4">
                          <div>
                            <p className="px-3 text-[9px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5">Clinical Core</p>
                            <div className="space-y-0.5">
                              {navItems.slice(0, 4).map((item) => renderNavItem(item, true))}
                            </div>
                          </div>
                          <div>
                            <p className="px-3 text-[9px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5">Intelligence Tools</p>
                            <div className="space-y-0.5">
                              {navItems.slice(4, 8).map((item) => renderNavItem(item, true))}
                            </div>
                          </div>
                          <div>
                            <p className="px-3 text-[9px] font-bold text-[var(--portal-muted)]/60 uppercase tracking-wider mb-1.5">Support & Settings</p>
                            <div className="space-y-0.5">
                              {navItems.slice(8).map((item) => renderNavItem(item, true))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        navItems.map((item) => renderNavItem(item, true))
                      )}
                    </nav>
                  </div>

                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] text-xs font-medium text-[var(--portal-muted)] hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout Session
                  </button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Strict Spacing System Layout */}
          <main className="flex min-h-0 flex-1 flex-col w-full">
            <div className="portal-container w-full py-6">
              <div className="flex gap-6 items-start w-full">
                <div className={cn('min-w-0 flex-1', rightPanel ? '2xl:max-w-[calc(100%-344px)]' : '')}>{children}</div>
                {rightPanel && <aside className="hidden w-[320px] shrink-0 2xl:block">{rightPanel}</aside>}
              </div>
            </div>
          </main>

          <nav className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-[var(--portal-border)] bg-[color-mix(in_srgb,var(--portal-surface)_90%,transparent)] px-2 py-1.5 shadow-[var(--portal-shadow)] backdrop-blur-xl lg:hidden">
            <div className="grid grid-cols-5 gap-1">
              {navItems.slice(0, 5).map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'focus-ring flex min-h-11 flex-col items-center justify-center rounded-xl text-[11px] font-medium',
                      active
                        ? 'bg-[color-mix(in_srgb,var(--landing-primary)_14%,var(--portal-surface))] text-[var(--landing-primary)]'
                        : 'text-[var(--portal-muted)]',
                    )}
                  >
                    <item.icon className="mb-1 h-4 w-4" />
                    {item.label.split(' ')[0]}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

const ScoreRing = ({ score }: { score: number }) => {
  const value = Math.max(0, Math.min(100, score));
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-semibold text-[var(--portal-text)]"
      style={{
        background: `conic-gradient(var(--landing-accent) ${value * 3.6}deg, color-mix(in_srgb,var(--portal-muted)_24%,transparent) 0deg)`,
      }}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--portal-surface)]">{value}</div>
    </div>
  );
};

function ActivityPulseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l2.2-5 3.6 10 2.4-5H22" />
    </svg>
  );
}
