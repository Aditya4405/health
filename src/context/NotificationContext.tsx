import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => void;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'danger',
    message: 'Your LDL is above normal range',
    timestamp: '2 hrs ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    message: 'Report analysis complete',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'n3',
    type: 'success',
    message: 'Dr. Sharma confirmed appointment',
    timestamp: '2 days ago',
    read: true,
  },
];

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
      markAllRead: () => setNotifications((current) => current.map((n) => ({ ...n, read: true }))),
      addNotification: (notification) =>
        setNotifications((current) => [
          {
            ...notification,
            id: crypto.randomUUID(),
            read: false,
            timestamp: 'Just now',
          },
          ...current,
        ]),
    }),
    [notifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

