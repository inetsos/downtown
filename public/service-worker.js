const CACHE_NAME = 'pwa-cache-v1';
const OFFLINE_URL = '/offline.html';

// 설치 시 캐시할 리소스
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/pwa-192x192.png',
        '/pwa-512x512.png'
      ])
    )
  );
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// fetch 요청 처리
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then(response =>
      response || caches.match(OFFLINE_URL)
    ))
  );
});
