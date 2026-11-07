"use client";

import Link from "next/link";
import type { NotificationPayload } from "@/actions/notifications";
import {
  FlameIcon,
  TargetIcon,
  TrophyIcon,
  XIcon,
  ArrowRightIcon,
  SparklesIcon,
  RefreshCwIcon,
} from "@/components/ui/icons";

interface StudyNotificationBannerProps {
  notification: NotificationPayload;
  onDismiss: () => void;
}

export default function StudyNotificationBanner({
  notification,
  onDismiss,
}: StudyNotificationBannerProps) {
  const isStreak = notification.type === "STREAK_MOTIVATIONAL";
  const isMild = notification.type === "PRACTICE_MILD";
  const isLeaderboard = notification.type === "LEADERBOARD_OVERTAKEN";
  const isWeeklyRevision = notification.type === "WEEKLY_UNRESOLVED_REVISION";

  // Visual styling based on notification category
  let badgeText = "Study Reminder";
  let badgeClasses = "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  let iconContainer = "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20";
  let borderClasses = "border-blue-500/40 bg-card/95";

  if (isWeeklyRevision) {
    badgeText = "Weekly Revision Alert";
    badgeClasses = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    iconContainer = "bg-linear-to-br from-amber-500 to-rose-600 text-white shadow-amber-500/25";
    borderClasses = "border-amber-500/45 bg-linear-to-br from-amber-500/10 via-card/95 to-card/95";
  } else if (isStreak) {
    badgeText = "Streak Guardian";
    badgeClasses = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    iconContainer = "bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25";
    borderClasses = "border-amber-500/40 bg-linear-to-br from-amber-500/10 via-card/95 to-card/95";
  } else if (isMild) {
    badgeText = "Daily Target Progress";
    badgeClasses = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    iconContainer = "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20";
    borderClasses = "border-emerald-500/35 bg-card/95";
  } else if (isLeaderboard) {
    badgeText = "Podium Alert";
    badgeClasses = "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    iconContainer = "bg-linear-to-br from-rose-500 to-amber-600 text-white shadow-rose-500/25";
    borderClasses = "border-rose-500/45 bg-linear-to-br from-rose-500/10 via-card/95 to-card/95";
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:top-5 z-50 max-w-lg w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md border ${borderClasses} transition-all`}
      >
        <div className="flex items-start gap-3.5">
          {/* Leading Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${iconContainer}`}
          >
            {isWeeklyRevision && <RefreshCwIcon className="w-5 h-5 text-white" />}
            {isStreak && <FlameIcon className="w-5 h-5 text-white" />}
            {isMild && <TargetIcon className="w-5 h-5 text-white" />}
            {isLeaderboard && <TrophyIcon className="w-5 h-5 text-white" />}
          </div>

          {/* Content Body */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeClasses}`}
              >
                {badgeText}
              </span>
              {isStreak && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <SparklesIcon className="w-3 h-3" />
                  <span>Streak at Risk</span>
                </span>
              )}
            </div>

            <h4 className="text-sm font-black text-foreground tracking-tight leading-snug">
              {notification.title}
            </h4>

            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {notification.message}
            </p>

            {/* Action Bar */}
            <div className="mt-3 flex items-center gap-2.5">
              <Link
                href={notification.actionUrl}
                onClick={onDismiss}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{notification.actionText}</span>
                <ArrowRightIcon className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={onDismiss}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

