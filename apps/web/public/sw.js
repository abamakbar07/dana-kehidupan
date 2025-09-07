self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('dana-shell').then((cache) => cache.addAll([
      '/',
      '/dashboard',
      '/manifest.webmanifest'
    ]))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

