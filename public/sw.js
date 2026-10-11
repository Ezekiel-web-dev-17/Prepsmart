// public/sw.js
// PrepSmart Service Worker for Native Web Push Notifications (Duolingo / Pinterest style)

self.addEventListener("install", (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    title: "PrepSmart Study Reminder 🔥",
    body: "Keep your streak alive! 10 minutes of high-yield practice awaits.",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      url: "/dashboard",
    },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/favicon.ico",
    badge: data.badge || "/favicon.ico",
    vibrate: [100, 50, 100],
    data: data.data || { url: "/dashboard" },
    tag: data.tag || "prepsmart-reminder",
    renotify: true,
    actions: [
      { action: "study-now", title: "Study Now" },
      { action: "snooze", title: "Later" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "snooze") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
