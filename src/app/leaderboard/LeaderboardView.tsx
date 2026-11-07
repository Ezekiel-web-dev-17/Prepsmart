"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { LeaderboardEntry, LeagueTier } from "@/lib/leaderboard";
import {
  TrophyIcon,
  CrownIcon,
  AwardIcon,
  SparklesIcon,
  FlameIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ShieldIcon,
  ZapIcon,
  SearchIcon,
  XIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BeakerIcon,
  BriefcaseIcon,
  PaletteIcon,
} from "@/components/ui/icons";

interface LeaderboardViewProps {
  initialEntries: LeaderboardEntry[];
  currentUserId?: string;
}

export interface LeagueConfig {
  id: LeagueTier;
  name: string;
  minXp: number;
  color: string;
  badge: string;
  iconBg: string;
  textColor: string;
  gem: string;
  rewardText: string;
}

export const UTME_LEAGUES: LeagueConfig[] = [
  {
    id: "Diamond",
    name: "Diamond League",
    minXp: 2800,
    color: "from-cyan-400 via-sky-500 to-blue-600",
    badge: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/40",
    iconBg: "bg-cyan-500 text-white shadow-cyan-500/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
    gem: "💎",
    rewardText: "Top Tier League • Champions of Nigeria",
  },
  {
    id: "Obsidian",
    name: "Obsidian League",
    minXp: 2250,
    color: "from-indigo-600 via-purple-700 to-slate-900",
    badge: "bg-indigo-900/20 text-indigo-400 border-indigo-700/40",
    iconBg: "bg-indigo-700 text-white shadow-indigo-600/30",
    textColor: "text-indigo-400",
    gem: "⚫",
    rewardText: "Top 7 promote to Diamond League",
  },
  {
    id: "Pearl",
    name: "Pearl League",
    minXp: 1750,
    color: "from-pink-400 via-rose-400 to-purple-500",
    badge: "bg-pink-500/15 text-pink-600 dark:text-pink-300 border-pink-400/40",
    iconBg: "bg-pink-500 text-white shadow-pink-500/30",
    textColor: "text-pink-600 dark:text-pink-400",
    gem: "⚪",
    rewardText: "Top 7 promote to Obsidian League",
  },
  {
    id: "Amethyst",
    name: "Amethyst League",
    minXp: 1350,
    color: "from-purple-500 via-fuchsia-600 to-indigo-700",
    badge: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-400/40",
    iconBg: "bg-purple-600 text-white shadow-purple-600/30",
    textColor: "text-purple-600 dark:text-purple-400",
    gem: "🟣",
    rewardText: "Top 7 promote to Pearl League",
  },
  {
    id: "Emerald",
    name: "Emerald League",
    minXp: 1000,
    color: "from-emerald-400 via-teal-500 to-green-600",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/40",
    iconBg: "bg-emerald-600 text-white shadow-emerald-500/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    gem: "🟢",
    rewardText: "Top 7 promote to Amethyst League",
  },
  {
    id: "Ruby",
    name: "Ruby League",
    minXp: 750,
    color: "from-rose-500 via-red-600 to-amber-600",
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/40",
    iconBg: "bg-rose-600 text-white shadow-rose-500/30",
    textColor: "text-rose-600 dark:text-rose-400",
    gem: "🔻",
    rewardText: "Top 7 promote to Emerald League",
  },
  {
    id: "Sapphire",
    name: "Sapphire League",
    minXp: 500,
    color: "from-blue-500 via-indigo-500 to-sky-600",
    badge: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/40",
    iconBg: "bg-blue-600 text-white shadow-blue-500/30",
    textColor: "text-blue-600 dark:text-blue-400",
    gem: "🔷",
    rewardText: "Top 7 promote to Ruby League",
  },
  {
    id: "Gold",
    name: "Gold League",
    minXp: 300,
    color: "from-amber-400 via-yellow-500 to-amber-600",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40",
    iconBg: "bg-amber-500 text-white shadow-amber-500/30",
    textColor: "text-amber-600 dark:text-amber-400",
    gem: "🥇",
    rewardText: "Top 7 promote to Sapphire League",
  },
  {
    id: "Silver",
    name: "Silver League",
    minXp: 150,
    color: "from-slate-400 via-gray-400 to-zinc-500",
    badge: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/40",
    iconBg: "bg-slate-500 text-white shadow-slate-500/30",
    textColor: "text-slate-600 dark:text-slate-400",
    gem: "🥈",
    rewardText: "Top 7 promote to Gold League",
  },
  {
    id: "Bronze",
    name: "Bronze League",
    minXp: 0,
    color: "from-amber-700 via-orange-700 to-yellow-800",
    badge: "bg-amber-800/15 text-amber-800 dark:text-amber-300 border-amber-700/40",
    iconBg: "bg-amber-700 text-white shadow-amber-700/30",
    textColor: "text-amber-700 dark:text-amber-400",
    gem: "🥉",
    rewardText: "Top 7 promote to Silver League",
  },
];

const AVATAR_BG_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-pink-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-sky-600",
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash + userId.charCodeAt(i)) % AVATAR_BG_GRADIENTS.length;
  }
  return AVATAR_BG_GRADIENTS[hash];
}

export default function LeaderboardView({
  initialEntries,
  currentUserId = "demo-user-1",
}: LeaderboardViewProps) {
  const [entries] = useState<LeaderboardEntry[]>(initialEntries);
  const [selectedLeague, setSelectedLeague] = useState<string>("All");
  const [selectedStream, setSelectedStream] = useState<"all" | "science" | "commercial" | "arts">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Weekly tournament countdown to Sunday midnight WAT
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const calculateSundayCountdown = () => {
      const now = new Date();
      const nextSunday = new Date();
      const dayOfWeek = now.getDay(); // 0 is Sunday
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      nextSunday.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      nextSunday.setHours(23, 59, 59, 999);

      const diff = Math.max(0, nextSunday.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateSundayCountdown());
    const timer = setInterval(() => {
      setTimeLeft(calculateSundayCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter entries based on search, stream, and league
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesLeague =
        selectedLeague === "All" || entry.tier === selectedLeague;
      const matchesStream =
        selectedStream === "all" || entry.stream === selectedStream;
      const matchesSearch =
        searchQuery.trim() === "" ||
        entry.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesLeague && matchesStream && matchesSearch;
    });
  }, [entries, selectedLeague, selectedStream, searchQuery]);

  // Identify current candidate standing
  const currentCandidate = useMemo(() => {
    return entries.find((e) => e.userId === currentUserId || e.isCurrentUser);
  }, [entries, currentUserId]);

  const currentCandidateRankInFiltered = useMemo(() => {
    if (!currentCandidate) return null;
    const idx = filteredEntries.findIndex((e) => e.userId === currentCandidate.userId);
    return idx !== -1 ? idx + 1 : null;
  }, [filteredEntries, currentCandidate]);

  // Zone Bracket definitions for standard 30-candidate league:
  // Top 7: Promotion Zone
  // Bottom 5 (ranks >= 24 in a 28+ list): Demotion Zone
  const PROMOTION_CUTOFF = 7;
  const DEMOTION_START = Math.max(8, filteredEntries.length - 4);

  const top3 = useMemo(() => filteredEntries.slice(0, 3), [filteredEntries]);
  const rank1 = top3[0];
  const rank2 = top3[1];
  const rank3 = top3[2];

  // Active league metadata
  const currentLeagueConfig = useMemo(() => {
    if (selectedLeague === "All") {
      return (
        UTME_LEAGUES.find((l) => l.id === (currentCandidate?.tier || "Diamond")) ||
        UTME_LEAGUES[0]
      );
    }
    return UTME_LEAGUES.find((l) => l.id === selectedLeague) || UTME_LEAGUES[0];
  }, [selectedLeague, currentCandidate?.tier]);

  return (
    <div className="space-y-8 pb-24">
      {/* ── 1. TOURNAMENT HEADER ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-card via-card/90 to-blue-900/10 border border-border p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 flex items-center gap-1.5">
                <TrophyIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>UTME Weekly League Cohort</span>
              </span>

              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${currentLeagueConfig.badge} flex items-center gap-1.5`}>
                <span>{currentLeagueConfig.gem}</span>
                <span>{currentLeagueConfig.name}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Weekly UTME League Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Compete against 30 candidates in your weekly league bracket.
              Finish in the <strong className="text-emerald-500">Top 7</strong> to advance to the next league, or avoid the <strong className="text-rose-500">Bottom 5</strong> to escape demotion!
            </p>
          </div>

          {/* Weekly Countdown Clock */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-card/80 border border-border p-3.5 sm:p-4 shadow-2xs space-y-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tournament Ends</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                  Sunday 23:59
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-lg sm:text-xl font-black text-foreground">
                <span className="px-2 py-1 rounded-lg bg-muted text-foreground">
                  {timeLeft.days}d
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded-lg bg-muted text-foreground">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded-lg bg-muted text-foreground">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
                <span>:</span>
                <span className="px-2 py-1 rounded-lg bg-muted text-amber-500">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRulesModal(true)}
              className="text-xs font-bold px-3.5 py-3 rounded-2xl border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs self-stretch sm:self-auto justify-center"
            >
              <ShieldIcon className="w-4 h-4 text-purple-500" />
              <span>League Rules</span>
            </button>
          </div>
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── 2. 10-TIER LEAGUE SELECTOR PILLS ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Explore UTME Leagues (10 Tiers)
          </span>
          <span className="text-xs text-muted-foreground font-semibold">
            {selectedLeague === "All" ? "Viewing Entire Cohort" : `Viewing ${selectedLeague} Tier`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedLeague("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border ${
              selectedLeague === "All"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            🏆 All Leagues ({entries.length})
          </button>

          {UTME_LEAGUES.map((league) => {
            const isSelected = selectedLeague === league.id;
            const countInLeague = entries.filter((e) => e.tier === league.id).length;
            return (
              <button
                key={league.id}
                type="button"
                onClick={() => setSelectedLeague(league.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-xs"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                }`}
              >
                <span>{league.gem}</span>
                <span>{league.id}</span>
                <span className="text-[10px] opacity-75 font-bold">({countInLeague})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. TOP 3 3D PODIUM ── */}
      {top3.length >= 3 && selectedLeague === "All" && (
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-card to-card/60 border border-border p-6 sm:p-8 shadow-xs">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              Top 3 Podium Champions
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Weekly League Trophy Standings
            </h2>
            <p className="text-xs text-muted-foreground">
              Podium winners earn PrepGems and permanent profile badge honors at Sunday midnight reset.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto pt-6">
            {/* Rank 2 (Silver) - Left Pillar */}
            {rank2 && (
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr ${getAvatarColor(
                      rank2.userId
                    )} text-white flex items-center justify-center font-black text-sm sm:text-base shadow-md ring-2 ring-slate-400`}
                  >
                    {getInitials(rank2.name)}
                  </div>
                  <span className="absolute -bottom-2 -right-1 text-base sm:text-xl">🥈</span>
                </div>

                <div className="w-full space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-foreground truncate max-w-[100px] sm:max-w-[130px] mx-auto">
                    {rank2.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-500">
                    <FlameIcon className="w-3 h-3 text-amber-500" />
                    <span>{rank2.streakDays}d</span>
                  </div>
                </div>

                {/* Silver Pillar */}
                <div className="w-full rounded-2xl bg-linear-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-slate-700 dark:to-slate-800 p-3 sm:p-4 text-white shadow-md flex flex-col justify-between h-28 sm:h-36">
                  <div className="text-xl sm:text-2xl font-black">#2</div>
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-black tabular-nums">{rank2.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] font-black uppercase text-slate-100 bg-white/20 rounded-full px-2 py-0.5 inline-block">
                      +150 Gems
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) - Center Tall Pillar */}
            {rank1 && (
              <div className="flex flex-col items-center text-center space-y-2 -translate-y-2 sm:-translate-y-4">
                <CrownIcon className="w-6 h-6 text-amber-400 animate-bounce" />
                <div className="relative">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr ${getAvatarColor(
                      rank1.userId
                    )} text-white flex items-center justify-center font-black text-base sm:text-lg shadow-xl ring-4 ring-amber-400`}
                  >
                    {getInitials(rank1.name)}
                  </div>
                  <span className="absolute -bottom-2 -right-1 text-xl sm:text-2xl">🥇</span>
                </div>

                <div className="w-full space-y-0.5">
                  <h3 className="text-xs sm:text-base font-black text-foreground truncate max-w-[110px] sm:max-w-[150px] mx-auto">
                    {rank1.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500">
                    <FlameIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>{rank1.streakDays}d streak</span>
                  </div>
                </div>

                {/* Gold Pillar */}
                <div className="w-full rounded-2xl bg-linear-to-b from-amber-400 via-yellow-500 to-amber-600 p-3 sm:p-4 text-white shadow-xl flex flex-col justify-between h-36 sm:h-44">
                  <div className="text-2xl sm:text-3xl font-black">#1</div>
                  <div className="space-y-0.5">
                    <div className="text-sm sm:text-base font-black tabular-nums">{rank1.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] font-black uppercase text-amber-950 bg-white/40 rounded-full px-2 py-0.5 inline-block">
                      +250 Gems
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) - Right Pillar */}
            {rank3 && (
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr ${getAvatarColor(
                      rank3.userId
                    )} text-white flex items-center justify-center font-black text-sm sm:text-base shadow-md ring-2 ring-amber-700`}
                  >
                    {getInitials(rank3.name)}
                  </div>
                  <span className="absolute -bottom-2 -right-1 text-base sm:text-xl">🥉</span>
                </div>

                <div className="w-full space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-foreground truncate max-w-[100px] sm:max-w-[130px] mx-auto">
                    {rank3.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-500">
                    <FlameIcon className="w-3 h-3 text-amber-500" />
                    <span>{rank3.streakDays}d</span>
                  </div>
                </div>

                {/* Bronze Pillar */}
                <div className="w-full rounded-2xl bg-linear-to-b from-amber-700 via-orange-800 to-yellow-900 p-3 sm:p-4 text-white shadow-md flex flex-col justify-between h-24 sm:h-32">
                  <div className="text-xl sm:text-2xl font-black">#3</div>
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-black tabular-nums">{rank3.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] font-black uppercase text-white bg-white/20 rounded-full px-2 py-0.5 inline-block">
                      +75 Gems
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 4. SEARCH & STREAM FILTER TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Stream Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStream("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              selectedStream === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            }`}
          >
            All Streams
          </button>
          <button
            type="button"
            onClick={() => setSelectedStream("science")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
              selectedStream === "science"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            }`}
          >
            <BeakerIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Science</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStream("commercial")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
              selectedStream === "commercial"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            }`}
          >
            <BriefcaseIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Commercial</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedStream("arts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
              selectedStream === "arts"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-card hover:bg-muted text-muted-foreground border-border"
            }`}
          >
            <PaletteIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Arts &amp; Humanities</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── 5. DIVISION BRACKET LEADERBOARD TABLE ── */}
      <section className="rounded-3xl border border-border bg-card overflow-hidden shadow-xs">
        {/* Table Header Bar */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border text-[11px] font-black uppercase tracking-wider text-muted-foreground grid grid-cols-12 gap-2 items-center">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-7 sm:col-span-8">Candidate Profile</div>
          <div className="col-span-3 sm:col-span-3 text-right">Weekly XP</div>
        </div>

        {/* Rows with League Zones */}
        <div className="divide-y divide-border">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <TrophyIcon className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold text-foreground">No candidates match your filter</p>
              <p className="text-xs text-muted-foreground">Try clearing your search query or selecting All Leagues.</p>
            </div>
          ) : (
            filteredEntries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser =
                entry.userId === currentUserId ||
                entry.isCurrentUser ||
                (currentCandidate && entry.userId === currentCandidate.userId);

              const isPromotion = rank <= PROMOTION_CUTOFF;
              const isDemotion = rank >= DEMOTION_START;

              // Render zone separation headers
              const showPromotionHeader = rank === 1;
              const showSafeZoneHeader = rank === PROMOTION_CUTOFF + 1;
              const showDemotionHeader = rank === DEMOTION_START;

              return (
                <div key={entry.userId}>
                  {/* League Zone Banners */}
                  {showPromotionHeader && (
                    <div className="bg-emerald-500/10 border-y border-emerald-500/20 px-4 py-1.5 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <TrendingUpIcon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>PROMOTION ZONE — Top 7 advance to the next league</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">▲ Promoted</span>
                    </div>
                  )}

                  {showSafeZoneHeader && (
                    <div className="bg-muted/40 border-y border-border px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ShieldIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span>SAFE ZONE — Ranks {PROMOTION_CUTOFF + 1} to {DEMOTION_START - 1} remain in current league</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold">Stable</span>
                    </div>
                  )}

                  {showDemotionHeader && (
                    <div className="bg-rose-500/10 border-y border-rose-500/20 px-4 py-1.5 flex items-center justify-between text-xs font-black text-rose-600 dark:text-rose-400">
                      <span className="flex items-center gap-1.5">
                        <TrendingDownIcon className="w-3.5 h-3.5 text-rose-500" />
                        <span>DEMOTION ZONE — Bottom 5 drop to the lower league</span>
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">▼ Relegated</span>
                    </div>
                  )}

                  {/* Candidate Row */}
                  <div
                    className={`grid grid-cols-12 gap-2 items-center px-4 py-3 transition-colors ${
                      isCurrentUser
                        ? "bg-blue-500/10 dark:bg-blue-950/40 ring-2 ring-inset ring-blue-500 font-bold"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : isPromotion ? (
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center justify-center">
                          {rank}
                        </span>
                      ) : isDemotion ? (
                        <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center justify-center">
                          {rank}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground tabular-nums">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Candidate Info */}
                    <div className="col-span-7 sm:col-span-8 flex items-center gap-3">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr ${getAvatarColor(
                          entry.userId
                        )} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs`}
                      >
                        {getInitials(entry.name)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs sm:text-sm font-bold truncate text-foreground ${isCurrentUser ? "text-blue-600 dark:text-blue-400 font-black" : ""}`}>
                            {entry.name}
                          </span>

                          {isCurrentUser && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                              You
                            </span>
                          )}

                          <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                            {entry.stream}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <FlameIcon className="w-3 h-3 text-amber-500" />
                            <span>{entry.streakDays}d streak</span>
                          </span>
                          <span>•</span>
                          <span className="hidden sm:inline">Target: <strong>{entry.targetScore}</strong> pts</span>
                          <span className="sm:hidden font-medium capitalize">{entry.stream}</span>
                        </div>
                      </div>
                    </div>

                    {/* XP Score */}
                    <div className="col-span-3 sm:col-span-3 text-right">
                      <div className="text-xs sm:text-sm font-black text-foreground tabular-nums">
                        {entry.xp.toLocaleString()} <span className="text-[10px] text-muted-foreground font-bold">XP</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground flex items-center justify-end gap-1">
                        {isPromotion ? (
                          <span className="text-emerald-500 flex items-center gap-0.5 font-black">
                            <TrendingUpIcon className="w-3 h-3" />
                            <span>Advance</span>
                          </span>
                        ) : isDemotion ? (
                          <span className="text-rose-500 flex items-center gap-0.5 font-black">
                            <TrendingDownIcon className="w-3 h-3" />
                            <span>Danger</span>
                          </span>
                        ) : (
                          <span>Safe</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ── 6. FLOATING CURRENT USER BAR (STICKY DOCK) ── */}
      {currentCandidate && (
        <aside
          aria-label="Your tournament standing"
          className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-card/95 backdrop-blur-md border border-blue-500/40 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              #{currentCandidateRankInFiltered ?? currentCandidate.rank}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-foreground truncate">
                  Your Tournament Standing
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300">
                  {currentCandidate.tier}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                <strong>{currentCandidate.xp.toLocaleString()} XP</strong> • {currentCandidate.streakDays}d streak •{" "}
                {(currentCandidateRankInFiltered ?? currentCandidate.rank) <= PROMOTION_CUTOFF ? (
                  <span className="text-emerald-500 font-bold">You are in the Promotion Zone! ▲</span>
                ) : (
                  <span className="text-amber-500 font-bold">Earn XP to climb into Promotion Zone</span>
                )}
              </p>
            </div>
          </div>

          <Link
            href="/study?tab=mock-exam"
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
          >
            <ZapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Boost XP (+150 XP)</span>
            <span className="sm:hidden">Practice</span>
          </Link>
        </aside>
      )}

      {/* ── 7. LEAGUE RULES & FAQ MODAL ── */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-black text-foreground tracking-tight">
                  How UTME Leagues Work
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center cursor-pointer transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1">
                <h4 className="font-black text-foreground flex items-center gap-1.5 text-xs">
                  <span>📅</span>
                  <span>Weekly 30-Candidate Cohort</span>
                </h4>
                <p>
                  Every Monday 00:00 WAT, you are matched into a competitive 30-candidate group based on your current league. The tournament ends every Sunday at 23:59 WAT.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <h4 className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                  <span>▲</span>
                  <span>Promotion Zone (Top 7)</span>
                </h4>
                <p>
                  Finish in the Top 7 on Sunday night to get promoted to the next league! The Top 3 podium winners also receive 250, 150, or 75 PrepGems.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <h4 className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                  <span>▼</span>
                  <span>Demotion Zone (Bottom 5)</span>
                </h4>
                <p>
                  Candidates who finish in the bottom 5 of their group drop down one league tier next week. Keep your daily study streak active to prevent relegation.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                <h4 className="font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs">
                  <span>⚡</span>
                  <span>Ways to Earn XP</span>
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-foreground font-semibold">
                  <li>• CBT Mock Exam: <strong>+150 XP</strong></li>
                  <li>• Diagnostic Test: <strong>+100 XP</strong></li>
                  <li>• Syllabus Topic: <strong>+50 XP</strong></li>
                  <li>• Daily Streak Check-in: <strong>+25 XP</strong></li>
                  <li>• Correct Practice Question: <strong>+5 XP</strong></li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRulesModal(false)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs cursor-pointer transition-colors"
            >
              Got It, Let&apos;s Climb the Ranks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
