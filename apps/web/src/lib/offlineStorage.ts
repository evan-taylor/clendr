/**
 * Comprehensive IndexedDB implementation for Clendr
 * 
 * This module provides a generic storage solution for offline data,
 * synchronization tracking, and cached API responses.
 */

// Database structure
interface DatabaseSchema {
  events: {
    key: string; // event ID
    data: any; // event data
    lastModified: number; // timestamp for sync
    syncStatus: 'synced' | 'pending' | 'conflict';
  };
  tasks: {
    key: string; // task ID
    data: any; // task data
    lastModified: number; // timestamp for sync
    syncStatus: 'synced' | 'pending' | 'conflict';
  };
  settings: {
    key: string; // setting ID
    data: any; // setting value
    lastModified: number; // timestamp for sync
  };
  cache: {
    key: string; // cache key
    data: any; // cached data
    expiry: number; // expiry timestamp
  };
}

// Database config
const DB_NAME = 'clendrOfflineDB';
const DB_VERSION = 1;
const STORES = ['events', 'tasks', 'settings', 'cache'];

// Generic operations
class OfflineStorage {
  private static instance: OfflineStorage;
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  /**
   * Initialize the database
   */
  private async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    
    if (this.dbPromise) return this.dbPromise;
    
    this.dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }
      
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        reject(new Error('Failed to open database'));
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        
        // Create object stores if they don't exist
        STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'key' });
          }
        });
      };
    });
    
    return this.dbPromise;
  }

  /**
   * Generic method to get an item from a store
   */
  public async get<T = any>(storeName: keyof DatabaseSchema, key: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            // For cache items, check expiry
            if (storeName === 'cache' && result.expiry < Date.now()) {
              this.delete(storeName, key); // Clean up expired item
              resolve(null);
            } else {
              resolve(result.data as T);
            }
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          reject(new Error(`Error retrieving ${key} from ${storeName}`));
        };
      });
    } catch (error) {
      console.error(`Error getting item from IndexedDB (${storeName}):`, error);
      return null;
    }
  }

  /**
   * Generic method to set an item in a store
   */
  public async set<T = any>(
    storeName: keyof DatabaseSchema, 
    key: string, 
    data: T, 
    options: {
      expiry?: number; // for cache items
      syncStatus?: 'synced' | 'pending' | 'conflict'; // for syncable items
    } = {}
  ): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const item: any = {
          key,
          data,
          lastModified: Date.now()
        };
        
        // Add store-specific properties
        if (storeName === 'cache' && options.expiry) {
          item.expiry = options.expiry;
        }
        
        if (['events', 'tasks'].includes(storeName) && options.syncStatus) {
          item.syncStatus = options.syncStatus;
        } else if (['events', 'tasks'].includes(storeName)) {
          item.syncStatus = 'pending'; // Default for syncable items
        }
        
        const request = store.put(item);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Error storing ${key} in ${storeName}`));
      });
    } catch (error) {
      console.error(`Error setting item in IndexedDB (${storeName}):`, error);
    }
  }

  /**
   * Generic method to delete an item from a store
   */
  public async delete(storeName: keyof DatabaseSchema, key: string): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Error deleting ${key} from ${storeName}`));
      });
    } catch (error) {
      console.error(`Error deleting item from IndexedDB (${storeName}):`, error);
    }
  }

  /**
   * Get all items from a store
   */
  public async getAll<T = any>(storeName: keyof DatabaseSchema): Promise<T[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          // For cache items, filter out expired ones
          if (storeName === 'cache') {
            const now = Date.now();
            const items = request.result.filter(item => item.expiry > now);
            resolve(items.map(item => item.data));
          } else {
            resolve(request.result.map(item => item.data));
          }
        };
        
        request.onerror = () => reject(new Error(`Error retrieving all from ${storeName}`));
      });
    } catch (error) {
      console.error(`Error getting all items from IndexedDB (${storeName}):`, error);
      return [];
    }
  }

  /**
   * Get all pending sync items
   */
  public async getPendingSyncItems<T = any>(storeName: 'events' | 'tasks'): Promise<Array<{ key: string; data: T; lastModified: number }>> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          const pendingItems = request.result
            .filter(item => item.syncStatus === 'pending')
            .map(({ key, data, lastModified }) => ({ key, data, lastModified }));
          
          resolve(pendingItems);
        };
        
        request.onerror = () => reject(new Error(`Error retrieving pending items from ${storeName}`));
      });
    } catch (error) {
      console.error(`Error getting pending sync items from IndexedDB (${storeName}):`, error);
      return [];
    }
  }

  /**
   * Mark items as synced
   */
  public async markAsSynced(storeName: 'events' | 'tasks', keys: string[]): Promise<void> {
    try {
      const db = await this.getDb();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      for (const key of keys) {
        const getRequest = store.get(key);
        
        getRequest.onsuccess = () => {
          const item = getRequest.result;
          if (item) {
            item.syncStatus = 'synced';
            store.put(item);
          }
        };
      }
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(new Error(`Error marking items as synced in ${storeName}`));
      });
    } catch (error) {
      console.error(`Error marking items as synced in IndexedDB (${storeName}):`, error);
    }
  }

  /**
   * Clear a store
   */
  public async clear(storeName: keyof DatabaseSchema): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Error clearing ${storeName}`));
      });
    } catch (error) {
      console.error(`Error clearing store in IndexedDB (${storeName}):`, error);
    }
  }
}

// Export singleton instance
export const offlineStorage = OfflineStorage.getInstance(); 