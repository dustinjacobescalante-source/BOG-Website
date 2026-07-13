self.addEventListener("push", function (event) {
  let data = {
    title: "BOG Buffalo Dogs",
    body: "You have a new notification.",
    url: "/portal/notifications",
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json(),
      };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icon.png",
    badge: "/icon.png",
    data: {
      url: data.url || "/portal/notifications",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "BOG Buffalo Dogs", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/portal/notifications";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return null;
      })
  );
});
