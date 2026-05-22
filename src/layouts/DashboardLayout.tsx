import { Bell, LogOut, Menu, Search as SearchIcon, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { getNavItemsByRole, roleAccentClass, roleDisplayLabel, userAvatarBgByRole } from '@/data/navigation';
import { cn } from '@/utils/cn';

interface DashboardLayoutProps {
  title?: string;
  rightPanel?: ReactNode;
  children: ReactNode;
}

export const DashboardLayout = ({ title, rightPanel, children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const initials = user.avatarInitials;

  return (
    <div className="min-h-screen bg-page text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-navy p-5 text-white shadow-[var(--shadow-sidebar)] md:flex md:flex-col">
          <AppLogo className="mb-8" />
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-white/10 p-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold', userAvatarBgByRole[user.role])}>
              {initials}
            </div>
            <div>
              <p className="font-medium leading-tight">{user.name}</p>
              <Badge className={cn('mt-1', roleAccentClass[user.role])}>{roleDisplayLabel[user.role]}</Badge>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors',
                      isActive || active
                        ? 'border-l-[3px] border-primary bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onLogout}
            className="focus-ring mt-auto flex h-11 items-center gap-2 rounded-md px-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#d8e2ec] bg-[rgba(241,239,232,0.88)] px-4 backdrop-blur-md md:px-6">
            <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen((prev) => !prev)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-display text-xl font-semibold text-navy">{title ?? 'Dashboard'}</h1>
            <div className="ml-auto hidden max-w-sm flex-1 items-center md:flex">
              <SearchIcon className="-mr-9 h-4 w-4 text-[#688198]" />
              <Input className="pl-9" placeholder="Search reports, doctors, metrics..." />
            </div>
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e24b4a] px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </header>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="fixed inset-y-0 left-0 z-40 w-72 bg-navy p-5 text-white shadow-2xl md:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <AppLogo />
                  <Button size="icon" variant="ghost" className="text-white" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors',
                          isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                <button
                  type="button"
                  onClick={onLogout}
                  className="focus-ring mt-8 flex h-11 w-full items-center gap-2 rounded-md px-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex flex-1 gap-6 p-4 pb-24 md:p-6">
            <div className={cn('min-w-0 flex-1', rightPanel ? 'xl:max-w-[calc(100%-296px)]' : '')}>{children}</div>
            {rightPanel && <aside className="hidden w-[280px] shrink-0 xl:block">{rightPanel}</aside>}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#d9e7f3] bg-[rgba(255,255,255,0.96)] px-2 py-1 backdrop-blur md:hidden">
            <div className="grid grid-cols-5 gap-1">
              {navItems.slice(0, 5).map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'focus-ring flex min-h-11 flex-col items-center justify-center rounded-md text-[11px] font-medium',
                      active ? 'bg-[#dceafb] text-primary' : 'text-[#5e7489]',
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

