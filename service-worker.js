 // service-worker.js

 const CACHE_NAME = 'math-trainer-v2.15';
 const urlsToCache = [
     'index.html'
 ];
 
 self.addEventListener('install', event => {
     event.waitUntil(
         caches.open(CACHE_NAME)
             .then(cache => {
                 console.log('Opened cache and adding files');
                  return cache.addAll(urlsToCache)
                   .catch(err => {
                        console.error('Error during cache.addAll:', err);
                        throw err;
                    });
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
                return fetch(event.request)
                   .then(fetchResponse => {
                     if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                       console.log('Failed to fetch from network or response not suitable for caching:', event.request.url, fetchResponse ? fetchResponse.status : 'no response', fetchResponse ? fetchResponse.type : 'no response');
                         return fetchResponse;
                       }
                      return caches.open(CACHE_NAME)
                         .then(cache => {
                             console.log('Adding resource to cache:', event.request.url);
                             return cache.put(event.request, fetchResponse.clone())
                              .then(() => fetchResponse)
                             .catch(err => {
                                    console.error('Error during cache.put:', event.request.url, err);
                                     throw err; // Re-throw so we can catch the `fetch` error properly
                                });
                              })
                   }).catch(err => {
                       console.error('Error during fetch or cache put:', event.request.url, err);
                       throw err; // Propagate the error so it can be handled properly
                    });
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