import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache semua aset yang dihasilkan oleh Webpack
precacheAndRoute(self.__WB_MANIFEST);

// Strategi caching untuk API (StaleWhileRevalidate)
registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1'),
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
);

// Strategi caching untuk gambar (CacheFirst)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Hari
      }),
    ],
  })
);

// Event listener untuk push notification
self.addEventListener('push', (event) => {
    console.log('Push message received:', event.data.text());
    const notificationData = event.data.json();
    const title = notificationData.title || 'Notifikasi Baru';
    const options = {
        body: notificationData.body || 'Anda memiliki pesan baru.',
        icon: 'images/icons/icon-192x192.png',
        badge: 'images/icons/icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});