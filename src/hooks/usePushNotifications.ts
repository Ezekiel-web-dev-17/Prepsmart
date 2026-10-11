"use client";

import { useState, useEffect, useCallback } from "react";
import { urlBase64ToUint8Array, DEFAULT_VAPID_PUBLIC_KEY } from "@/lib/push";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check existing subscription
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    } else {
      setPermission("unsupported");
    }
  }, []);

  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      // 1. Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setIsLoading(false);
        return false;
      }

      // 2. Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3. Subscribe to PushManager
      const convertedKey = urlBase64ToUint8Array(DEFAULT_VAPID_PUBLIC_KEY);
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey.buffer as ArrayBuffer,
      });

      // 4. Send subscription to PrepSmart API
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Push subscription failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendTestNotification = useCallback(async (title?: string, body?: string) => {
    if (!isSupported || Notification.permission !== "granted") {
      await subscribeToPush();
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title || "PrepSmart Daily Challenge 🔥", {
        body: body || "Your 4-week UTME study target is active. 10 mins of Mathematics ready!",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        vibrate: [100, 50, 100],
        data: { url: "/dashboard" },
      } as NotificationOptions);
    } catch (err) {
      console.warn("Direct notification fallback:", err);
    }
  }, [isSupported, subscribeToPush]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribeToPush,
    sendTestNotification,
  };
}
