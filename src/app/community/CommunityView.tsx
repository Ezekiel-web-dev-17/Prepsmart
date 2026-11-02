"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  BrainIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  GraduationCapIcon,
  LightbulbIcon,
  RocketIcon,
  SearchIcon,
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  XIcon,
} from "@/components/ui/icons";

interface Message {
  id: string;
  channelId: string;
  author: {
    name: string;
    avatarInitials: string;
    role: string;
    badgeColor: string;
    isOnline: boolean;
  };
  timestamp: string;
  content: string;
  solution?: string;
  reactions: { type: string; count: number; reacted?: boolean }[];
}

const CHANNELS = [
  {
    category: "WELCOME & RULES",
    channels: [
      { id: "welcome-and-guidelines", name: "welcome-and-guidelines", topic: "Rules, advice, and how to get help" },
      { id: "announcements", name: "announcements", topic: "Official PrepSmart and JAMB syllabus updates" },
    ],
  },
  {
    category: "GENERAL CHAT",
    channels: [
      { id: "general-lounge", name: "general-lounge", topic: "Casual chat, daily check-ins, and study goals" },
      { id: "study-tips-and-hacks", name: "study-tips-and-hacks", topic: "How candidates study 2-3 months to clear 300+" },
      { id: "streak-accountability", name: "streak-accountability", topic: "Post your daily study streak and stay consistent" },
    ],
  },
  {
    category: "SUBJECT STUDY ROOMS",
    channels: [
      { id: "mathematics", name: "mathematics", topic: "Calculus, trigonometry, algebra, and geometry problems" },
      { id: "use-of-english", name: "use-of-english", topic: "Concord, lexis, antonyms, oral forms, and novel review" },
      { id: "physics", name: "physics", topic: "Mechanics, waves, electricity, optics, and formula derivations" },
      { id: "chemistry", name: "chemistry", topic: "Organic reaction pathways, gas laws, and stoichiometry" },
      { id: "biology", name: "biology", topic: "Genetics, ecology, cell physiology, and organ diagrams" },
      { id: "economics-commerce", name: "economics-commerce", topic: "Elasticity curves, banking, and accounting calculations" },
      { id: "literature-government", name: "literature-government", topic: "Prescribed plays, prose, poems, and constitution articles" },
    ],
  },
  {
    category: "EXAM TACTICS & CUT-OFFS",
    channels: [
      { id: "cbt-tactics", name: "cbt-tactics", topic: "Using the 8-key keyboard shortcuts (A, B, C, D, N, P, R, S)" },
      { id: "university-cut-off-talk", name: "university-cut-off-talk", topic: "UNILAG, UI, OAU, ABU, UNN screening prerequisites" },
    ],
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    channelId: "mathematics",
    author: {
      name: "Tobi Adebayo",
      avatarInitials: "TA",
      role: "Engineering Aspirant",
      badgeColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
      isOnline: true,
    },
    timestamp: "Today at 9:14 AM",
    content:
      "Can someone break down Question 23 from the 2022 Mathematics past questions? 'If y = 3x^3 - 4x^2 + 5x - 7, find the second derivative d^2y/dx^2 when x = 2'. I keep getting 24 but the options have 28.",
    solution:
      "Step 1: First derivative dy/dx = 9x^2 - 8x + 5.\nStep 2: Second derivative d^2y/dx^2 = 18x - 8.\nStep 3: Plug in x = 2: (18 * 2) - 8 = 36 - 8 = 28. Your first derivative had an algebra error on the 4x^2 term!",
    reactions: [
      { type: "Helpful", count: 18, reacted: false },
      { type: "Solved", count: 24, reacted: true },
    ],
  },
  {
    id: "m-2",
    channelId: "mathematics",
    author: {
      name: "Fatima Sanusi",
      avatarInitials: "FS",
      role: "312 Mock Scholar",
      badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      isOnline: true,
    },
    timestamp: "Today at 9:22 AM",
    content:
      "Also remember for JAMB: polynomial derivatives come out in almost every single exam. Practice the power rule d/dx(x^n) = n*x^(n-1) until you can do it mentally in 10 seconds without writing.",
    reactions: [
      { type: "Great Tip", count: 14, reacted: false },
    ],
  },
  {
    id: "m-3",
    channelId: "chemistry",
    author: {
      name: "Emeka Kalu",
      avatarInitials: "EK",
      role: "Medicine Candidate",
      badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      isOnline: true,
    },
    timestamp: "Today at 10:05 AM",
    content:
      "Quick question on Electrolysis: Why is copper purified at the cathode rather than the anode? Need a crystal-clear explanation for my revision notes.",
    solution:
      "During electrolytic refining of copper, reduction always occurs at the cathode (negative electrode). Cu2+ cations in the solution gain 2 electrons and deposit as pure neutral copper metal (Cu2+ + 2e- -> Cu). The impure copper anode dissolves into the electrolyte.",
    reactions: [
      { type: "Crystal Clear", count: 21, reacted: true },
      { type: "Saved", count: 11, reacted: false },
    ],
  },
  {
    id: "m-4",
    channelId: "use-of-english",
    author: {
      name: "Blessing Okon",
      avatarInitials: "BO",
      role: "Law Aspirant",
      badgeColor: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
      isOnline: true,
    },
    timestamp: "Today at 10:48 AM",
    content:
      "Watch out for JAMB concord traps! Whenever you see 'Neither of the boys...', the verb must be SINGULAR ('Neither of the boys WAS present', not 'were'). The subject is 'neither', not 'boys'!",
    reactions: [
      { type: "Examiner Trap", count: 32, reacted: true },
      { type: "Essential", count: 19, reacted: false },
    ],
  },
  {
    id: "m-5",
    channelId: "general-lounge",
    author: {
      name: "Ibrahim Dahiru",
      avatarInitials: "ID",
      role: "Candidate",
      badgeColor: "bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-500/30",
      isOnline: true,
    },
    timestamp: "Today at 11:15 AM",
    content:
      "Just hit day 14 on my study streak! 45 minutes every evening. The trick really is doing it every day instead of cramming on weekends.",
    reactions: [
      { type: "Keep Going", count: 27, reacted: true },
    ],
  },
];

const ONLINE_MEMBERS = [
  { name: "Dr. Olumide", role: "Chemistry & Physics Tutor", badge: "Mentor", color: "text-amber-500", online: true },
  { name: "Chinedu Okafor", role: "Scored 318 in Mock", badge: "Top Scholar", color: "text-emerald-500", online: true },
  { name: "Fatima Sanusi", role: "Scored 312 in Mock", badge: "Top Scholar", color: "text-emerald-500", online: true },
  { name: "Amina Bello", role: "UI Engineering Aspirant", badge: "Candidate", color: "text-blue-500", online: true },
  { name: "Tobi Adebayo", role: "UNILAG Computer Science", badge: "Candidate", color: "text-blue-500", online: true },
  { name: "Blessing Okon", role: "OAU Law Candidate", badge: "Candidate", color: "text-purple-500", online: true },
  { name: "Emeka Kalu", role: "UNN Medicine Candidate", badge: "Candidate", color: "text-teal-500", online: true },
];

export default function CommunityView() {
  const [activeChannelId, setActiveChannelId] = useState("mathematics");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showMembers, setShowMembers] = useState(true);

  const activeChannel =
    CHANNELS.flatMap((cat) => cat.channels).find((c) => c.id === activeChannelId) ||
    CHANNELS[2].channels[0];

  const channelMessages = messages.filter((m) => {
    const matchesChannel =
      m.channelId === activeChannelId || activeChannelId === "general-lounge";
    const matchesSearch =
      !searchFilter ||
      m.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.author.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      channelId: activeChannelId,
      author: {
        name: "You (Active Candidate)",
        avatarInitials: "ME",
        role: "JAMB Candidate",
        badgeColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
        isOnline: true,
      },
      timestamp: "Just now",
      content: inputText.trim(),
      reactions: [{ type: "Helpful", count: 1, reacted: true }],
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          reactions: msg.reactions.map((r) =>
            r.type === reactionType
              ? {
                  ...r,
                  count: r.reacted ? r.count - 1 : r.count + 1,
                  reacted: !r.reacted,
                }
              : r
          ),
        };
      })
    );
  };

  return (
    <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden flex flex-col h-[calc(100vh-10rem)] min-h-[640px]">
      {/* Top Discord Server Masthead */}
      <div className="h-14 border-b border-border bg-muted/40 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            PS
          </div>
          <div>
            <h2 className="text-sm font-black text-foreground flex items-center gap-1.5">
              <span>PrepSmart Student Hub</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Server Online" />
            </h2>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Ask questions, solve problems together, and learn from top candidates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search in Channel */}
          <div className="relative hidden md:block">
            <SearchIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search questions in room..."
              className="pl-8 pr-3 py-1 rounded-xl bg-background border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMembers(!showMembers)}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Online ({ONLINE_MEMBERS.length})</span>
          </button>
        </div>
      </div>

      {/* Main Discord Layout: 3 Columns (Channels, Chat Feed, Members) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Channels Sidebar */}
        <aside className="w-60 sm:w-64 border-r border-border bg-muted/20 flex flex-col shrink-0 overflow-y-auto p-3 space-y-4">
          {CHANNELS.map((group) => (
            <div key={group.category} className="space-y-1">
              <span className="px-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-1">
                {group.category}
              </span>
              {group.channels.map((chan) => {
                const isActive = activeChannelId === chan.id;
                return (
                  <button
                    key={chan.id}
                    type="button"
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="text-sm font-bold opacity-70">#</span>
                    <span className="truncate">{chan.name}</span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-border/60">
            <Link
              href="/feedback"
              className="px-3 py-2 rounded-xl bg-card border border-border hover:bg-muted text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
            >
              <span>Suggest a Feature</span>
              <SparklesIcon className="w-3.5 h-3.5 text-blue-500" />
            </Link>
          </div>
        </aside>

        {/* Center: Active Chat Feed */}
        <main className="flex-1 flex flex-col bg-card overflow-hidden">
          {/* Channel Header */}
          <div className="h-11 border-b border-border px-4 flex items-center justify-between shrink-0 bg-card/60 backdrop-blur-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-base font-bold text-muted-foreground">#</span>
              <h3 className="text-xs sm:text-sm font-black text-foreground truncate">
                {activeChannel.name}
              </h3>
              <span className="text-xs text-muted-foreground hidden sm:inline truncate pl-2 border-l border-border">
                {activeChannel.topic}
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Channel Welcome Message */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">#</span>
                <h4 className="text-sm font-extrabold text-foreground">
                  Welcome to #{activeChannel.name}!
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                This is the start of the #{activeChannel.name} channel. Post past questions, raise
                equations you find confusing, and explain solutions to your fellow candidates.
              </p>
            </div>

            {/* List of Messages */}
            {channelMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {msg.author.avatarInitials}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-foreground">
                      {msg.author.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${msg.author.badgeColor}`}
                    >
                      {msg.author.role}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {/* Solved / Explanation Box */}
                  {msg.solution && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        <span>Step-by-Step Peer Solution</span>
                      </div>
                      <p className="text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed">
                        {msg.solution}
                      </p>
                    </div>
                  )}

                  {/* Reaction Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {msg.reactions.map((rx) => (
                      <button
                        key={rx.type}
                        type="button"
                        onClick={() => handleReaction(msg.id, rx.type)}
                        className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          rx.reacted
                            ? "bg-blue-600/15 border-blue-500/50 text-blue-600 dark:text-blue-400"
                            : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{rx.type}</span>
                        <span className="text-[10px] opacity-80 tabular-nums">{rx.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-border bg-card">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask a question or explain a solution in #${activeChannel.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs sm:text-sm text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </main>

        {/* Right: Online Members Sidebar */}
        {showMembers && (
          <aside className="w-56 sm:w-60 border-l border-border bg-muted/10 p-4 space-y-4 shrink-0 overflow-y-auto hidden lg:block">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
              Online Students &amp; Tutors ({ONLINE_MEMBERS.length})
            </span>

            <div className="space-y-3">
              {ONLINE_MEMBERS.map((mem) => (
                <div key={mem.name} className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center font-bold text-[10px] text-foreground">
                      {mem.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    {mem.online && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-card" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-foreground block truncate">
                      {mem.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {mem.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Study Room Tip
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Explaining a concept to another candidate is the single fastest way to master it for your own UTME.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

