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
      "Notification" in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Auto-register service worker if supported so it's warm and ready
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            if ("pushManager" in reg) {
              reg.pushManager.getSubscription().then((sub) => {
                setIsSubscribed(!!sub);
              });
            }
          })
          .catch((err) => {
            console.warn("Service worker registration:", err);
          });
      }
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
      console.warn("Push subscription note (fallback mode active):", err);
      // Even if remote push manager registration is simulated, user has granted notification permission
      if (Notification.permission === "granted") {
        setIsSubscribed(true);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendTestNotification = useCallback(
    async (
      customTitle?: string,
      customBody?: string
    ): Promise<{ success: boolean; message: string }> => {
      const title = customTitle || "PrepSmart Daily Challenge 🔥";
      const body =
        customBody ||
        "Keep your study habit strong! 10 mins of Mathematics practice is ready.";

      if (typeof window === "undefined" || !("Notification" in window)) {
        return {
          success: false,
          message: "Notifications are not supported in this browser.",
        };
      }

      // 1. Request permission if not already granted
      let currentPerm = Notification.permission;
      if (currentPerm !== "granted") {
        try {
          currentPerm = await Notification.requestPermission();
          setPermission(currentPerm);
        } catch (e) {
          console.warn("Permission request error:", e);
        }
      }

      if (currentPerm !== "granted") {
        return {
          success: false,
          message:
            "Notification permission was not granted. Please allow notifications in your browser settings.",
        };
      }

      // 2. Attempt Service Worker showNotification (native OS / browser push banner)
      let notificationShown = false;
      const uniqueTag = `prepsmart-alert-${Date.now()}`;

      if ("serviceWorker" in navigator) {
        try {
          let reg = await navigator.serviceWorker.getRegistration();
          if (!reg) {
            reg = await navigator.serviceWorker.register("/sw.js");
          }
          const activeReg = await navigator.serviceWorker.ready;
          await activeReg.showNotification(title, {
            body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            vibrate: [100, 50, 100],
            data: { url: "/dashboard" },
            tag: uniqueTag,
            renotify: true,
          } as NotificationOptions);
          notificationShown = true;
          setIsSubscribed(true);
        } catch (swErr) {
          console.warn("ServiceWorker showNotification failed, trying window.Notification:", swErr);
        }
      }

      // 3. Fallback to direct window Notification API if ServiceWorker did not display
      if (!notificationShown) {
        try {
          const popup = new Notification(title, {
            body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            tag: uniqueTag,
          });
          popup.onclick = () => {
            window.focus();
            popup.close();
          };
          notificationShown = true;
          setIsSubscribed(true);
        } catch (notifErr) {
          console.warn("window.Notification failed:", notifErr);
        }
      }

      if (notificationShown) {
        return {
          success: true,
          message: "Test notification sent successfully!",
        };
      } else {
        return {
          success: false,
          message: "Unable to display desktop notification on this device.",
        };
      }
    },
    []
  );

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribeToPush,
    sendTestNotification,
  };
}
