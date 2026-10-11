import Link from "next/link";

export default function Home() {
  const streams = [
    {
      id: "science",
      title: "Science & Technology",
      subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology"],
      color:
        "border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 hover:border-teal-400 dark:hover:border-teal-700",
      badgeColor:
        "bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300",
      description:
        "Medicine, Engineering, Computer Science, and Pure Sciences curriculum.",
    },
    {
      id: "arts",
      title: "Arts & Humanities",
      subjects: ["English", "Literature", "Government", "CRS", "Islamic Studies"],
      color:
        "border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:border-purple-400 dark:hover:border-purple-700",
      badgeColor:
        "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300",
      description:
        "Law, Mass Communication, International Relations, and Performing Arts.",
    },
    {
      id: "commercial",
      title: "Commercial / Social Science",
      subjects: ["English", "Mathematics", "Economics", "Commerce", "Accounting"],
      color:
        "border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:border-amber-400 dark:hover:border-amber-700",
      badgeColor:
        "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300",
      description:
        "Accounting, Business Administration, Economics, and Banking & Finance.",
    },
  ];

  const weeks = [
    {
      number: 1,
      title: "Foundation",
      desc: "Core formulas, rules, and fundamental principles.",
    },
    {
      number: 2,
      title: "Build Understanding",
      desc: "Detailed mechanisms, reactions, and rules.",
    },
    {
      number: 3,
      title: "Apply Knowledge",
      desc: "Past questions, tricky twists, and calculation drills.",
    },
    {
      number: 4,
      title: "Revision & Practice",
      desc: "Full timed CBT drills, high-frequency traps, and mocks.",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <section className="bg-card border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors duration-200">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <span>Official JAMB/UTME 4-Week Syllabus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Understand. Practise. Revise.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            A clean, modern 4-week preparation platform structured to help you beat examiner traps, master high-yield topics, and achieve 300+ in your UTME.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/study"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-sm shadow-sm shadow-blue-500/25 transition-all"
            >
              Start 4-Week Study Plan
            </Link>
            <Link
              href="/onboarding"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm transition-all"
            >
              Diagnostic Pre-Test
            </Link>
            <Link
              href="/revision"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm transition-all"
            >
              Revision Hub
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Week Study Journey Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">
            Your 4-Week Preparation Journey
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            Official UTME Blueprint
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weeks.map((week) => (
            <div
              key={week.number}
              className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Week {week.number}
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                  {week.number}
                </span>
              </div>
              <h3 className="font-bold text-foreground text-base">
                {week.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {week.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Departmental Streams */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-foreground">
          Choose Your Departmental Stream
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className={`border rounded-2xl p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between ${stream.color}`}
            >
              <div className="space-y-2">
                <span
                  className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${stream.badgeColor}`}
                >
                  {stream.title}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {stream.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stream.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {stream.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="text-[11px] font-medium bg-card/90 dark:bg-card/70 border border-border px-2 py-0.5 rounded-md text-foreground"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/study/${stream.id.toLowerCase()}`}
                className="mt-4 text-center w-full py-2 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-colors block"
              >
                Browse {stream.title.split(" ")[0]} Curriculum →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/progress"
          className="bg-card border border-border rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-1 block shadow-xs"
        >
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
            Analytics
          </span>
          <h3 className="font-bold text-foreground">My Progress & Readiness</h3>
          <p className="text-xs text-muted-foreground">
            Track your projected UTME score and weak topics queue.
          </p>
        </Link>
        <Link
          href="/revision"
          className="bg-card border border-border rounded-2xl p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-all space-y-1 block shadow-xs"
        >
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
            Active Recall
          </span>
          <h3 className="font-bold text-foreground">
            Revision Flashcard Decks
          </h3>
          <p className="text-xs text-muted-foreground">
            Interactive formula cards, mnemonics, and grammar rules.
          </p>
        </Link>
        <Link
          href="/roster"
          className="bg-card border border-border rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-1 block shadow-xs"
        >
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            Cohort
          </span>
          <h3 className="font-bold text-foreground">Student Roster</h3>
          <p className="text-xs text-muted-foreground">
            Manage multiple candidate profiles and export diagnostic CSVs.
          </p>
        </Link>
      </section>
    </div>
  );
}
