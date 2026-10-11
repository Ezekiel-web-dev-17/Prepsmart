"use client";

import { useState } from "react";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { useGamification } from "@/components/gamification/XPToast";
import { awardUserXPAction } from "@/actions/gamification";

interface LeaderboardViewProps {
  initialEntries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardView({
  initialEntries,
  currentUserId = "demo-user-1",
}: LeaderboardViewProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [isSimulating, setIsSimulating] = useState(false);

  const { triggerXPToast } = useGamification();

  const tiers = ["All", "Emerald", "Diamond", "Gold", "Silver", "Bronze"];

  const filteredEntries = entries.filter((e) => {
    if (selectedTier === "All") return true;
    return e.tier === selectedTier;
  });

  const topThree = entries.slice(0, 3);

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
        return updated.sort((a, b) => b.xp - a.xp).map((item, idx) => ({
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
    switch (tier) {
      case "Emerald":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Diamond":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Gold":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Silver":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
      default:
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Real-Time Redis Ranking
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            PrepSmart Global Leaderboard
          </h1>

          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            Real-time rankings powered by Redis Sorted Sets and PostgreSQL. Earn XP
            by completing syllabus topics, practicing past questions, and maintaining
            your daily study streaks!
          </p>

          {/* Simulator Bar */}
          <div className="pt-2">
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Interactive Gamification Tester
                </span>
                <span className="text-[11px] text-blue-200">
                  Trigger an XP award to test dual updates and animated toast
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateAward("TOPIC_COMPLETED")}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  +50 XP (Topic)
                </button>
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSimulateAward("QUESTION_ANSWERED")}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  +5 XP (Question)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Podium Top 3 Champions */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
          {/* #2 Runner Up */}
          <div className="order-2 md:order-1 rounded-2xl bg-card border border-border/80 p-5 text-center relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center mx-auto mb-2">
              #2
            </div>
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-400 to-slate-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-md">
              {topThree[1].name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-base text-foreground truncate">
              {topThree[1].name}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                topThree[1].tier
              )}`}
            >
              {topThree[1].tier}
            </span>
            <div className="text-xl font-black text-foreground tabular-nums mt-2">
              {topThree[1].xp.toLocaleString()}{" "}
              <span className="text-xs text-muted-foreground font-semibold">XP</span>
            </div>
          </div>

          {/* #1 Champion */}
          <div className="order-1 md:order-2 rounded-3xl bg-card border-2 border-amber-500/50 p-6 text-center relative overflow-hidden shadow-lg shadow-amber-500/10 md:-translate-y-2">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500" />
            <div className="text-2xl mb-1">👑</div>
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-yellow-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-amber-500/30 ring-4 ring-amber-400/20">
              {topThree[0].name.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-0.5">
              Rank #1 Champion
            </span>
            <h3 className="font-black text-lg text-foreground truncate">
              {topThree[0].name}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                topThree[0].tier
              )}`}
            >
              {topThree[0].tier} Tier
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums mt-2">
              {topThree[0].xp.toLocaleString()}{" "}
              <span className="text-xs text-muted-foreground font-semibold">XP</span>
            </div>
          </div>

          {/* #3 Bronze Contender */}
          <div className="order-3 rounded-2xl bg-card border border-border/80 p-5 text-center relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-sm flex items-center justify-center mx-auto mb-2">
              #3
            </div>
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-600 to-amber-800 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-md">
              {topThree[2].name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="font-extrabold text-base text-foreground truncate">
              {topThree[2].name}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${getTierBadge(
                topThree[2].tier
              )}`}
            >
              {topThree[2].tier}
            </span>
            <div className="text-xl font-black text-foreground tabular-nums mt-2">
              {topThree[2].xp.toLocaleString()}{" "}
              <span className="text-xs text-muted-foreground font-semibold">XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Strip & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
        {/* Tier filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === tier
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === "list"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cards View
            </button>
          </div>
        </div>
      </div>

      {/* Main Leaderboard List */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No candidates in the {selectedTier} tier yet.
        </div>
      ) : viewMode === "list" ? (
        <div className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-border/60">
            {filteredEntries.map((entry) => (
              <div
                key={entry.userId}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                {/* Left: Rank + Avatar + Name */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      entry.rank === 1
                        ? "bg-amber-500 text-white shadow-xs"
                        : entry.rank === 2
                        ? "bg-slate-300 dark:bg-slate-700 text-foreground"
                        : entry.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {entry.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <span className="font-bold text-sm text-foreground block truncate">
                      {entry.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getTierBadge(
                        entry.tier
                      )}`}
                    >
                      {entry.tier}
                    </span>
                  </div>
                </div>

                {/* Right: XP Score */}
                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-black text-foreground tabular-nums">
                    {entry.xp.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground ml-1">
                    XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.userId}
              className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-muted-foreground">
                  Rank #{entry.rank}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getTierBadge(
                    entry.tier
                  )}`}
                >
                  {entry.tier}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {entry.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-foreground truncate">
                    {entry.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">Active Candidate</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Accumulated</span>
                <span className="font-black text-foreground">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
