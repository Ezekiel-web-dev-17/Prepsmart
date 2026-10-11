import Link from "next/link";

interface DepartmentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ department: string }>;
}

export function generateStaticParams() {
  return [
    { department: "science" },
    { department: "commercial" },
    { department: "arts" },
  ];
}

export default async function DepartmentLayout({
  children,
  params,
}: DepartmentLayoutProps) {
  const { department } = await params;
  const currentDept = department.toLowerCase();

  const streams = [
    {
      id: "science",
      label: "Science & Tech",
      href: "/study/science",
      badge: "STEM",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    },
    {
      id: "commercial",
      label: "Commercial & Social",
      href: "/study/commercial",
      badge: "Business",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      id: "arts",
      label: "Arts & Humanities",
      href: "/study/arts",
      badge: "Humanities",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  ];

  const currentStream = streams.find((s) => s.id === currentDept);
  const departmentName = currentStream?.label ?? "Department Curriculum";

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <Link href="/study" className="hover:text-foreground transition-colors">
          Study Curriculum
        </Link>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-foreground font-semibold">
          {departmentName}
        </span>
      </nav>

      {/* Stream Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-card/80 backdrop-blur-xs border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Link
            href="/study"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
          >
            ← All Streams
          </Link>
          <div className="h-4 w-px bg-border mx-1" />
          {streams.map((stream) => {
            const isActive = currentDept === stream.id;
            return (
              <Link
                key={stream.id}
                href={stream.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-xs shadow-blue-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{stream.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full border ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : stream.badgeColor
                  }`}
                >
                  {stream.badge}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Quick Utility Links */}
        <div className="flex items-center gap-2 self-end sm:self-auto px-1">
          <Link
            href="/revision"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
          >
            Flashcards
          </Link>
          <Link
            href="/onboarding"
            className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 text-xs font-bold transition-colors whitespace-nowrap"
          >
            Pre-Test
          </Link>
        </div>
      </div>

      {/* Main Page Content */}
      <main>{children}</main>
    </div>
  );
}
