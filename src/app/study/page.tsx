import type { Metadata } from "next";
import StudyCurriculumHub from "./StudyCurriculumHub";

export const metadata: Metadata = {
  title: "4-Week Study Curriculum & JAMB 2026 Syllabus Hub | Prepsmart",
  description:
    "Comprehensive 4-week UTME preparation roadmap across Science, Commercial, and Arts streams. Live syllabus explorer with 108+ official topics, weekly milestones, and examiner trap alerts.",
  keywords: [
    "JAMB study curriculum",
    "UTME 4-week syllabus",
    "JAMB 2026 syllabus",
    "Science stream UTME",
    "Commercial stream UTME",
    "Arts stream UTME",
    "JAMB CBT timing strategy",
    "examiner traps",
  ],
};

export default function StudyPage() {
  return <StudyCurriculumHub />;
}
