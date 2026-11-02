"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCurrentUser } from "@/providers/AuthProvider";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  checkStudyNotifications,
  type NotificationPayload,
  type UserNotificationState,
} from "@/actions/notifications";
import StudyNotificationBanner from "./StudyNotificationBanner";

const LAST_RANK_STORAGE_KEY = "prepsmart_last_known_rank";
const LAST_STREAK_NOTIFIED_KEY = "prepsmart_last_streak_notified";

export default function StudyNotificationManager() {
  const { isSignedIn, user } = useCurrentUser();
  const { dispatchNotification } = usePushNotifications();
  const [activeNotification, setActiveNotification] = useState<NotificationPayload | null>(null);
  const isCheckingRef = useRef(false);

  const performNotificationCheck = useCallback(async () => {
    if (!isSignedIn || !user || isCheckingRef.current) return;

    isCheckingRef.current = true;
    try {
      const clientHour = new Date().getHours();
      const todayDateStr = new Date().toISOString().split("T")[0];

      // Retrieve previous rank from local storage
      const storedRankStr =
        typeof window !== "undefined"
          ? window.localStorage.getItem(LAST_RANK_STORAGE_KEY)
          : null;
      const lastKnownRank = storedRankStr ? parseInt(storedRankStr, 10) : null;

      // Query server status & notification conditions
      const { status, notifications } = await checkStudyNotifications({
        clientHour,
        lastKnownRank,
        requestedUserId: user.id,
      });

      if (!status) return;

      // Update stored rank for the user
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LAST_RANK_STORAGE_KEY, status.currentRank.toString());
      }

      // Check whether streak notification was already shown today for this action status
      let alreadyNotifiedToday = false;
      if (typeof window !== "undefined") {
        try {
          const notifiedRaw = window.localStorage.getItem(LAST_STREAK_NOTIFIED_KEY);
          if (notifiedRaw) {
            const parsed = JSON.parse(notifiedRaw);
            if (parsed.date === todayDateStr && parsed.actionsToday === status.actionsToday) {
              alreadyNotifiedToday = true;
            }
          }
        } catch {
          // ignore parsing error
        }
      }

      // Prioritize leaderboard overtake alerts, then streak alerts
      const overtakeAlert = notifications.find((n) => n.type === "LEADERBOARD_OVERTAKEN");
      const streakAlert = notifications.find(
        (n) => n.type === "STREAK_MOTIVATIONAL" || n.type === "PRACTICE_MILD"
      );

      let chosenNotification: NotificationPayload | null = null;

      if (overtakeAlert) {
        chosenNotification = overtakeAlert;
      } else if (streakAlert && !alreadyNotifiedToday) {
        chosenNotification = streakAlert;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            LAST_STREAK_NOTIFIED_KEY,
            JSON.stringify({
              date: todayDateStr,
              type: streakAlert.type,
              actionsToday: status.actionsToday,
            })
          );
        }
      }

      if (chosenNotification) {
        setActiveNotification(chosenNotification);

        // Also trigger native browser/OS push notification if allowed
        dispatchNotification({
          title: chosenNotification.title,
          body: chosenNotification.message,
          url: chosenNotification.actionUrl,
          tag: chosenNotification.type,
        }).catch((err) => {
          console.warn("Native push dispatch note:", err);
        });
      }
    } catch (err) {
      console.warn("Notification check skipped:", err);
    } finally {
      isCheckingRef.current = false;
    }
  }, [isSignedIn, user, dispatchNotification]);

  // Run on mount, when auth changes, and poll every 60 seconds
  useEffect(() => {
    if (!isSignedIn) return;

    performNotificationCheck();

    const interval = setInterval(() => {
      performNotificationCheck();
    }, 60 * 1000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        performNotificationCheck();
      }
    };

    const handleManualOvertake = (e: Event) => {
      const customEvent = e as CustomEvent<{
        previousRank: number;
        newRank: number;
      }>;
      const prevRank = customEvent.detail?.previousRank || 2;
      const rankLabels: Record<number, string> = {
        1: "1st place",
        2: "2nd place",
        3: "3rd place",
      };
      const label = rankLabels[prevRank] || `${prevRank}th place`;

      const notification: NotificationPayload = {
        type: "LEADERBOARD_OVERTAKEN",
        title: "Leaderboard Alert: Position Taken!",
        message: `Another candidate just overtook you and claimed ${label} on the weekly leaderboard! Jump back in and answer practice questions to reclaim your spot.`,
        actionUrl: "/leaderboard",
        actionText: "Reclaim Your Rank",
        priority: "high",
        metadata: {
          previousRank: prevRank,
          newRank: customEvent.detail?.newRank || 4,
        },
      };

      setActiveNotification(notification);
      dispatchNotification({
        title: notification.title,
        body: notification.message,
        url: notification.actionUrl,
        tag: "LEADERBOARD_OVERTAKEN",
      });
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("prepsmart:leaderboard_overtaken", handleManualOvertake);
    window.addEventListener("prepsmart:check_notifications", performNotificationCheck);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("prepsmart:leaderboard_overtaken", handleManualOvertake);
      window.removeEventListener("prepsmart:check_notifications", performNotificationCheck);
    };
  }, [isSignedIn, performNotificationCheck, dispatchNotification]);

  if (!isSignedIn || !activeNotification) {
    return null;
  }

  return (
    <StudyNotificationBanner
      notification={activeNotification}
      onDismiss={() => setActiveNotification(null)}
    />
  );
}

