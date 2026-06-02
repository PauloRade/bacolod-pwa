const cacheName = "DefaultCompany-bacolod-project-frontend-0.0.3";
const contentToCache = [
    "Build/8e8193bb04ba07e4649b40eb1e030f2e.loader.js",
    "Build/f81453513d71ae9bc034e59202c475fc.framework.js.unityweb",
    "Build/5d5a24e208d57e7f951f9a70740f77d1.data.unityweb",
    "Build/3f8f05e7ca8229f007929cac75c05ad7.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      try {
        // 1. Try to fetch from the network first
        console.log(`[Service Worker] Fetching from network: ${e.request.url}`);
        const response = await fetch(e.request);
        
        // 2. If network request is successful, update the cache with the new version
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Updating cache: ${e.request.url}`);
        cache.put(e.request, response.clone());
        
        return response;
      } catch (error) {
        // 3. If network fails (offline), fallback to the cache
        console.log(`[Service Worker] Network failed, looking in cache: ${e.request.url}`);
        const cachedResponse = await caches.match(e.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If it's not in the network and not in the cache, throw the error
        throw error;
      }
    })());
});
