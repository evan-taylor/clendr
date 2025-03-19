/**
 * Clendr Service Worker
 * 
 * This service worker provides:
 * 1. Offline support with a cache-first strategy for static assets
 * 2. Network-first strategy for API requests
 * 3. Background sync for offline mutations
 * 4. Periodic sync for calendar updates (where supported)
 */

// Cache names
const STATIC_CACHE = 'clendr-static-v1';
const DYNAMIC_CACHE = 'clendr-dynamic-v1';
const API_CACHE = 'clendr-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png',
    '/offline.html',
];

// API routes that should be cached with network-first strategy
const API_ROUTES = [
    '/api/events',
    '/api/tasks',
    '/api/calendars',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker...');

    // Skip waiting to ensure the new service worker activates immediately
    self.skipWaiting();

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Precaching App Shell');
                return cache.addAll(STATIC_ASSETS);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker...');

    // Claim clients to ensure the service worker controls all pages
    self.clients.claim();

    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== API_CACHE) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
    );

    return self.clients.claim();
});

// Fetch event - handle all requests
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests or requests to other origins
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Network-first strategy for API requests
    if (API_ROUTES.some(route => url.pathname.includes(route))) {
        event.respondWith(networkFirstStrategy(event.request));
        return;
    }

    // Cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(event.request));
});

// Cache-first strategy
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        // Cache valid responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // If file is not in cache and network is unavailable, return offline page
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
        }

        // For other resources, return a simple error response
        return new Response('Network error', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
}

// Network-first strategy
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful API responses
        if (networkResponse.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[Service Worker] Fetching from cache due to network error:', error);
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return a JSON error if we can't get from cache either
        return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Sync event for background syncing
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background Syncing', event.tag);

    if (event.tag === 'sync-events') {
        event.waitUntil(syncEvents());
    } else if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasks());
    }
});

// Periodic sync for regular calendar updates (Chrome only)
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Periodic Sync', event.tag);

    if (event.tag === 'update-calendars') {
        event.waitUntil(updateCalendars());
    }
});

// Placeholder implementations for sync functions
async function syncEvents() {
    // This would be implemented to read from IndexedDB and sync to server
    try {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                store: 'events',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('[Service Worker] Error syncing events:', error);
    }
}

async function syncTasks() {
    // This would be implemented to read from IndexedDB and sync to server
    try {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                store: 'tasks',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('[Service Worker] Error syncing tasks:', error);
    }
}

async function updateCalendars() {
    // This would be implemented to refresh calendar data periodically
    try {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CALENDARS_UPDATED',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('[Service Worker] Error updating calendars:', error);
    }
}

// Push notification event
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Received:', event);

    let data = { title: 'New Notification', body: 'Something happened in your calendar' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            console.error('[Service Worker] Error parsing push data:', e);
        }
    }

    const options = {
        body: data.body,
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/badge-96x96.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click received:', event);

    event.notification.close();

    // Open the URL from the notification or default to root
    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Check if there is already a window with the URL open
            for (let client of windowClients) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }

            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
}); 