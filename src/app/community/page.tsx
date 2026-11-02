import type { Metadata } from "next";
import CommunityView from "./CommunityView";

export const metadata: Metadata = {
  title: "Student Community Hub — Peer Questions, Teaching & Study Rooms | PREPSMART",
  description:
    "Join the PrepSmart student community. Raise difficult past questions, learn step-by-step solutions from fellow candidates, and master your JAMB syllabus together.",
};

export default function CommunityPage() {
  return <CommunityView />;
}

