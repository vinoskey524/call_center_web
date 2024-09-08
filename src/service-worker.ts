const CACHE_NAME = 'sgc_cache';
const urlsToCache = [
    '/',  // Cache the root URL
];

// // Install event - caching static assets
// self.addEventListener('install', (event: ExtendableEvent) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(cache => {
//             console.log('Opened cache');
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// // Activate event - cleaning up old caches
// self.addEventListener('activate', (event: ExtendableEvent) => {
//     const cacheWhitelist = [CACHE_NAME];
//     event.waitUntil(
//         caches.keys().then(cacheNames => {
//             return Promise.all(
//                 cacheNames.map(cacheName => {
//                     if (!cacheWhitelist.includes(cacheName)) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// // Fetch event - serving cached content when offline
// self.addEventListener('fetch', (event: FetchEvent) => {
//     event.respondWith(
//         caches.match(event.request).then(response => {
//             // Return the cached response if found, else fetch from network
//             return response || fetch(event.request);
//         })
//     );
// });

export { };