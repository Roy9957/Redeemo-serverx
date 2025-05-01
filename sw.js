self.addEventListener('push', event => {
  const payload = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(
      payload.title || 'Notification',
      {
        body: payload.body || '',
        icon: '/icon.png'
      }
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('http:localhost:7700')
  );
});