
// A simple service worker for caching assets for offline use.

const CACHE_NAME = 'research-assistant-cache-v1';
// Add the URLs of the resources you want to cache.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  // You can add other important assets here
  // For example, '/App.tsx', '/components/Sidebar.tsx', etc.
  // However, for a simple offline-first experience, caching the main entry points is enough.
];

// Install event: open a cache and add the core assets to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve assets from cache if available, otherwise fetch from network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});
