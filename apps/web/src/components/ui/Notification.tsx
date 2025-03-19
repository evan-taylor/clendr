"use client";

import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeNotification } from '@/store/slices/uiSlice';
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, AlertTriangleIcon } from 'lucide-react';

export const Notifications: FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.ui.notifications);

  // Handle auto-hide notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoHide && notification.hideAfter) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.hideAfter);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => dispatch(removeNotification(notification.id))}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const NotificationItem: FC<NotificationItemProps> = ({ id, type, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Styling based on notification type
  const bgColor = {
    success: 'bg-green-50 dark:bg-green-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
  }[type];

  const borderColor = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    warning: 'border-yellow-500',
  }[type];

  const textColor = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    info: 'text-blue-800 dark:text-blue-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
  }[type];

  const Icon = {
    success: CheckCircleIcon,
    error: AlertCircleIcon,
    info: InfoIcon,
    warning: AlertTriangleIcon,
  }[type];

  const handleClose = () => {
    setIsExiting(true);
    // Short delay to allow for exit animation
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div
      className={`
        ${bgColor} ${borderColor} ${textColor}
        flex items-start p-4 mb-2 rounded-lg border-l-4 shadow-md
        transition-all duration-200 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-2' : 'opacity-100'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-3 mr-8 flex-1">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        onClick={handleClose}
        aria-label="Close"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notifications; 