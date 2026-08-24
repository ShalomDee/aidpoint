/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */
// Bump this string on every deploy that changes cached content — the SW cache
// is sticky, so index.html and everything cached-on-fetch under it stays stale
// for returning users until CACHE_NAME changes (that's what triggers activate's
// cleanup of the old cache below).
const CACHE_NAME = 'aidpoint-v1';
const APP_SHELL = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // keep only current
          .map((name) => caches.delete(name))    // delete others
      )
    )
  );
});


self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      }
    )
  );
});
