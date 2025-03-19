/**
 * Service Worker Registration Utility
 * 
 * This utility handles service worker registration, updates, and background sync.
 */

// Check if service workers are supported
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Check if background sync is supported
export const isBackgroundSyncSupported = () => {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
};

// Check if periodic sync is supported (for scheduled updates)
export const isPeriodicSyncSupported = () => {
  return 'serviceWorker' in navigator && 'PeriodicSyncManager' in window;
};

// Register the service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.log('Service workers are not supported in this browser');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service worker registered:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

// Request permission for notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Notifications are not supported in this browser');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.log('Notification permission has been denied');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Register for background sync
export const registerBackgroundSync = async (
  syncTag: string = 'sync-events'
): Promise<boolean> => {
  if (!isBackgroundSyncSupported()) {
    console.log('Background sync is not supported in this browser');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(syncTag);
    console.log(`Background sync registered for: ${syncTag}`);
    return true;
  } catch (error) {
    console.error('Error registering background sync:', error);
    return false;
  }
};

// Register for periodic sync (for scheduled updates) - Chrome only
export const registerPeriodicSync = async (
  syncTag: string = 'update-calendars',
  minInterval: number = 60 * 60 * 1000 // 1 hour in milliseconds
): Promise<boolean> => {
  if (!isPeriodicSyncSupported()) {
    console.log('Periodic sync is not supported in this browser');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const periodicSync = registration.periodicSync;
    
    if (!periodicSync) {
      console.log('PeriodicSync API is not available');
      return false;
    }
    
    // Check if we already have permission
    const permission = await periodicSync.getTags();
    const hasPermission = permission.includes(syncTag);
    
    if (!hasPermission) {
      await periodicSync.register(syncTag, {
        minInterval,
      });
    }
    
    console.log(`Periodic sync registered for: ${syncTag}`);
    return true;
  } catch (error) {
    console.error('Error registering periodic sync:', error);
    return false;
  }
};

// Subscribe for push notifications
export const subscribeToPushNotifications = async (
  serverPublicKey: string
): Promise<PushSubscription | null> => {
  if (!isServiceWorkerSupported() || !('PushManager' in window)) {
    console.log('Push notifications are not supported in this browser');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Request notification permission if not granted
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return null;
    }
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    // If no subscription exists, create one
    if (!subscription) {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(serverPublicKey),
      };
      
      subscription = await registration.pushManager.subscribe(options);
    }
    
    console.log('Push notification subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Listen for service worker messages
export const listenForServiceWorkerMessages = (
  callback: (event: MessageEvent) => void
): () => void => {
  if (!isServiceWorkerSupported()) {
    console.log('Service workers are not supported in this browser');
    return () => {};
  }
  
  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    callback(event);
  };
  
  navigator.serviceWorker.addEventListener('message', messageHandler);
  
  // Return unsubscribe function
  return () => {
    navigator.serviceWorker.removeEventListener('message', messageHandler);
  };
};

// Check if we're online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Add online/offline event listeners
export const addConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Helper to convert urlBase64 to Uint8Array for applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
} 