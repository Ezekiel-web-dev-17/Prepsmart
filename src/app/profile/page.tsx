import type { Metadata } from "next";
import ProfileView from "./ProfileView";

export const metadata: Metadata = {
  title: "Candidate Profile, Academic Stream & Study Preferences | PrepSmart",
  description:
    "Manage your enrolled UTME academic stream, choose your 4 JAMB examination subjects, set your target score, and customize your daily study cadence.",
};

export default function ProfilePage() {
  return (
    <div className="py-4 sm:py-6">
      <ProfileView />
    </div>
  );
}
