// Service worker de la web app de AI Office: avisos push (notificaciones web, iOS 16.4+ con la app en la pantalla de
// inicio). No guarda datos en caché: la app siempre lee de Supabase, así nunca enseña un estado viejo.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'AI Office', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'AI Office', {
    body: d.body || '',
    icon: '/office/iconos/icono-192.png',
    badge: '/office/iconos/icono-192.png',
    data: { url: d.url || '/office/' },
    tag: d.tag,
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/office/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
    for (const v of ventanas) { if (v.url.includes('/office/') && 'focus' in v) { v.navigate(url); return v.focus(); } }
    return self.clients.openWindow(url);
  }));
});
