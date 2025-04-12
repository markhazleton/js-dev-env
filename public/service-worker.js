/**
 * Service Worker for Progressive Web App support
 */

// Cache name (update version to force cache refresh)
const CACHE_NAME = 'bootstrap-express-v1';

// Files to cache for offline access
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/fonts/bootstrap-icons/bootstrap-icons.css',
  '/fonts/bootstrap-icons/fonts/bootstrap-icons.woff',
  '/fonts/bootstrap-icons/fonts/bootstrap-icons.woff2',
  '/js/theme-toggle.js',
  '/js/component-library.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch strategy: Try network first, fall back to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to store in cache and return
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // Only cache successful responses
            if (event.request.method === 'GET' && response.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
        return response;
      })
      .catch(() => {
        // Network request failed, try to get from cache
        return caches.match(event.request);
      })
  );
});