const CACHE_NAME = 'felsefe-egitimi-cantasi-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  // AI Studio CDN'lerini de önbelleğe alarak hızı artıralım
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/@google/genai@^1.16.0'
];

// Çevrimdışı durumunda gösterilecek basit bir sayfa
const OFFLINE_PAGE = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Felsefe Eğitimi Çantası - Çevrimdışı</title>
  <style>
    body { background-color: #111827; color: #d1d5db; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .container { max-width: 400px; padding: 2rem; }
    h1 { font-size: 1.5rem; color: #c7d2fe; }
    p { font-size: 1rem; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Çevrimdışı</h1>
    <p>Uygulamayı kullanmak için internet bağlantısı gereklidir. Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
  </div>
</body>
</html>`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // offline.html'i önbelleğe al
        const offlinePageResponse = new Response(OFFLINE_PAGE, { headers: { 'Content-Type': 'text/html' } });
        cache.put('/offline.html', offlinePageResponse);
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).catch(() => {
          // Fetch başarısız olursa (çevrimdışı), offline sayfasını göster
          return caches.match('/offline.html');
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});