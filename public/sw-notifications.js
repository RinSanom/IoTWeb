// Service Worker for Push Notifications
const CACHE_NAME = 'air-quality-v1';
const NOTIFICATION_TAG = 'air-quality-alert';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Push event handler
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  let notificationData = {
    title: 'Air Quality Alert',
    body: 'Air quality levels exceed safe limits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: NOTIFICATION_TAG,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: '/air-quality',
      timestamp: Date.now()
    }
  };

  // If push data is provided, use it
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: notificationData.data,
      vibrate: [200, 100, 200],
      sound: '/sounds/alert.mp3'
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/air-quality';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with our app
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for air quality checks
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'air-quality-check') {
    event.waitUntil(checkAirQualityAndNotify());
  }
});

async function checkAirQualityAndNotify() {
  try {
    // Get the latest air quality data
    const response = await fetch('/api/air-quality/latest');
    if (!response.ok) return;
    
    const data = await response.json();
    const airQualityLevel = data.aqi || 0;
    
    // Check if air quality exceeds 50% (AQI > 100 is typically considered unhealthy)
    // Adjusting threshold: 50% of maximum scale (200) = 100 AQI
    if (airQualityLevel > 100) {
      await sendAirQualityNotification(airQualityLevel, data);
    }
  } catch (error) {
    console.error('Error checking air quality:', error);
  }
}

async function sendAirQualityNotification(aqi, data) {
  const notificationData = {
    title: 'Air Quality Alert! 🚨',
    body: `Air quality is unhealthy (AQI: ${aqi}). Consider staying indoors and avoid outdoor activities.`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'air-quality-high',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'settings',
        title: 'Notification Settings'
      }
    ],
    data: {
      url: '/air-quality',
      aqi: aqi,
      timestamp: Date.now()
    }
  };

  await self.registration.showNotification(notificationData.title, {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    actions: notificationData.actions,
    data: notificationData.data,
    vibrate: [300, 100, 300, 100, 300],
    silent: false
  });
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'CHECK_AIR_QUALITY') {
    checkAirQualityAndNotify();
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
