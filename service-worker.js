 // service-worker.js

 const CACHE_NAME = 'math-trainer-v2.12';
 const urlsToCache = [
     'index.html' // Add your HTML file here
 ];
 
 self.addEventListener('install', event => {
     event.waitUntil(
         caches.open(CACHE_NAME)
             .then(cache => {
                 console.log('Opened cache and adding files');
                 return cache.addAll(urlsToCache);
             })
     );
 });
 
 self.addEventListener('fetch', event => {
     event.respondWith(
         caches.match(event.request)
             .then(response => {
                 if (response) {
                     console.log('Returning cached response for:', event.request.url);
                     return response; // Return cached response
                 }
 
                 console.log('Fetching from network:', event.request.url);
                 return fetch(event.request); // Fetch from network if not in cache
             })
     );
 });
 
 self.addEventListener('activate', event => {
     const cacheWhiteList = [CACHE_NAME];
      event.waitUntil(
          caches.keys().then(cacheNames => {
              return Promise.all(
                  cacheNames.map(cacheName => {
                      if (cacheWhiteList.indexOf(cacheName) === -1) {
                          console.log('Deleting old cache:', cacheName);
                          return caches.delete(cacheName);
                      }
                  })
              )
          })
      )
 });