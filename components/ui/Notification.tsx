'use client';

import { useNotification, NotificationType } from '@/hooks/useNotification';
import { useEffect } from 'react';

interface NotificationItemProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

function NotificationItem({ message, type, onClose }: NotificationItemProps) {
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-2xl shadow-lg animate-fade-in-up text-white font-semibold max-w-md ${getNotificationStyles()}`}
      style={{
        animation: 'fadeInUp 0.3s ease-out',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="flex-1 pr-4">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {children}
      <div className="fixed top-0 right-0 z-50 pointer-events-none">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
}

export default NotificationProvider;