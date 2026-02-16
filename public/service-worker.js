const CACHE_NAME = 'block-puzzle-v4';
// BUILD_ASSETS_PLACEHOLDER
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/icon.png',
  ...(typeof BUILD_ASSETS !== 'undefined' ? BUILD_ASSETS : []),
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Pre-caching', ASSETS_TO_CACHE.length, 'assets');
      // Cache each asset individually so one failure doesn't block the rest
      const results = await Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Failed to cache:', url, err.message);
          })
        )
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed > 0) {
        console.warn(`[SW] ${failed}/${ASSETS_TO_CACHE.length} assets failed to cache`);
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation requests: try network, fall back to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest index.html
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // All other same-origin requests: cache-first, network-fallback, then offline index.html
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // For JS/CSS requests that fail offline and aren't cached,
          // fall back to index.html so the app shell can render
          if (event.request.destination === 'document' ||
              event.request.destination === 'script' ||
              event.request.destination === 'style') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
