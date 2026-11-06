"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RoadmapTopicNode,
  SubjectRoadmap,
  ALL_ROADMAPS,
  getRoadmapForSubject,
} from "@/lib/roadmap-curriculum";
import TopicMasteryDrawer, {
  TopicProgressState,
} from "@/components/study/TopicMasteryDrawer";
import {
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
  AlertTriangleIcon,
  FlameIcon,
  TrophyIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  ZapIcon,
  CheckIcon,
} from "@/components/ui/icons";

interface RoadmapViewProps {
  initialStream?: "science" | "commercial" | "arts";
  initialSubject?: string;
  isAuthenticated?: boolean;
}

export default function RoadmapView({
  initialStream = "science",
  initialSubject = "mathematics",
  isAuthenticated = false,
}: RoadmapViewProps) {
  const [stream, setStream] = useState<"science" | "commercial" | "arts">(initialStream);
  const [subjectSlug, setSubjectSlug] = useState<string>(initialSubject);
  const [roadmap, setRoadmap] = useState<SubjectRoadmap>(() =>
    getRoadmapForSubject(initialSubject, initialStream)
  );

  // Selected topic for drawer
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopicNode | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // User progress data across topics
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgressState>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  // Zoom / View scale
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Sync roadmap when subject or stream changes
  useEffect(() => {
    const updated = getRoadmapForSubject(subjectSlug, stream);
    setRoadmap(updated);
    fetchProgress(subjectSlug);
  }, [subjectSlug, stream]);

  const fetchProgress = async (currentSubject: string) => {
    setIsLoadingProgress(true);
    try {
      const res = await fetch(`/api/study/topic-progress?subject=${encodeURIComponent(currentSubject)}`);
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, TopicProgressState> = {};
        if (data.progress && Array.isArray(data.progress)) {
          data.progress.forEach((p: TopicProgressState) => {
            map[p.topicSlug] = p;
          });
        }
        setProgressMap(map);
      }
    } catch (err) {
      console.error("Error fetching topic progress:", err);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleOpenTopic = (topic: RoadmapTopicNode) => {
    setSelectedTopic(topic);
    setIsDrawerOpen(true);
  };

  const handleTopicCompleted = (topicSlug: string) => {
    setProgressMap((prev) => ({
      ...prev,
      [topicSlug]: {
        ...(prev[topicSlug] || {
          subject: subjectSlug,
          stream,
          topicSlug,
          topicTitle: selectedTopic?.title || topicSlug,
        }),
        isCompleted: true,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  // Determine subject stream options
  const subjectsForStream: Record<"science" | "commercial" | "arts", Array<{ id: string; name: string }>> = {
    science: [
      { id: "mathematics", name: "Mathematics" },
      { id: "physics", name: "Physics" },
      { id: "chemistry", name: "Chemistry" },
    ],
    commercial: [
      { id: "economics", name: "Economics" },
      { id: "mathematics", name: "Mathematics" },
    ],
    arts: [
      { id: "government", name: "Government" },
      { id: "economics", name: "Economics" },
    ],
  };

  // Calculate subject completion stats
  const allTopics = roadmap.stages.flatMap((s) => s.topics);
  const totalTopicCount = allTopics.length;
  const completedTopicCount = allTopics.filter((t) => progressMap[t.id]?.isCompleted).length;
  const progressPercent = totalTopicCount > 0 ? Math.round((completedTopicCount / totalTopicCount) * 100) : 0;
  const earnedXp = completedTopicCount * 50;

  // Prerequisite check
  const isTopicLocked = (topic: RoadmapTopicNode) => {
    if (!topic.prerequisites || topic.prerequisites.length === 0) return false;
    // Locked if any prerequisite is not completed
    return topic.prerequisites.some((prereqId) => !progressMap[prereqId]?.isCompleted);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation & Header Bar */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/study"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              title="Return to Study Hub"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Interactive Learning Roadmap
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Roadmap.sh Style
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <span>{roadmap.name} Master Roadmap</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                  {roadmap.code}
                </span>
              </h1>
            </div>
          </div>

          {/* Department Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border shrink-0 self-start md:self-auto">
            {(["science", "commercial", "arts"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStream(s);
                  const firstSub = subjectsForStream[s][0]?.id || "mathematics";
                  setSubjectSlug(firstSub);
                }}
                className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  stream === s
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Pills & Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-2">
            {subjectsForStream[stream].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubjectSlug(sub.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  subjectSlug === sub.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-card hover:bg-muted text-foreground border-border"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Progress & Zoom Controls */}
          <div className="flex items-center gap-4 text-xs font-bold shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Progress:</span>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {progressPercent}%
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ZapIcon className="w-3.5 h-3.5" />
              <span>+{earnedXp} XP Earned</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(0.75, prev - 0.1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer text-sm font-bold"
                title="Zoom Out"
              >
                -
              </button>
              <span className="text-[11px] font-mono px-1 font-bold">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(1.25, prev + 0.1))}
                className="w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer text-sm font-bold"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className="px-1.5 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Roadmap Visual Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        {/* Roadmap Canvas Container with dynamic zoom */}
        <div
          className="w-full max-w-4xl transition-transform origin-top space-y-12 py-6"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {roadmap.stages.map((stage, stageIdx) => (
            <div key={stage.stage} className="relative flex flex-col items-center">
              {/* Stage Banner / Milestones Header */}
              <div className="w-full max-w-xl text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-2">
                  <BookOpenIcon className="w-3.5 h-3.5" />
                  <span>{stage.title}</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{stage.description}</p>
              </div>

              {/* Topics Grid in this Stage */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.topics.map((topic) => {
                  const isCompleted = Boolean(progressMap[topic.id]?.isCompleted);
                  const isLocked = !isCompleted && isTopicLocked(topic);
                  const hasNote = Boolean(progressMap[topic.id]?.studentNote);

                  // Card styling states
                  let cardBorder = "border-border/80 hover:border-blue-500 hover:shadow-md bg-card";
                  if (isCompleted) {
                    cardBorder = "border-emerald-500/60 bg-emerald-500/5 shadow-xs shadow-emerald-500/10 ring-1 ring-emerald-500/30";
                  } else if (isLocked) {
                    cardBorder = "border-border/40 bg-muted/20 opacity-60 cursor-not-allowed";
                  }

                  return (
                    <div
                      key={topic.id}
                      onClick={() => !isLocked && handleOpenTopic(topic)}
                      className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between group ${cardBorder} ${
                        !isLocked ? "cursor-pointer" : ""
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {topic.highYield && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <FlameIcon className="w-3 h-3" />
                              <span>High Yield</span>
                            </span>
                          )}
                          {topic.examinerTrap && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                              <AlertTriangleIcon className="w-3 h-3" />
                              <span>Trap Alert</span>
                            </span>
                          )}
                        </div>

                        {/* Completion / Status Badge */}
                        <div>
                          {isCompleted ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <CheckIcon className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : isLocked ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              Locked
                            </span>
                          ) : hasNote ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600">
                              In Progress
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">
                              Click to Learn →
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-medium">
                          {topic.subtitle}
                        </p>
                      </div>

                      {/* Footer Info: Textbooks & Prereqs */}
                      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-semibold truncate max-w-[200px]">
                          📖 {topic.textbookAdvice[0]?.textbook.split(" by ")[0] || "Standard Text"}
                        </span>
                        <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Mastery Hub</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Bezier / Arrow Path to Next Stage */}
              {stageIdx < roadmap.stages.length - 1 && (
                <div className="my-6 flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-linear-to-b from-blue-500 to-primary/40"></div>
                  <div className="w-3 h-3 rotate-45 border-b-2 border-r-2 border-primary/60 -mt-1.5"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Slide-Over Topic Mastery Drawer */}
      <TopicMasteryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        topic={selectedTopic}
        progress={selectedTopic ? progressMap[selectedTopic.id] : null}
        onTopicCompleted={handleTopicCompleted}
      />
    </div>
  );
}

