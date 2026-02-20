/**
 * Minimal Service Worker for PWA Installability
 * 
 * Purpose: Enable "Add to Home Screen" functionality
 * Does NOT cache API responses or enable offline mode
 * Does NOT interfere with Firebase/Firestore
 */

const CACHE_NAME = 'khatm-shell-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
];

// Install event - cache only the app shell (HTML)
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            // Force activation immediately
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            // Take control immediately
            return self.clients.claim();
        })
    );
});

// Fetch event - Network-first strategy (no offline support)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // IMPORTANT: Never cache these
    const noCachePatterns = [
        '/api/',                    // Any API calls
        'firestore.googleapis.com', // Firebase Firestore
        'identitytoolkit.googleapis.com', // Firebase Auth
        'quran.com',                // Quran API
        'cdn.jsdelivr.net',         // External CDNs
        'googleapis.com',           // Google APIs
        'fonts.googleapis.com',     // Skip fonts (already cached by browser)
    ];

    // Check if URL should never be cached
    const shouldNotCache = noCachePatterns.some(pattern =>
        url.href.includes(pattern)
    );

    if (shouldNotCache) {
        // Always go to network, never cache
        return;
    }

    // For static assets only: try network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Only cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache only for static assets
                return caches.match(request);
            })
    );
});

// Message event - for future install prompt control
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
