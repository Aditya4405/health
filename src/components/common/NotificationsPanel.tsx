import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/utils/cn';

const toneClasses = {
  success: 'bg-[#eaf3de] text-[#3b6d11]',
  warning: 'bg-[#faeeda] text-[#854f0b]',
  danger: 'bg-[#faece7] text-[#993c1d]',
  info: 'bg-[#e6f1fb] text-[#1a5f9f]',
};

export const NotificationsPanel = () => {
  const { notifications, markAllRead } = useNotifications();

  return (
    <Card className="h-fit">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Notifications</CardTitle>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          Mark all read
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'rounded-md border border-[#dae7f2] p-3 transition-colors hover:bg-[#f6fbff] dark:border-[#345476] dark:hover:bg-[#17395d]',
              !notification.read && 'bg-[#f0f7ff]',
            )}
          >
            <div className="flex items-start gap-2">
              <span className={cn('mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs', toneClasses[notification.type])}>
                <Bell className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#355772] dark:text-[#d1e4f5]">{notification.message}</p>
                <p className="mt-1 text-xs text-[#6c8297]">{notification.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

