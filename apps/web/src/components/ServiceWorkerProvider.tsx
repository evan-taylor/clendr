"use client";

import { FC, ReactNode, useEffect, useState } from 'react';
import { registerServiceWorker, listenForServiceWorkerMessages, addConnectivityListeners } from '@/utils/serviceWorker';
import { useAppDispatch } from '@/store';
import { addNotification } from '@/store/slices/uiSlice';

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

export const ServiceWorkerProvider: FC<ServiceWorkerProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Register service worker on mount
    const registerSW = async () => {
      const registration = await registerServiceWorker();
      setIsRegistered(!!registration);
    };
    
    registerSW();
    
    // Listen for messages from service worker
    const unsubscribe = listenForServiceWorkerMessages((event) => {
      const { data } = event;
      
      if (data.type === 'SYNC_COMPLETE') {
        dispatch(addNotification({
          type: 'success',
          message: `${data.store === 'events' ? 'Calendar events' : 'Tasks'} synced successfully.`,
          autoHide: true,
        }));
      } else if (data.type === 'CALENDARS_UPDATED') {
        dispatch(addNotification({
          type: 'info',
          message: 'Calendars updated in the background.',
          autoHide: true,
        }));
      }
    });
    
    // Add connectivity listeners
    const connectivityUnsubscribe = addConnectivityListeners(
      // Online callback
      () => {
        dispatch(addNotification({
          type: 'success',
          message: 'You are back online! Syncing your data...',
          autoHide: true,
        }));
      },
      // Offline callback
      () => {
        dispatch(addNotification({
          type: 'warning',
          message: 'You are offline. Changes will be saved locally.',
          autoHide: true,
        }));
      }
    );
    
    return () => {
      unsubscribe();
      connectivityUnsubscribe();
    };
  }, [dispatch]);
  
  return <>{children}</>;
};

export default ServiceWorkerProvider; 