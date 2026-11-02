import Link from "next/link";
import UniversityImage from "@/components/universities/UniversityImage";
import UniversityLogo from "@/components/universities/UniversityLogo";
import {
  GraduationCapIcon,
  BookOpenIcon,
  TargetIcon,
  FlameIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BrainIcon,
  CalculatorIcon,
  ShieldIcon,
  BeakerIcon,
  BriefcaseIcon,
  PaletteIcon,
} from "@/components/ui/icons";

export default function Home() {
  const problemsAndSolutions = [
    {
      problem: "You don't know where to start or what topics to read first",
      solution: "Study the Official JAMB Syllabus Topic by Topic",
      description:
        "Stop guessing what might come out. Every single topic from the official JAMB syllabus is organized by subject so you can tick them off as you study.",
      href: "/study",
      cta: "Browse the Syllabus",
      icon: BookOpenIcon,
      color: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
    },
    {
      problem: "You get nervous with the CBT screen and run out of time",
      solution: "Practice with the Real JAMB 8-Key CBT Screen",
      description:
        "JAMB uses a special 8-key setup (A, B, C, D, Next, Previous, Reverse, Submit). Practice with the exact timer, keys, and onscreen calculator until it feels completely natural.",
      href: "/study?tab=mock-exam",
      cta: "Try a CBT Mock Exam",
      icon: ClockIcon,
      color: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      problem: "You keep repeating the same mistakes on past questions",
      solution: "Review Every Wrong Answer Until You Understand It",
      description:
        "Whenever you miss a question, PrepSmart saves it and explains why the right answer is correct. We quiz you on it again a few days later so you never fall for that trap again.",
      href: "/dashboard?tab=revision",
      cta: "Open Your Revision Hub",
      icon: BrainIcon,
      color: "border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
    },
    {
      problem: "You are not sure of the exact cut-off mark for your chosen course",
      solution: "Check Real University Cut-Offs and Requirements",
      description:
        "Search through UNILAG, UI, OAU, ABU, UNN, and other federal and state universities to see their real departmental cut-off marks and compulsory subject combinations.",
      href: "/universities",
      cta: "Search University Cut-Offs",
      icon: GraduationCapIcon,
      color: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
    },
    {
      problem: "You struggle to study consistently every single day",
      solution: "Pick Your Study Time and Keep Your Streak Alive",
      description:
        "Tell the app when you prefer to study (morning, afternoon, evening, or night). We send you a gentle reminder so you don't lose your streak before exam day.",
      href: "/dashboard?tab=readiness",
      cta: "Check Your Daily Progress",
      icon: FlameIcon,
      color: "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
    },
    {
      problem: "People told you JAMB is difficult and most candidates fail",
      solution: "Learn Why JAMB is Easy When You Prepare Right",
      description:
        "JAMB is not an IQ test. The examiners repeat the same concepts every single year. Read how students like you prepared honestly and scored 300+ on their first try.",
      href: "/about",
      cta: "Why JAMB is Easy",
      icon: ShieldIcon,
      color: "border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400",
    },
  ];

  const streams = [
    {
      id: "science",
      title: "Science Stream",
      tagline: "Medicine, Pharmacy, Engineering, Computer Science & Pure Sciences",
      subjects: ["Use of English", "Mathematics", "Physics", "Chemistry", "Biology"],
      color: "border-teal-500/30 bg-teal-500/5",
      badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
      icon: BeakerIcon,
      description:
        "Learn calculation shortcuts, chemical equations, physics formulas, and biology diagrams step by step without feeling overwhelmed.",
    },
    {
      id: "commercial",
      title: "Commercial & Social Sciences",
      tagline: "Accounting, Economics, Business Admin, Banking & Finance",
      subjects: ["Use of English", "Mathematics", "Economics", "Commerce", "Principles of Accounts"],
      color: "border-amber-500/30 bg-amber-500/5",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      icon: BriefcaseIcon,
      description:
        "Understand balance sheets, supply and demand curves, commerce laws, and quantitative questions with clear explanations.",
    },
    {
      id: "arts",
      title: "Arts & Humanities",
      tagline: "Law, Mass Communication, Literature, International Relations & History",
      subjects: ["Use of English", "Literature in English", "Government", "CRS/IRS", "History"],
      color: "border-purple-500/30 bg-purple-500/5",
      badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
      icon: PaletteIcon,
      description:
        "Break down the prescribed novels, poems, plays, constitutional history, and English grammar rules so you can answer fast and accurately.",
    },
  ];

  const studyPhases = [
    {
      phase: "Month 1",
      title: "Cover the Syllabus Basics",
      description:
        "Go through the core topics in your 4 subjects. Focus on understanding the rules, formulas, and main points rather than trying to memorize everything at once.",
      points: ["Read topic summaries", "Learn the essential formulas and definitions", "Answer 10 practice questions after every topic"],
    },
    {
      phase: "Month 2",
      title: "Topic Past Questions & Review",
      description:
        "Solve real JAMB past questions arranged by topic. Look at the questions you get wrong, read the explanations, and review them until you are sure of them.",
      points: ["Practice past questions by topic", "Save questions you miss to the Revision Hub", "Clear up your weak spots before moving forward"],
    },
    {
      phase: "Month 3",
      title: "Timed CBT Mocks & Speed Practice",
      description:
        "Sit down and take full 2-hour mock exams using the keyboard shortcuts. Learn how to manage your time across all 4 subjects and build real exam confidence.",
      points: ["Take full 180-question CBT mocks", "Practice with the 8-key shortcuts and calculator", "Walk into the exam hall knowing you are ready"],
    },
  ];

  const featuredUniversities = [
    {
      slug: "unilag",
      name: "University of Lagos",
      acronym: "UNILAG",
      type: "Federal",
      city: "Akoka, Lagos",
      cutOff: 200,
    },
    {
      slug: "ui",
      name: "University of Ibadan",
      acronym: "UI",
      type: "Federal",
      city: "Ibadan, Oyo",
      cutOff: 200,
    },
    {
      slug: "oau",
      name: "Obafemi Awolowo University",
      acronym: "OAU",
      type: "Federal",
      city: "Ile-Ife, Osun",
      cutOff: 200,
    },
    {
      slug: "abu",
      name: "Ahmadu Bello University",
      acronym: "ABU",
      type: "Federal",
      city: "Zaria, Kaduna",
      cutOff: 180,
    },
    {
      slug: "unn",
      name: "University of Nigeria",
      acronym: "UNN",
      type: "Federal",
      city: "Nsukka, Enugu",
      cutOff: 180,
    },
    {
      slug: "covenant",
      name: "Covenant University",
      acronym: "CU",
      type: "Private",
      city: "Ota, Ogun",
      cutOff: 200,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* ========================================================================= */}
      {/* Hero Section: Realistic, Honest, Student-Friendly Promise                 */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-amber-600/5 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Tagline */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
              <GraduationCapIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Official JAMB Syllabus Study Platform</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold border border-border/60">
              For 2026/2027 Candidates
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.15]">
            Stop cramming past questions. Study the syllabus topic by topic and score 280+.
          </h1>

          {/* Honest Truth Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            You cannot rush JAMB in three weeks. Preparing well takes about <strong>2 to 3 months of honest, steady practice</strong>. Cover your syllabus topic by topic, review every mistake you make, practice on the real 8-key CBT screen, and walk into your exam hall confident of admission.
          </p>

          {/* Key Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-foreground tabular-nums">280+</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Target Score
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">2-3 Months</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Honest Study Plan
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">100%</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Official Syllabus
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">Zero</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Cramming or Guessing
              </span>
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/study"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Studying the Syllabus</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/study?tab=mock-exam"
              className="px-6 py-3.5 rounded-xl bg-card hover:bg-muted text-foreground border border-border font-extrabold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalculatorIcon className="w-4 h-4 text-emerald-600" />
              <span>Practice a Timed CBT Mock</span>
            </Link>
            <Link
              href="/about"
              className="px-5 py-3.5 rounded-xl text-muted-foreground hover:text-foreground font-bold text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Why JAMB is Easy</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Real Problems Students Face & How PrepSmart Helps You Fix Them             */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Fix Common Study Mistakes
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            The Struggles Most JAMB Students Face and How to Solve Them
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pick the area where you need the most help right now to jump straight into the right part of the app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problemsAndSolutions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Step 0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block">
                      Problem: {item.problem}
                    </span>
                    <h3 className="text-base font-extrabold text-foreground leading-snug">
                      {item.solution}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>{item.cta}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* The Honest Comparison: What Fails vs. What Actually Works                 */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-border bg-muted/30 p-8 sm:p-10 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            The Honest Truth
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Why 76% of Students Score Below 200 and What You Should Do Instead
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Here is the clear difference between how students fail JAMB every year and how students prepare to clear it on their first try.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* What doesn't work */}
          <div className="rounded-2xl border border-rose-500/30 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                What Doesn&apos;t Work (Why Most Students Fail)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Buying past questions 3 weeks before the exam:</strong> Trying to memorize answers without understanding the underlying topics.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Ignoring mistakes:</strong> Checking the answer key at the back of the book, seeing you were wrong, and just moving on without understanding why.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Practicing only on paper:</strong> You walk into the CBT centre and get confused by the timer, the screen layout, and the keyboard shortcuts.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Guessing your readiness:</strong> Assuming you are ready just because you spent hours reading without testing yourself on real questions.
                </span>
              </li>
            </ul>
          </div>

          {/* What works */}
          <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                What Actually Works (How to Score 280+)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Give yourself 2 to 3 months:</strong> Take your time to cover each topic in your 4 subjects from beginning to end.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Review every single mistake:</strong> Whenever you miss a question, read the explanation and re-test yourself until you understand it.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Practice with the real 8-key CBT setup:</strong> Use the keyboard keys (A, B, C, D, N, P, R, S) and the onscreen calculator until it becomes muscle memory.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Track real numbers:</strong> Your readiness score is calculated from the questions you actually answer correctly, not guesswork.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2 to 3 Months Step-by-Step Study Plan                                     */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The 2-3 Month Study Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              How to Pace Your Preparation Step by Step
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Break down your 4 subjects into manageable monthly goals so you don&apos;t feel overwhelmed or rush at the last minute.
            </p>
          </div>
          <Link
            href="/study"
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors shrink-0 flex items-center gap-1.5 self-start"
          >
            <span>View All Syllabus Topics</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyPhases.map((phase, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-extrabold text-foreground text-lg">
                  {phase.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                  What to achieve
                </span>
                {phase.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* Departmental Streams (Science, Commercial, Arts)                          */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Select Your Department
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Curriculum Built for Your Specific Course
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Choose your department to see the exact subjects and topics you need for your chosen university course.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div
                key={stream.id}
                className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-5 transition-all ${stream.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${stream.badgeColor}`}
                    >
                      Department
                    </span>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-foreground">
                      {stream.title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {stream.tagline}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {stream.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">
                      Compulsory Subjects
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stream.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-[11px] font-medium bg-card border border-border px-2.5 py-0.5 rounded-lg text-foreground shadow-2xs"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <Link
                    href={`/study/${stream.id}`}
                    className="w-full py-2.5 rounded-xl bg-card hover:bg-muted text-foreground border border-border text-xs font-bold transition-all text-center block shadow-2xs"
                  >
                    Open {stream.title.split(" ")[0]} Topics →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* University Cut-Off Checker Callout with Real Campus Images                */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-blue-500/25 bg-linear-to-r from-blue-900/10 via-card to-indigo-900/10 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <GraduationCapIcon className="w-3.5 h-3.5" />
              <span>University Admission Counsellor</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Know the Exact Cut-Off Marks for Your Dream University
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Before you register, find out what score you need for Medicine, Law, Engineering, Accounting, or Computer Science at UNILAG, UI, OAU, UNN, ABU, and 40+ other Nigerian universities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/universities"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore All 40+ Universities</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/careers"
              className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs text-foreground transition-all text-center"
            >
              Career Guide
            </Link>
          </div>
        </div>

        {/* Featured Real Campus Images Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredUniversities.map((uni) => (
            <Link
              key={uni.slug}
              href={`/universities/${uni.slug}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-32 w-full overflow-hidden bg-muted">
                <UniversityImage
                  slug={uni.slug}
                  name={uni.name}
                  acronym={uni.acronym}
                  aspectRatio="card"
                  showLandmarkBadge={true}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 text-white border border-white/10 backdrop-blur-xs">
                  {uni.type}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="ring-2 ring-card rounded-lg shrink-0">
                    <UniversityLogo
                      slug={uni.slug}
                      name={uni.name}
                      acronym={uni.acronym}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {uni.name} ({uni.acronym})
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {uni.city}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                    Cut-Off
                  </span>
                  <span className="text-xs font-black text-foreground">
                    {uni.cutOff} pts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* The Core Conviction Banner: Direct, Inspiring & Grounded                  */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Our Honest Conviction
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            &ldquo;JAMB is easy and most likely one of the easiest exams you will take in your academic life.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The questions come strictly from the syllabus. When you give yourself 2 to 3 months of honest practice, understanding each concept and reviewing your mistakes, the exam becomes predictable and straightforward. We created PrepSmart to show you exactly how we practiced to clear our own exams.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            Read Our Story &amp; Advice
          </Link>
          <Link
            href="/study"
            className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-bold text-xs text-foreground transition-all"
          >
            Start Practicing Today
          </Link>
        </div>
      </section>
    </div>
  );
}
