import { Bell, LogOut, Menu, Search as SearchIcon, Sparkles, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { NotificationsPanel } from '@/components/common/NotificationsPanel';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { getNavItemsByRole, roleDisplayLabel, userAvatarBgByRole } from '@/data/navigation';
import { cn } from '@/utils/cn';

interface DashboardLayoutProps {
  title?: string;
  rightPanel?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ title, rightPanel, children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navItems = useMemo(() => (user ? getNavItemsByRole(user.role) : []), [user]);

  if (!user) return null;

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const isPatient = user.role === 'PATIENT';
  return (
    <div className="relative min-h-screen portal-app-bg text-[var(--portal-text)] transition-colors duration-300">
      <div className="flex min-h-screen">
        
        {/* Sidebar Dock */}
        <aside className="hidden shrink-0 w-[275px] sidebar-premium-bg lg:block relative border-r border-[var(--portal-border)] rounded-r-[24px]">
          <div className="sticky top-0 flex h-screen flex-col justify-between p-5 rounded-r-[24px] overflow-hidden">
            
            {/* Top Logo & Menu */}
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-1.5 px-3">
                <Link to="/" className="inline-flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] shadow-md shadow-sky-500/10 hover:scale-[1.02] transition-transform">
                    <ActivityPulseIcon className="h-4.5 w-4.5 text-white" />
                  </span>
                  <span className="font-display text-base font-bold tracking-tight text-[var(--portal-text)]">MediScan AI</span>
                </Link>
                <span className="text-[11px] font-semibold text-[var(--portal-muted)] mt-1 ml-0.5 tracking-wider uppercase">
                  Intelligent Health Companion
                </span>
              </div>

              <nav className="flex flex-col gap-2.5 w-full mt-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'nav-item-premium group',
                        isActive && 'nav-item-active-premium'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="nav-item-active-indicator" />
                        )}
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-200 group-hover:scale-105",
                          isActive ? "text-[#0ea5e9] dark:text-[#38bdf8]" : "text-[var(--portal-muted)] group-hover:text-[var(--portal-text)]"
                        )} />
                        <span className={cn(
                          "transition-all duration-200",
                          isActive ? "text-[#0ea5e9] dark:text-[#38bdf8]" : "text-[var(--portal-muted)] group-hover:text-[var(--portal-text)]"
                        )}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Profile & Logout */}
            <div className="flex flex-col gap-4 w-full px-1">
              {/* Profile Card Container */}
              <div className="profile-card-premium flex items-center justify-between gap-3 hover:scale-[1.01] transition-transform duration-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-10 w-10 shrink-0 rounded-full object-cover border border-[var(--portal-border)]" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
                        {user.avatarInitials}
                      </div>
                    )}
                    {/* Glowing online indicator */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[var(--portal-surface)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[var(--portal-text)] leading-tight">{user.name}</p>
                    <p className="text-[11px] text-[var(--portal-muted)] mt-1 leading-none font-semibold uppercase tracking-wider">
                      {roleDisplayLabel[user.role]} • <span className="text-emerald-500 font-bold">Health synced</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--portal-border)] bg-[var(--portal-surface)] text-xs font-medium text-[var(--portal-muted)] hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </div>

          </div>
        </aside>

        {/* Content Rail */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          
          {/* Integrated Thin Header */}
          <header className="sticky top-0 z-30 h-14 topbar-glass px-4 sm:px-6">
            <div className="flex h-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-[var(--portal-text)] lg:hidden h-8 w-8 rounded-lg"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>

                <div className="min-w-0">
                  <h1 className="truncate font-display text-sm font-bold tracking-tight text-[var(--portal-text)]">{title ?? 'Portal'}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-[var(--portal-border)] bg-[var(--portal-surface)] hover:bg-[var(--portal-elevated)] transition-colors text-[var(--portal-text)]" 
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        {/* Invisible backdrop to dismiss dropdown on click outside */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowNotifications(false)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 mt-2.5 w-80 sm:w-[380px] z-50 shadow-2xl"
                        >
                          <NotificationsPanel />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

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
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'nav-item-premium group',
                              isActive && 'nav-item-active-premium'
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <span className="nav-item-active-indicator" />
                              )}
                              <item.icon className="h-5 w-5 shrink-0" />
                              <span>{item.label}</span>
                            </>
                          )}
                        </NavLink>
                      ))}
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

          <main className="flex min-h-0 flex-1 gap-5 p-3 pt-4 sm:p-4 sm:pt-5 lg:p-6 lg:pt-5">
            <div className={cn('min-w-0 flex-1', rightPanel ? '2xl:max-w-[calc(100%-336px)]' : '')}>{children}</div>
            {rightPanel && <aside className="hidden w-[320px] shrink-0 2xl:block">{rightPanel}</aside>}
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
