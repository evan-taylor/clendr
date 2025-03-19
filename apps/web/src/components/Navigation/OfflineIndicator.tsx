'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { isOnline } from '@/utils/serviceWorker';
import { cn } from '@/utils/cn';

interface OfflineIndicatorProps {
  className?: string;
  collapsed?: boolean;
}

export default function OfflineIndicator({ className = '', collapsed = false }: OfflineIndicatorProps) {
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Update initial state
    setIsOffline(!navigator.onLine);

    // Add event listeners for online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsRegistered(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isRegistered) return null;

  return (
    <div 
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors',
        isOffline 
          ? 'text-amber-600 dark:text-amber-500' 
          : 'text-emerald-600 dark:text-emerald-500',
        collapsed ? 'justify-center' : '',
        className
      )}
      title={isOffline ? 'Offline Mode - Changes will sync when online' : 'Online - All changes sync automatically'}
    >
      {isOffline ? (
        <>
          <WifiOff size={14} />
          {!collapsed && <span>Offline Mode</span>}
        </>
      ) : (
        <>
          <Wifi size={14} />
          {!collapsed && <span>Online</span>}
        </>
      )}
    </div>
  );
} 