import type { Metadata } from "next";
import { getFeedbacksAndReviews } from "@/actions/feedback";
import FeedbackView from "./FeedbackView";

export const metadata: Metadata = {
  title: "Suggest Features, Report Missing Tools & Candidate Reviews | PREPSMART",
  description:
    "Suggest new study tools, report missing JAMB past questions or formulas, and read authentic reviews from candidates who scored 280+ with PrepSmart.",
};

export default async function FeedbackPage() {
  const items = await getFeedbacksAndReviews();
  return <FeedbackView initialItems={items} />;
}

