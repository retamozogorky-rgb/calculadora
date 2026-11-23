// Cache para que la app funcione sin internet.
var CACHE = 'eclosion-v4';
var ARCHIVOS = ['./', './index.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        if (res.ok) { var copia = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copia); }); }
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
