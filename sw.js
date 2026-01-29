const CACHE_NAME = "finance-app-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./css/main.css",
  "./css/themes.css",
  "./css/animations.css",
  "./js/app.js",
  "./js/storage.js",
  "./js/auth.js",
  "./js/categories.js",
  "./js/records.js",
  "./js/balance.js",
  "./js/ui.js",
  "./js/filters.js",
  "./js/export.js",
  "./js/analytics.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Установка и кеширование файлов
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Активация
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => 
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
