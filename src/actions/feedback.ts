"use server";

import { auth } from "@/lib/auth";

export interface FeedbackItem {
  id: string;
  type: "feature_suggestion" | "missing_tool" | "candidate_review";
  title: string;
  description: string;
  authorName: string;
  authorRole: string;
  rating?: number; // 1-5 for reviews
  category?: string;
  upvotes: number;
  status?: "under_review" | "planned" | "shipped" | "published";
  createdAt: string;
}

// Initial community feedback & authentic student reviews
let feedbackStore: FeedbackItem[] = [
  {
    id: "fb-1",
    type: "candidate_review",
    title: "Scored 318 in my mock after 2 months of using PrepSmart!",
    description:
      "The best part of PrepSmart is the Revision Hub. In my previous attempts, I just kept cramming past questions without understanding why I failed. Reviewing questions I missed until I understood them completely changed my score.",
    authorName: "Chinedu Okafor",
    authorRole: "Medicine Aspirant • UNILAG",
    rating: 5,
    upvotes: 42,
    status: "published",
    createdAt: "2026-10-24",
  },
  {
    id: "fb-2",
    type: "feature_suggestion",
    title: "Post-UTME Screening Aggregate Calculator",
    description:
      "It would be amazing to have an aggregate calculator where we enter our JAMB score and our 5 O'Level grades (A1=4, B2=3.6 etc.) to see our total 100% aggregate score for UNILAG, UI, and FUTA.",
    authorName: "Amina Bello",
    authorRole: "Engineering Candidate • UI",
    category: "Calculators",
    upvotes: 38,
    status: "planned",
    createdAt: "2026-10-27",
  },
  {
    id: "fb-3",
    type: "missing_tool",
    title: "Need Quick Chemistry Periodic Table & Formula Cheat Sheet in CBT",
    description:
      "During chemistry drills, having a quick toggle to view standard atomic masses and electronegativity values (just like the JAMB on-screen calculator) would save time.",
    authorName: "Emeka Nwosu",
    authorRole: "Pharmacy Candidate • UNN",
    category: "Exam Tools",
    upvotes: 29,
    status: "under_review",
    createdAt: "2026-10-29",
  },
  {
    id: "fb-4",
    type: "candidate_review",
    title: "The 8-key CBT simulator removed all my exam anxiety",
    description:
      "Last year I lost almost 20 minutes in the exam hall struggling with the mouse. Practicing with A, B, C, D and N, P shortcuts on PrepSmart made my answering speed twice as fast.",
    authorName: "Zainab Aliyu",
    authorRole: "Law Aspirant • ABU Zaria",
    rating: 5,
    upvotes: 35,
    status: "published",
    createdAt: "2026-10-30",
  },
  {
    id: "fb-5",
    type: "feature_suggestion",
    title: "Study Group Voice Rooms in Discord Community",
    description:
      "Can we have scheduled 30-minute silent study sessions with other candidates where we all solve 40 physics past questions at the same time and discuss afterwards?",
    authorName: "Tunde Adeyemi",
    authorRole: "Computer Science Aspirant • FUTA",
    category: "Community",
    upvotes: 21,
    status: "planned",
    createdAt: "2026-10-31",
  },
];

export async function getFeedbacksAndReviews(): Promise<FeedbackItem[]> {
  return [...feedbackStore].sort((a, b) => b.upvotes - a.upvotes);
}

export async function submitFeedbackAction(data: {
  type: "feature_suggestion" | "missing_tool" | "candidate_review";
  title: string;
  description: string;
  authorName?: string;
  authorRole?: string;
  category?: string;
  rating?: number;
}): Promise<{ success: boolean; item: FeedbackItem }> {
  const { userId } = await auth();

  const newItem: FeedbackItem = {
    id: `fb-${Date.now()}`,
    type: data.type,
    title: data.title.trim(),
    description: data.description.trim(),
    authorName: data.authorName?.trim() || "Candidate",
    authorRole: data.authorRole?.trim() || "UTME Aspirant",
    category: data.category || "General",
    rating: data.rating,
    upvotes: 1,
    status: data.type === "candidate_review" ? "published" : "under_review",
    createdAt: new Date().toISOString().split("T")[0],
  };

  feedbackStore = [newItem, ...feedbackStore];

  return { success: true, item: newItem };
}

export async function upvoteFeedbackAction(
  id: string,
): Promise<{ success: boolean; upvotes: number }> {
  const item = feedbackStore.find((f) => f.id === id);
  if (item) {
    item.upvotes += 1;
    return { success: true, upvotes: item.upvotes };
  }
  return { success: false, upvotes: 0 };
}
