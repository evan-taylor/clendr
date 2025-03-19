interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  unregister(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  sync: SyncManager;
  periodicSync?: PeriodicSyncManager;
}

interface WindowEventMap {
  'sync': SyncEvent;
  'periodicsync': PeriodicSyncEvent;
}

interface SyncEvent extends Event {
  tag: string;
  lastChance: boolean;
}

interface PeriodicSyncEvent extends Event {
  tag: string;
}

declare global {
  interface Window {
    SyncManager: SyncManager;
    PeriodicSyncManager: PeriodicSyncManager;
  }
} 