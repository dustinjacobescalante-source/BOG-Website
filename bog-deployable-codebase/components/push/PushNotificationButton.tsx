"use client";

import { useState } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function isStandaloneApp() {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function PushNotificationButton() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "enabled" | "unsupported" | "denied" | "error"
  >("idle");

  async function enablePushNotifications() {
    try {
      setStatus("loading");

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        console.error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
        setStatus("error");
        return;
      }

      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        setStatus("unsupported");
        return;
      }

      if (!isStandaloneApp()) {
        setStatus("unsupported");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/push-service-worker.js"
      );

      const existingSubscription =
        await registration.pushManager.getSubscription();

      const subscription =
        existingSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error("Failed to save push subscription");
      }

      setStatus("enabled");
    } catch (error) {
      console.error("Push notification setup failed:", error);
      setStatus("error");
    }
  }

  if (status === "unsupported") {
    return (
      <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-100">
        Push notifications are only available after adding BOG to your phone’s
        home screen and opening it from the app icon.
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-100">
        Push notifications were blocked. You may need to allow notifications for
        this app in your phone settings.
      </div>
    );
  }

  if (status === "enabled") {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm font-semibold text-emerald-100">
        <BellRing className="h-5 w-5" />
        Push notifications are enabled on this device.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={enablePushNotifications}
      disabled={status === "loading"}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {status === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enabling Push Notifications...
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" />
          Enable Push Notifications
        </>
      )}
    </button>
  );
}
