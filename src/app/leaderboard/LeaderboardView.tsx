"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { useGamification } from "@/components/gamification/XPToast";
import { awardUserXPAction } from "@/actions/gamification";

interface LeaderboardViewProps {
  initialEntries: LeaderboardEntry[];
  currentUserId?: string;
}

// Duolingo League Hierarchy
const LEAGUES = [
  { name: "Bronze", minXp: 0, next: "Silver", prev: null, icon: "🥉", color: "from-amber-700 to-orange-800", badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30" },
  { name: "Silver", minXp: 150, next: "Gold", prev: "Bronze", icon: "🥈", color: "from-slate-400 to-slate-600", badge: "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30" },
  { name: "Gold", minXp: 350, next: "Diamond", prev: "Silver", icon: "🥇", color: "from-amber-400 to-yellow-600", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  { name: "Diamond", minXp: 600, next: "Emerald", prev: "Gold", icon: "💎", color: "from-cyan-400 to-blue-600", badge: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" },
  { name: "Emerald", minXp: 1000, next: "Obsidian", prev: "Diamond", icon: "👑", color: "from-emerald-400 to-teal-700", badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
];

export default function LeaderboardView({
  initialEntries,
  currentUserId = "demo-user-1",
}: LeaderboardViewProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [selectedLeague, setSelectedLeague] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  // Weekly league timer state (countdown to Sunday midnight)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 40 });

  const { triggerXPToast } = useGamification();

  // Ticking countdown timer to Sunday 23:59:59
  useEffect(() => {
    const calculateTimeUntilSunday = () => {
      const now = new Date();
      const nextSunday = new Date();
      const daysUntilSunday = (7 - now.getDay()) % 7;
      nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      nextSunday.setHours(23, 59, 59, 999);

      const diff = Math.max(0, nextSunday.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeUntilSunday());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeUntilSunday());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter entries based on League/Tier and Search Query
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesLeague = selectedLeague === "All" || entry.tier === selectedLeague;
      const matchesSearch =
        searchQuery.trim() === "" ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesLeague && matchesSearch;
    });
  }, [entries, selectedLeague, searchQuery]);

  // Separate Top 3 for Card Layout and Remaining Users for Table View
  const topThree = useMemo(() => filteredEntries.slice(0, 3), [filteredEntries]);
  const otherUsers = useMemo(() => filteredEntries.slice(3), [filteredEntries]);

  // Demotion Zone calculation:
  // "the demotion zone users are the users starting from the 5th to the last to the least weekly point user"
  // For total N entries, the bottom 5 users are in the demotion zone.
  const totalCount = filteredEntries.length;
  const demotionThresholdRank = Math.max(4, totalCount - 4); // Ranks >= this are in demotion zone

  // Promotion Zone: Top 5 candidates promote (with Top 3 getting the prizes)
  const promotionThresholdRank = Math.min(5, Math.max(1, totalCount - 5));

  // Find current user's entry and status
  const currentUserEntry = entries.find((e) => e.userId === currentUserId);
  const currentUserRank = currentUserEntry?.rank ?? null;

  // Determine user's zone
  const currentUserZone = useMemo(() => {
    if (!currentUserRank) return "none";
    if (currentUserRank <= 3) return "podium";
    if (currentUserRank <= promotionThresholdRank) return "promotion";
    if (currentUserRank >= demotionThresholdRank && totalCount > 5) return "demotion";
    return "safe";
  }, [currentUserRank, promotionThresholdRank, demotionThresholdRank, totalCount]);

  // Quick Action simulator to demonstrate XPToast and real-time dual updates
  const handleSimulateAward = async (
    eventType: "TOPIC_COMPLETED" | "QUESTION_ANSWERED"
  ) => {
    setIsSimulating(true);
    try {
      const result = await awardUserXPAction(currentUserId, eventType);
      triggerXPToast({
        points: result.pointsAwarded,
        eventType: result.eventType,
        newTotalXp: result.newTotalXp,
      });

      // Update local state rank/score
      setEntries((prev) => {
        const existingIdx = prev.findIndex((e) => e.userId === currentUserId);
        let updated: LeaderboardEntry[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            xp: result.newTotalXp,
          };
        } else {
          updated = [
            ...prev,
            {
              rank: result.rank ?? prev.length + 1,
              userId: currentUserId,
              name: "You (Active Candidate)",
              image: null,
              xp: result.newTotalXp,
              tier: "Bronze",
            },
          ];
        }
        return updated
          .sort((a, b) => b.xp - a.xp)
          .map((item, idx) => ({
            ...item,
            rank: idx + 1,
          }));
      });
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const getTierBadge = (tier: LeaderboardEntry["tier"]) => {
    const league = LEAGUES.find((l) => l.name === tier);
    return league ? league.badge : "bg-muted text-muted-foreground border-border";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Safe zone XP cutoff point (XP of the first safe user above demotion zone)
  const safeZoneCutoffEntry = filteredEntries[demotionThresholdRank - 2];
  const safeZoneCutoffXp = safeZoneCutoffEntry?.xp ?? 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Duolingo League Hero Banner with Countdown Timer */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 border border-indigo-800/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Duolingo Weekly League
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-blue-200 font-bold">
                Week #42 Cohort
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Weekly League & Promotion Arena
            </h1>

            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
              Top 3 winners claim weekly prizes and promote to the higher league. Keep your study streak alive
              to remain above the <strong>Demotion Zone</strong> (bottom 5 candidates drop down every Sunday)!
            </p>

            {/* Quick Action Simulator */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-blue-200 font-semibold mr-1">Earn Study XP:</span>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulateAward("TOPIC_COMPLETED")}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                +50 XP (Topic)
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={() => handleSimulateAward("QUESTION_ANSWERED")}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                +5 XP (Question)
              </button>
              <button
                type="button"
                onClick={() => setShowResolutionModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                🔮 Simulate Sunday Reset
              </button>
            </div>
          </div>

          {/* Weekly Countdown Box */}
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center shrink-0 min-w-[260px] shadow-lg">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-black block mb-2">
              ⏳ League Closes In
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-black/30 rounded-xl p-2 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-blue-200 uppercase font-bold">Days</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] text-blue-200 uppercase font-bold">Hours</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white tabular-nums block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] text-blue-200 uppercase font-bold">Mins</span>
              </div>
              <div className="bg-black/30 rounded-xl p-2 border border-white/10">
                <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] text-blue-200 uppercase font-bold">Secs</span>
              </div>
            </div>
            <span className="text-[10px] text-blue-200/80 block mt-2">
              Sunday 23:59 UTC • Upgrades & Demotions applied
            </span>
          </div>
        </div>
      </section>

      {/* User Current Standing & Zone Status Banner */}
      {currentUserEntry && (
        <section
          className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            currentUserZone === "podium"
              ? "bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-100"
              : currentUserZone === "promotion"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
              : currentUserZone === "demotion"
              ? "bg-rose-500/10 border-rose-500/40 text-rose-950 dark:text-rose-100 animate-pulse"
              : "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-100"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {currentUserZone === "podium" && "🏆"}
                {currentUserZone === "promotion" && "🚀"}
                {currentUserZone === "safe" && "🛡️"}
                {currentUserZone === "demotion" && "⚠️"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base">
                    You are Rank #{currentUserRank} in {currentUserEntry.tier} League
                  </h3>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      currentUserZone === "podium"
                        ? "bg-amber-500 text-white"
                        : currentUserZone === "promotion"
                        ? "bg-emerald-600 text-white"
                        : currentUserZone === "demotion"
                        ? "bg-rose-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {currentUserZone === "podium" && "Podium Winner"}
                    {currentUserZone === "promotion" && "Promotion Zone"}
                    {currentUserZone === "safe" && "Safe Zone"}
                    {currentUserZone === "demotion" && "Demotion Zone"}
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">
                  {currentUserZone === "podium" && (
                    <>
                      You are in line for the <strong>Weekly Prize Pool</strong> and automatic promotion to{" "}
                      <strong>{LEAGUES.find((l) => l.name === currentUserEntry.tier)?.next || "Master"} League</strong>!
                    </>
                  )}
                  {currentUserZone === "promotion" && (
                    <>
                      On track to advance to{" "}
                      <strong>{LEAGUES.find((l) => l.name === currentUserEntry.tier)?.next || "Master"} League</strong> this Sunday!
                    </>
                  )}
                  {currentUserZone === "safe" && (
                    <>
                      You are safe from relegation (+{(currentUserEntry.xp - safeZoneCutoffXp).toLocaleString()} XP above demotion cutoff).
                    </>
                  )}
                  {currentUserZone === "demotion" && (
                    <>
                      <strong>Demotion Warning:</strong> You are currently in the bottom 5. Earn at least{" "}
                      <span className="font-bold underline">
                        {Math.max(1, safeZoneCutoffXp - currentUserEntry.xp + 1)} XP
                      </span>{" "}
                      to climb into the Safe Zone before Sunday!
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-black tabular-nums">
                {currentUserEntry.xp.toLocaleString()}
              </span>
              <span className="text-xs font-semibold ml-1 opacity-80">XP</span>
            </div>
          </div>
        </section>
      )}

      {/* Weekly Prize Pool Cards (Top 3 League Winners) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <span>🏆 Top 3 League Champions & Weekly Prizes</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Concluding the week on the podium awards prizes and an instant promotion to the next league!
            </p>
          </div>
        </div>

        {/* Top 3 Cards Layout */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
            {/* #2 Runner-Up (Silver) */}
            {topThree[1] && (
              <div className="order-2 md:order-1 rounded-3xl bg-card border-2 border-slate-300 dark:border-slate-700 p-5 sm:p-6 text-center relative overflow-hidden shadow-md hover:shadow-xl transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-slate-300 via-slate-400 to-slate-500" />
                
                {/* Prize Badge */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black shadow-xs">
                    🥈 2nd Place Prize
                  </span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-400 via-slate-500 to-slate-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-slate-300/40 group-hover:scale-105 transition-transform">
                  {getInitials(topThree[1].name)}
                </div>

                <h3 className="font-extrabold text-base text-foreground truncate">
                  {topThree[1].name}
                  {topThree[1].userId === currentUserId && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                      You
                    </span>
                  )}
                </h3>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                    topThree[1].tier
                  )}`}
                >
                  {topThree[1].tier} League
                </span>

                <div className="text-xl sm:text-2xl font-black text-foreground tabular-nums mt-2">
                  {topThree[1].xp.toLocaleString()}{" "}
                  <span className="text-xs text-muted-foreground font-semibold">XP</span>
                </div>

                {/* Prize Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-xs text-center space-y-0.5">
                  <span className="font-black text-slate-700 dark:text-slate-300 block">
                    🎁 150 Gems 💎 + Diagnostic Pass
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    🚀 Upgrades to Next League
                  </span>
                </div>
              </div>
            )}

            {/* #1 Champion (Gold) - Elevated Card */}
            {topThree[0] && (
              <div className="order-1 md:order-2 rounded-3xl bg-card border-2 border-amber-500/80 p-6 sm:p-7 text-center relative overflow-hidden shadow-xl shadow-amber-500/15 md:-translate-y-3 group hover:-translate-y-4 transition-all">
                <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />
                
                <div className="text-3xl mb-1 filter drop-shadow">👑</div>

                {/* Prize Badge */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 text-xs font-black shadow-xs">
                    🥇 1st Place Grand Prize
                  </span>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-amber-400 via-amber-500 to-yellow-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-500/40 ring-4 ring-amber-400/30 group-hover:scale-105 transition-transform">
                  {getInitials(topThree[0].name)}
                </div>

                <h3 className="font-black text-lg text-foreground truncate">
                  {topThree[0].name}
                  {topThree[0].userId === currentUserId && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold">
                      You
                    </span>
                  )}
                </h3>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                    topThree[0].tier
                  )}`}
                >
                  {topThree[0].tier} League
                </span>

                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums mt-2">
                  {topThree[0].xp.toLocaleString()}{" "}
                  <span className="text-xs text-muted-foreground font-semibold">XP</span>
                </div>

                {/* Champion Prize Box */}
                <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-center space-y-0.5">
                  <span className="font-black text-amber-700 dark:text-amber-300 block">
                    🎁 250 Gems 💎 + 1x Streak Freeze 🛡️
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                    🚀 Upgrades to Next League + Champion Trophy
                  </span>
                </div>
              </div>
            )}

            {/* #3 Third Place (Bronze) */}
            {topThree[2] && (
              <div className="order-3 rounded-3xl bg-card border-2 border-amber-700/40 dark:border-amber-700/60 p-5 sm:p-6 text-center relative overflow-hidden shadow-md hover:shadow-xl transition-all group">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-700 to-amber-800" />
                
                {/* Prize Badge */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-600/30 text-amber-800 dark:text-amber-300 text-xs font-black shadow-xs">
                    🥉 3rd Place Prize
                  </span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-md ring-4 ring-amber-600/30 group-hover:scale-105 transition-transform">
                  {getInitials(topThree[2].name)}
                </div>

                <h3 className="font-extrabold text-base text-foreground truncate">
                  {topThree[2].name}
                  {topThree[2].userId === currentUserId && (
                    <span className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold">
                      You
                    </span>
                  )}
                </h3>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                    topThree[2].tier
                  )}`}
                >
                  {topThree[2].tier} League
                </span>

                <div className="text-xl sm:text-2xl font-black text-foreground tabular-nums mt-2">
                  {topThree[2].xp.toLocaleString()}{" "}
                  <span className="text-xs text-muted-foreground font-semibold">XP</span>
                </div>

                {/* Prize Box */}
                <div className="mt-3 p-2.5 rounded-xl bg-amber-700/10 border border-amber-700/20 text-xs text-center space-y-0.5">
                  <span className="font-black text-amber-800 dark:text-amber-300 block">
                    🎁 75 Gems 💎 + Bronze Crest
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    🚀 Upgrades to Next League
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* League & Search Filter Strip */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          {/* League selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground mr-1 hidden sm:inline">
              League:
            </span>
            <button
              type="button"
              onClick={() => setSelectedLeague("All")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLeague === "All"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-muted text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              All Leagues
            </button>
            {LEAGUES.map((league) => (
              <button
                key={league.name}
                type="button"
                onClick={() => setSelectedLeague(league.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedLeague === league.name
                    ? "bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-500/30"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                <span>{league.icon}</span>
                <span>{league.name}</span>
              </button>
            ))}
          </div>

          {/* Search candidate input */}
          <div className="relative min-w-[220px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate in league..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-border/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Table View for Other Users with Duolingo Promotion, Safe, and Demotion Zones */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>📊 League Standings (Table View)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Ranks #4+
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Ranks #4 and beyond. Top ranks advance to the next league, middle ranks remain safe, while bottom 5 face demotion!
            </p>
          </div>

          {/* Legend Pills */}
          <div className="flex items-center gap-2 text-[11px] font-semibold flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Promotion (Top 5)
            </span>
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Safe Zone
            </span>
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Demotion (Bottom 5)
            </span>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-2 bg-card/50">
            <div className="text-3xl">🔍</div>
            <h4 className="font-bold text-foreground text-sm">No Candidates Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No students match the selected filter. Try selecting another league or clearing search.
            </p>
          </div>
        ) : otherUsers.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border/80 p-8 text-center space-y-3 shadow-xs">
            <div className="text-3xl">✨</div>
            <h4 className="font-bold text-foreground text-sm">All Candidates on the Podium</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              All students in this category are currently in the Top 3 cards above!
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-muted-foreground font-extrabold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6 w-16 text-center">Rank</th>
                    <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                    <th className="py-3.5 px-4 sm:px-6">League</th>
                    <th className="py-3.5 px-4 sm:px-6">Weekly Zone</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Weekly XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {otherUsers.map((entry, index) => {
                    const isCurrentUser = entry.userId === currentUserId;
                    const isPromotionZone = entry.rank <= promotionThresholdRank;
                    const isDemotionZone = entry.rank >= demotionThresholdRank && totalCount > 5;
                    const isSafeZone = !isPromotionZone && !isDemotionZone;

                    // Show divider line before the first demotion row
                    const isFirstDemotionRow = entry.rank === demotionThresholdRank;

                    return (
                      <tr
                        key={entry.userId}
                        className={`transition-colors ${
                          isFirstDemotionRow ? "border-t-2 border-t-rose-500/80" : ""
                        } ${
                          isCurrentUser
                            ? "bg-blue-500/15 dark:bg-blue-500/20 border-l-4 border-l-blue-600 font-medium"
                            : isDemotionZone
                            ? "bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/10"
                            : isPromotionZone
                            ? "bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="py-3.5 px-4 sm:px-6 text-center font-black">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                              isPromotionZone
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : isDemotionZone
                                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            #{entry.rank}
                          </span>
                        </td>

                        {/* Candidate Column */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {getInitials(entry.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-xs sm:text-sm truncate">
                                  {entry.name}
                                </span>
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-extrabold uppercase shrink-0">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground block truncate">
                                UTME Candidate
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* League Column */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block ${getTierBadge(
                              entry.tier
                            )}`}
                          >
                            {entry.tier}
                          </span>
                        </td>

                        {/* Weekly Zone Status Badge */}
                        <td className="py-3.5 px-4 sm:px-6">
                          {isPromotionZone ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                              <span>🚀 Promotion Zone</span>
                            </span>
                          ) : isDemotionZone ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full animate-pulse">
                              <span>🔻 Demotion Zone</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                              <span>🛡️ Safe in League</span>
                            </span>
                          )}
                        </td>

                        {/* Weekly XP Column */}
                        <td className="py-3.5 px-4 sm:px-6 text-right font-black tabular-nums text-foreground text-sm sm:text-base">
                          {entry.xp.toLocaleString()}{" "}
                          <span className="text-[11px] text-muted-foreground font-semibold">
                            XP
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Demotion Zone Warning Footer */}
            <div className="px-4 sm:px-6 py-3.5 bg-rose-500/10 border-t border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-rose-900 dark:text-rose-200 font-semibold gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">⚠️</span>
                <span>
                  <strong>Demotion Rule:</strong> The bottom 5 candidates (starting from rank #{demotionThresholdRank} to #{totalCount}) drop down one league every Sunday.
                </span>
              </div>
              <span className="text-[11px] opacity-80 shrink-0">
                Resets every Sunday at 23:59 UTC
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Duolingo League Progression Rules & FAQ */}
      <section className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <span>⚡ How the PrepSmart Weekly Leagues Work</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-emerald-600 dark:text-emerald-400">
              <span className="text-base">🚀</span>
              <span>1. Promotion Zone & Top 3 Prizes</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Earn XP throughout the week. The top 5 candidates advance to the next league tier. The top 3 podium winners earn <strong>PrepGems (250, 150, 75)</strong>, streak shields, and medals!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-blue-600 dark:text-blue-400">
              <span className="text-base">🛡️</span>
              <span>2. Safe Zone</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Maintain daily study sessions to finish above the bottom 5. Safe candidates remain in their league to battle for the championship next week.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-rose-600 dark:text-rose-400">
              <span className="text-base">🔻</span>
              <span>3. Demotion Zone</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The 5 candidates with the least weekly points (5th-from-the-bottom to last) get demoted to the lower tier when the timer reaches zero on Sunday midnight.
            </p>
          </div>
        </div>
      </section>

      {/* Sunday Reset Simulation Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                <div>
                  <h3 className="font-black text-base text-foreground">Sunday League Resolution Preview</h3>
                  <span className="text-[11px] text-muted-foreground">What happens when the weekly timer ends</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResolutionModal(false)}
                className="w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Top 3 Winners */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <span className="font-black text-amber-700 dark:text-amber-300 block">
                  🏆 Weekly Prize Pool Awardees
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>🥇 {topThree[0]?.name || "1st Place"}</span>
                    <span className="text-amber-600 dark:text-amber-400">+250 Gems 💎 & 1x Streak Freeze</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>🥈 {topThree[1]?.name || "2nd Place"}</span>
                    <span className="text-slate-600 dark:text-slate-300">+150 Gems 💎 & Diagnostic Pass</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>🥉 {topThree[2]?.name || "3rd Place"}</span>
                    <span className="text-amber-700 dark:text-amber-300">+75 Gems 💎 & Bronze Crest</span>
                  </div>
                </div>
              </div>

              {/* Promoted */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                <span className="font-black text-emerald-600 dark:text-emerald-400 block">
                  🚀 Upgrading to Higher League (Ranks 1 – 5)
                </span>
                <p className="text-muted-foreground">
                  {filteredEntries.slice(0, promotionThresholdRank).map((e) => e.name).join(", ")}
                </p>
              </div>

              {/* Safe */}
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1.5">
                <span className="font-black text-blue-600 dark:text-blue-400 block">
                  🛡️ Remaining in Current League
                </span>
                <p className="text-muted-foreground">
                  {filteredEntries.slice(promotionThresholdRank, demotionThresholdRank - 1).map((e) => e.name).join(", ") || "No candidates in this tier"}
                </p>
              </div>

              {/* Demoted */}
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                <span className="font-black text-rose-600 dark:text-rose-400 block">
                  🔻 Degrading to Lower League (Bottom 5: Ranks #{demotionThresholdRank} – #{totalCount})
                </span>
                <p className="text-muted-foreground">
                  {filteredEntries.slice(demotionThresholdRank - 1).map((e) => e.name).join(", ")}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowResolutionModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Got It! Keep Studying
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
