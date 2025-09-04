const CACHE_NAME = 'wedding-hien-vi-v1.0';
const STATIC_CACHE = 'wedding-static-v1.0';
const DYNAMIC_CACHE = 'wedding-dynamic-v1.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// CDN assets to cache (update with your actual URLs)
const CDN_ASSETS = [
    'https://cdn.jsdelivr.net/gh/your-username/wedding-assets@main/images/hero-800.webp',
    'https://cdn.jsdelivr.net/gh/your-username/wedding-assets@main/images/hero-1920.webp',
    'https://cdn.jsdelivr.net/gh/your-username/wedding-assets@main/music/wedding-song-compressed.mp3'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('SW: Installing...');

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            }),
            // Cache CDN assets
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.addAll(CDN_ASSETS.slice(0, 2)); // Cache first 2 critical images
            })
        ]).then(() => {
            console.log('SW: Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('SW: Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE &&
                        cacheName !== DYNAMIC_CACHE &&
                        cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('SW: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const { url, method } = request;

    // Skip non-GET requests
    if (method !== 'GET') return;

    // Skip chrome-extension and other non-http requests
    if (!url.startsWith('http')) return;

    // Handle API requests - always from network
    if (url.includes('/api/')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({ error: 'Offline', success: false }),
                    {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            })
        );
        return;
    }

    // Handle font requests - cache first
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(request).then((response) => {
                return response || fetch(request).then((fetchResponse) => {
                    const responseClone = fetchResponse.clone();
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return fetchResponse;
                });
            })
        );
        return;
    }

    // Handle CDN assets (jsdelivr) - cache first with fallback
    if (url.includes('cdn.jsdelivr.net')) {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    // Return cached version and update in background
                    fetch(request).then((fetchResponse) => {
                        if (fetchResponse.status === 200) {
                            const responseClone = fetchResponse.clone();
                            caches.open(DYNAMIC_CACHE).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                    }).catch(() => {}); // Ignore network errors for background updates

                    return response;
                }

                // Not in cache, fetch from network
                return fetch(request).then((fetchResponse) => {
                    if (fetchResponse.status === 200) {
                        const responseClone = fetchResponse.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return fetchResponse;
                }).catch(() => {
                    // Fallback for images
                    if (request.destination === 'image') {
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-size="14">Offline</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                });
            })
        );
        return;
    }

    // Handle everything else - network first, cache fallback
    event.respondWith(
        fetch(request).then((response) => {
            // Don't cache non-success responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // Cache successful responses
            const responseToCache = response.clone();
            const cacheToUse = url.includes('/assets/') ? STATIC_CACHE : DYNAMIC_CACHE;

            caches.open(cacheToUse).then((cache) => {
                cache.put(request, responseToCache);
            });

            return response;
        }).catch(() => {
            // Network failed, try cache
            return caches.match(request).then((response) => {
                if (response) {
                    return response;
                }

                // Ultimate fallback for HTML requests
                if (request.destination === 'document') {
                    return caches.match('/index.html');
                }

                // Fallback for other requests
                return new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            console.log('SW: Background sync triggered')
        );
    }
});

// Push notification handler (if needed later)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/vite.svg',
                badge: '/vite.svg'
            })
        );
    }
});

// Clean up old cache entries periodically
const cleanupCaches = async () => {
    const cacheNames = await caches.keys();
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    const keys = await dynamicCache.keys();

    // Keep only latest 50 dynamic cache entries
    if (keys.length > 50) {
        const oldKeys = keys.slice(0, keys.length - 50);
        await Promise.all(
            oldKeys.map(key => dynamicCache.delete(key))
        );
    }
};

// Run cleanup every hour
setInterval(cleanupCaches, 60 * 60 * 1000);