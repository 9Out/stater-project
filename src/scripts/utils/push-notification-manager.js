// src/scripts/utils/push-notification-manager.js

import CONFIG from '../config';

const PushNotificationManager = {
  async subscribePush() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker tidak didukung.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    if (!('pushManager' in window)) {
      console.log('Push Manager tidak didukung.');
      return;
    }

    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('Belum berlangganan notifikasi.');
      return this.requestSubscription(registration);
    }

    console.log('Sudah berlangganan notifikasi: ', subscription);
    // Kirim subscription yang sudah ada jika belum dikirim
    await this.sendSubscriptionToServer(subscription);
    return subscription;
  },

  async requestSubscription(serviceWorkerRegistration) {
    try {
      const pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
      });

      console.log('Berhasil berlangganan: ', pushSubscription);
      await this.sendSubscriptionToServer(pushSubscription);
    } catch (error) {
      console.error('Gagal berlangganan push:', error);
    }
  },

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  async sendSubscriptionToServer(subscription) {
    // Endpoint API yang benar adalah /subscriptions, bukan /push/subscribe
    const apiUrl = `${CONFIG.BASE_URL}/subscriptions`; 
    // Kunci localStorage yang benar adalah 'userToken'
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
      console.warn('Tidak ada token pengguna, langganan tidak dikirim ke server.');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(subscription),
      });

      const responseJson = await response.json();
      if (response.status !== 201) { // API mengembalikan status 201 untuk sukses
        console.error('Gagal mengirim langganan ke server:', responseJson.message);
      } else {
        console.log('Berhasil mengirim langganan ke server:', responseJson);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengirim langganan ke server:', error);
    }
  },
};

export default PushNotificationManager;