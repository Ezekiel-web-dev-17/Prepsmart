import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ProgressPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProgressPage({ searchParams }: ProgressPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/progress");
  }

  const params = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  query.set("tab", "readiness");

  for (const [key, val] of Object.entries(params)) {
    if (key !== "tab" && typeof val === "string") {
      query.set(key, val);
    }
  }

  redirect(`/dashboard?${query.toString()}`);
}
