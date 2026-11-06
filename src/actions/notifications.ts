"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateActiveStreak } from "@/lib/progress";

export interface UserNotificationState {
  userId: string;
  preferredStudyTime: "morning" | "afternoon" | "evening" | "night";
  dailyStudyMinutes: number;
  actionsToday: number;
  hasPracticedToday: boolean;
  isGoalMet: boolean; // actionsToday >= 3
  activeStreak: number;
  currentRank: number;
  userXp: number;
  userName: string;
}

export type NotificationType =
  | "STREAK_MOTIVATIONAL"
  | "PRACTICE_MILD"
  | "LEADERBOARD_OVERTAKEN"
  | "WEEKLY_UNRESOLVED_REVISION";

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string;
  actionText: string;
  priority: "high" | "normal";
  metadata?: Record<string, unknown>;
}

/**
 * Returns the current user's study status, practice progress today, and leaderboard rank.
 */
export async function getUserStudyNotificationStatus(
  requestedUserId?: string
): Promise<UserNotificationState | null> {
  try {
    const { userId: clerkUserId } = await auth();
    const userId = requestedUserId || clerkUserId || "demo-user-1";

    // 1. Fetch user and their onboarding profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        onboardingProfile: true,
      },
    });

    if (!user) {
      return null;
    }

    // 2. Fetch actions completed today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [xpActionsToday, examAttemptsToday, allXpLogs, allExamAttempts] =
      await Promise.all([
        prisma.xpHistory.count({
          where: {
            userId,
            createdAt: { gte: todayStart },
          },
        }),
        prisma.examAttempt.count({
          where: {
            userId,
            createdAt: { gte: todayStart },
          },
        }),
        prisma.xpHistory.findMany({
          where: { userId },
          select: { createdAt: true },
        }),
        prisma.examAttempt.findMany({
          where: { userId },
          select: { createdAt: true },
        }),
      ]);

    const actionsToday = xpActionsToday + examAttemptsToday;

    // 3. Compute active streak
    const activeStreak = calculateActiveStreak(
      allXpLogs.map((l) => l.createdAt),
      allExamAttempts.map((a) => a.createdAt)
    );

    // 4. Calculate 1-indexed global leaderboard rank
    const usersWithHigherXp = await prisma.user.count({
      where: {
        xp: { gt: user.xp },
      },
    });
    const currentRank = usersWithHigherXp + 1;

    const preferredStudyTime = (user.onboardingProfile?.preferredStudyTime as
      | "morning"
      | "afternoon"
      | "evening"
      | "night") || "evening";

    return {
      userId,
      preferredStudyTime,
      dailyStudyMinutes: user.onboardingProfile?.dailyStudyMinutes || 45,
      actionsToday,
      hasPracticedToday: actionsToday > 0,
      isGoalMet: actionsToday >= 3,
      activeStreak,
      currentRank,
      userXp: user.xp,
      userName: user.name || "Candidate",
    };
  } catch (err) {
    console.error("Failed to get user study notification status:", err);
    return null;
  }
}

/**
 * Checks whether a streak notification or leaderboard overtake notification should be sent.
 */
export async function checkStudyNotifications({
  clientHour,
  lastKnownRank,
  requestedUserId,
}: {
  clientHour?: number;
  lastKnownRank?: number | null;
  requestedUserId?: string;
}): Promise<{
  status: UserNotificationState | null;
  notifications: NotificationPayload[];
}> {
  const status = await getUserStudyNotificationStatus(requestedUserId);
  if (!status) {
    return { status: null, notifications: [] };
  }

  const notifications: NotificationPayload[] = [];
  const hour = typeof clientHour === "number" ? clientHour : new Date().getHours();

  // Helper: Determine if current hour matches or is past the preferred study time window
  const isTimeForStudy = (preferredTime: string, currentH: number): boolean => {
    switch (preferredTime) {
      case "morning":
        // Morning window: starts around 8am. If current hour is 8am or later, it's time or overdue
        return currentH >= 8;
      case "afternoon":
        // Afternoon window: starts around 12pm (12:00)
        return currentH >= 12;
      case "evening":
        // Evening window: starts around 17:00 (5pm)
        return currentH >= 17;
      case "night":
        // Night window: starts around 21:00 (9pm) or very early morning (0-5)
        return currentH >= 21 || currentH < 6;
      default:
        return currentH >= 17;
    }
  };

  const isStudyTimeReached = isTimeForStudy(status.preferredStudyTime, hour);

  // 1. Streak & Practice Notification Check
  if (isStudyTimeReached) {
    if (status.actionsToday === 0) {
      // User has not practiced at all on that day
      notifications.push({
        type: "STREAK_MOTIVATIONAL",
        title: "Protect Your PrepSmart Streak!",
        message:
          "JAMB is easy and most likely one of the easiest exams you may take in academics when you prepare consistently. Don't let your streak break today—jump into a 5-minute study session now!",
        actionUrl: "/study",
        actionText: "Start Daily Practice",
        priority: "high",
        metadata: {
          streak: status.activeStreak,
          preferredTime: status.preferredStudyTime,
        },
      });
    } else if (status.actionsToday < 3) {
      // User has started but not completed 3 actions today: give a milder notification
      const remaining = 3 - status.actionsToday;
      notifications.push({
        type: "PRACTICE_MILD",
        title: "Keep Your Momentum Going!",
        message:
          status.actionsToday === 1
            ? "Great start with your first study drill today! Complete 2 more quick questions to hit your 3-action daily target."
            : `You've completed ${status.actionsToday} practice sessions today! Knock out ${remaining} more quick question to lock in your daily goal.`,
        actionUrl: "/study",
        actionText: "Continue Practice",
        priority: "normal",
        metadata: {
          actionsToday: status.actionsToday,
          remaining,
        },
      });
    }
  }

  // 2. Leaderboard Overtake Check
  // User had a 1st, 2nd, or 3rd position, and someone took their position
  if (
    typeof lastKnownRank === "number" &&
    lastKnownRank >= 1 &&
    lastKnownRank <= 3 &&
    status.currentRank > lastKnownRank
  ) {
    const rankLabels: Record<number, string> = {
      1: "1st place",
      2: "2nd place",
      3: "3rd place",
    };
    const lostPosition = rankLabels[lastKnownRank] || `${lastKnownRank}th place`;

    notifications.push({
      type: "LEADERBOARD_OVERTAKEN",
      title: "Leaderboard Alert: Position Taken!",
      message: `Another candidate just overtook you and claimed ${lostPosition} on the weekly leaderboard! Jump back in and answer practice questions to reclaim your spot.`,
      actionUrl: "/leaderboard",
      actionText: "Reclaim Your Rank",
      priority: "high",
      metadata: {
        previousRank: lastKnownRank,
        newRank: status.currentRank,
      },
    });
  }

  // 3. End-of-Week Unresolved Revision Check (Thursday, Friday, Saturday, Sunday)
  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 4 is Thursday, 5 is Friday, 6 is Saturday
  const isEndOfWeek = currentDayOfWeek === 4 || currentDayOfWeek === 5 || currentDayOfWeek === 6 || currentDayOfWeek === 0;

  if (isEndOfWeek) {
    try {
      const unresolvedRevisionCount = await prisma.failedQuestion.count({
        where: { userId: status.userId },
      });

      if (unresolvedRevisionCount > 0) {
        notifications.push({
          type: "WEEKLY_UNRESOLVED_REVISION",
          title: "Weekly Revision: Unresolved Weak Topics!",
          message: `You have ${unresolvedRevisionCount} weak topic error${unresolvedRevisionCount === 1 ? "" : "s"} waiting in your Revision Hub from this week. Master your 3-question drills before the week closes to boost your Readiness Index!`,
          actionUrl: "/dashboard?tab=revision",
          actionText: "Practice Weak Topics",
          priority: "high",
          metadata: {
            unresolvedCount: unresolvedRevisionCount,
            dayOfWeek: currentDayOfWeek,
          },
        });
      }
    } catch (revisionErr) {
      console.warn("Could not check unresolved revision count:", revisionErr);
    }
  }

  return { status, notifications };
}

