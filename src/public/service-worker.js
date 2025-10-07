/**
 * Service Worker for Progressive Web App support
 */

// Cache name (update version to force cache refresh)
const CACHE_NAME = 'bootstrap-express-v1';

// Files to cache for offline access
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/dependencies.css',
  '/js/dependencies.min.js',
  '/fonts/bootstrap-icons/bootstrap-icons.css',
  '/fonts/bootstrap-icons/fonts/bootstrap-icons.woff',
  '/fonts/bootstrap-icons/fonts/bootstrap-icons.woff2',
  '/js/theme-toggle.js',
  '/js/component-library.js'
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
  // Only handle http/https requests, skip chrome-extension and other schemes
  if (!event.request.url.startsWith('http://') && !event.request.url.startsWith('https://')) {
    return;
  }

  // Skip YouTube thumbnail requests that might cause CSP violations
  // Let the browser handle these directly
  if (event.request.url.includes('i.ytimg.com')) {
    return; // Let the browser handle this request normally
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if response is valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response to store in cache and return
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // Only cache successful responses for GET requests from our domain
            if (event.request.method === 'GET' && 
                response.status === 200 &&
                (event.request.url.startsWith('http://localhost') || 
                 event.request.url.includes(location.hostname))) {
              try {
                cache.put(event.request, responseToCache);
              } catch (error) {
                console.warn('Cache put failed:', error);
              }
            }
          });
        return response;
      })
      .catch(error => {
        console.log('Fetch failed for:', event.request.url, error);
        
        // Network request failed, try to get from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If not in cache and it's a navigation request, return a fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // For other requests, return a simple error response
            return new Response('Network error', {
              status: 408,
              statusText: 'Network timeout'
            });
          });
      })
  );
});