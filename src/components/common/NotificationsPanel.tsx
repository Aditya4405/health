import { Bell, CheckCircle2, Clock3, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/utils/cn';

const toneStyles = {
  success: 'text-[#6EE7B7] bg-[#123223] border-[#2f5f47]',
  warning: 'text-[#FCD34D] bg-[#312613] border-[#6d5523]',
  danger: 'text-[#FCA5A5] bg-[#341919] border-[#6f3232]',
  info: 'text-[#93C5FD] bg-[#122742] border-[#1b3d75]',
};

export const NotificationsPanel = () => {
  const { notifications, markAllRead } = useNotifications();

  return (
    <section className="space-y-3 rounded-3xl border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 shadow-[var(--portal-shadow)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--portal-muted)]">Smart Alerts</p>
          <h3 className="mt-1 font-display text-lg font-semibold">Care Notifications</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllRead}
          className="rounded-full border border-[var(--portal-border)] bg-[var(--portal-elevated)] px-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--portal-muted)]"
        >
          Mark Read
        </Button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={cn(
              'rounded-2xl border border-[var(--portal-border)] bg-[var(--portal-elevated)] p-3 transition-colors',
              !notification.read && 'border-[color-mix(in_srgb,var(--landing-primary)_24%,var(--portal-border))]',
            )}
          >
            <div className="flex items-start gap-2.5">
              <span className={cn('mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border', toneStyles[notification.type])}>
                {notification.type === 'danger' && <ShieldAlert className="h-3.5 w-3.5" />}
                {notification.type === 'warning' && <Clock3 className="h-3.5 w-3.5" />}
                {notification.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {notification.type === 'info' && <Sparkles className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--portal-text)]">{notification.message}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[var(--portal-muted)]">
                  <Bell className="h-3 w-3" />
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
