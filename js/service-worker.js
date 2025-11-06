// service-worker.js - Update URLs to match new menu structure
const CACHE_NAME = 'ts-biro-v4'; // Increment version
const CRITICAL_URLS = [
    '/',
    '/index.html',
    '/css/critical.css',
    '/js/script.js',
    '/images/TS-Biro-Circle-logo.svg',
    '/images/icons/favicon.ico'
];

const NON_CRITICAL_URLS = [
    '/css/non-critical.css',
    '/config/manifest.json',
    '/knjigovodstvo-racunovodstvo.html',
    '/place-kadrovska-evidencija.html',
    '/financijsko-poslovno-savjetovanje.html',
    '/sudsko-vjestacenje.html'
];

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching critical resources');
                return cache.addAll(CRITICAL_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    // Cache successful responses
                    if (response.status === 200 && response.type === 'basic') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return response;
                });
            }).catch(() => {
                // Fallback for failed requests
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});