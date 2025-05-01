// Service Worker Version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `withdrawal-sw-${CACHE_VERSION}`;
const DEFAULT_ICON = '/icon.png';
const FALLBACK_URL = 'https://roy9957.github.io/Redeemo/withdraw.html'; // Replace with your actual domain

// Install Event - Caching important assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          DEFAULT_ICON,
          '/',
          '/index.html'
        ]);
      })
  );
});

// Push Notification Event
self.addEventListener('push', event => {
  // Parse the push notification data
  const payload = event.data?.json() || {
    title: 'New Update',
    body: 'You have a new withdrawal update',
    data: { url: FALLBACK_URL }
  };

  // Ensure the payload has required fields
  const title = payload.title || 'Notification';
  const options = {
    body: payload.body || '',
    icon: payload.icon || DEFAULT_ICON,
    badge: '/badge.png',
    data: {
      url: payload.data?.url || FALLBACK_URL
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const urlToOpen = new URL(
    event.notification.data?.url || FALLBACK_URL,
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if there's already a tab open with this URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no matching tab, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
