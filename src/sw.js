import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { skipWaiting, clientsClaim } from 'workbox-core';

skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1'),
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
);

self.addEventListener('push', (event) => {
  console.log('Push message received:', event.data.text());
  const notificationData = event.data.json();
  const title = notificationData.title || 'Notifikasi Baru';
  const options = {
    body: notificationData.body || 'Anda memiliki pesan baru.',
    icon: 'images/icons/icon-192x192.png',
    badge: 'images/icons/icon-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});