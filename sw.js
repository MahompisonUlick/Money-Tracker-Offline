const CACHE_NAME = 'moneytracker-v5';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// Install
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

// Activate
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.filter(function(cacheName) {
                        return cacheName !== CACHE_NAME;
                    }).map(function(cacheName) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

// Fetch
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(function(networkResponse) {
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }
                        
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch(function() {
                        return caches.match('./index.html');
                    });
            })
    );
});
