"use client";

import { useState } from "react";
import type { FeedbackItem } from "@/actions/feedback";
import { submitFeedbackAction, upvoteFeedbackAction } from "@/actions/feedback";
import {
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon,
  LightbulbIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "@/components/ui/icons";

interface FeedbackViewProps {
  initialItems: FeedbackItem[];
}

export default function FeedbackView({ initialItems }: FeedbackViewProps) {
  const [items, setItems] = useState<FeedbackItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<"all" | "feature_suggestion" | "missing_tool" | "candidate_review">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  // Form state
  const [formType, setFormType] = useState<"feature_suggestion" | "missing_tool" | "candidate_review">("feature_suggestion");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAuthorName, setFormAuthorName] = useState("");
  const [formAuthorRole, setFormAuthorRole] = useState("");
  const [formCategory, setFormCategory] = useState("Calculators");
  const [formRating, setFormRating] = useState(5);
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const handleUpvote = async (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds((prev) => ({ ...prev, [id]: true }));

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
    );

    await upvoteFeedbackAction(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    setSubmitting(true);
    try {
      const res = await submitFeedbackAction({
        type: formType,
        title: formTitle,
        description: formDescription,
        authorName: formAuthorName || "Candidate",
        authorRole: formAuthorRole || "UTME Aspirant",
        category: formCategory,
        rating: formType === "candidate_review" ? formRating : undefined,
      });

      if (res.success) {
        setItems([res.item, ...items]);
        setFormSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess(false);
          setFormTitle("");
          setFormDescription("");
        }, 1200);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <LightbulbIcon className="w-3.5 h-3.5" />
            <span>Community Feedback &amp; Product Roadmap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
            Suggest Features, Report Missing Tools &amp; Share Your Review
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            PrepSmart was created by students for students. If there&apos;s a calculator, past question topic, or study tool you wish we had, tell us! We review every submission and build what helps you score 280+ faster.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFormType("feature_suggestion");
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Suggest a Feature</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormType("missing_tool");
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileTextIcon className="w-4 h-4 text-amber-500" />
              <span>Report Missing Tool</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormType("candidate_review");
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs hover:bg-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <StarIcon className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Submissions" },
            { id: "feature_suggestion", label: "Feature Ideas" },
            { id: "missing_tool", label: "Missing Tools" },
            { id: "candidate_review", label: "Student Reviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-semibold">
          Showing {filteredItems.length} community posts
        </span>
      </div>

      {/* Grid of Feedback & Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => {
          const isReview = item.type === "candidate_review";
          const isMissing = item.type === "missing_tool";

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isReview
                        ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : isMissing
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {isReview
                      ? "Candidate Review"
                      : isMissing
                      ? "Missing Tool Request"
                      : "Feature Suggestion"}
                  </span>

                  {item.status && (
                    <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {item.status === "shipped"
                        ? "Shipped"
                        : item.status === "planned"
                        ? "Planned"
                        : item.status === "published"
                        ? "Verified"
                        : "Under Review"}
                    </span>
                  )}
                </div>

                {isReview && item.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating! ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-black text-foreground ml-1.5">{item.rating}.0</span>
                  </div>
                )}

                <h3 className="text-base font-extrabold text-foreground leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {item.authorName}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {item.authorRole} • {item.createdAt}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpvote(item.id)}
                  disabled={upvotedIds[item.id]}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    upvotedIds[item.id]
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-muted/60 border-border text-foreground hover:bg-blue-500/10 hover:border-blue-500/40"
                  }`}
                >
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  <span>{item.upvotes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-black text-foreground">
                {formType === "candidate_review"
                  ? "Leave a Student Review"
                  : formType === "missing_tool"
                  ? "Report Missing Tool or Content"
                  : "Suggest a New Feature"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-black text-foreground">Thank You!</h4>
                <p className="text-xs text-muted-foreground">
                  Your submission has been received and added to the community board.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "feature_suggestion", label: "Idea" },
                    { id: "missing_tool", label: "Missing Tool" },
                    { id: "candidate_review", label: "Review" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormType(t.id as any)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formType === t.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Rating if review */}
                {formType === "candidate_review" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground block">
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <StarIcon
                            className={`w-6 h-6 ${
                              star <= formRating
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-muted-foreground ml-2">
                        {formRating} Stars
                      </span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">
                    {formType === "candidate_review" ? "Headline Summary" : "Title / Name of Tool"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      formType === "candidate_review"
                        ? "e.g. Scored 304! Best CBT practice app"
                        : "e.g. Post-UTME Aggregate Calculator"
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">
                    {formType === "candidate_review" ? "Your Experience" : "What is missing or how should it work?"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide details so our team can review and implement it..."
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Name & Target Course */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground block">Your Name</label>
                    <input
                      type="text"
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      placeholder="e.g. Tunde A."
                      className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground block">Target Course / School</label>
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      placeholder="e.g. Medicine • UNILAG"
                      className="w-full px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Post to Community Board"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

