import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface MockExamPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MockExamPage({ searchParams }: MockExamPageProps) {
  const params = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  query.set("tab", "mock-exam");

  for (const [key, val] of Object.entries(params)) {
    if (key !== "tab" && typeof val === "string") {
      query.set(key, val);
    }
  }

  redirect(`/study?${query.toString()}`);
}
