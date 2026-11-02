import Link from "next/link";
import {
  GraduationCapIcon,
  BookOpenIcon,
  TargetIcon,
  FlameIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BrainIcon,
  CalculatorIcon,
  SparklesIcon,
  ShieldIcon,
  BeakerIcon,
  BriefcaseIcon,
  PaletteIcon,
  ChartBarIcon,
} from "@/components/ui/icons";

export default function Home() {
  const problemSolutions = [
    {
      problem: "Unsure what topics to study or how the syllabus is structured",
      solution: "Official JAMB Syllabus Architecture",
      description:
        "Every topic, subtopic, and learning objective strictly mapped to the official UTME syllabus across Science, Commercial, and Arts faculties.",
      href: "/study",
      cta: "Explore Official Syllabus",
      icon: BookOpenIcon,
      color: "border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
    },
    {
      problem: "Exam hall panic, poor time management, and unfamiliarity with CBT software",
      solution: "Authentic 8-Key CBT Exam Simulator",
      description:
        "Full-length 180-question timed mocks with authentic JAMB navigation hotkeys (A, B, C, D, N, P, R, S) and built-in UTME onscreen calculator.",
      href: "/study?tab=mock-exam",
      cta: "Take CBT Mock Exam",
      icon: ClockIcon,
      color: "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      problem: "Repeating the same mistakes on past questions without understanding why",
      solution: "Spaced Repetition & Error Remediation",
      description:
        "Intelligent algorithms isolate every missed question, explaining the underlying examiner traps and scheduling active-recall reviews until mastered.",
      href: "/dashboard?tab=revision",
      cta: "Open Revision Hub",
      icon: BrainIcon,
      color: "border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400",
    },
    {
      problem: "Confusion regarding university cut-off marks and subject combination prerequisites",
      solution: "University Admission & Cut-Off Directory",
      description:
        "Comprehensive screening directory covering cut-off scores, faculty quotas, and required subject combinations for all federal and state universities.",
      href: "/universities",
      cta: "Check University Cut-Offs",
      icon: GraduationCapIcon,
      color: "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
    },
    {
      problem: "Lack of study consistency, procrastination, and broken revision routines",
      solution: "Streak Guardian & Diagnostic Analytics",
      description:
        "Time-of-day browser push reminders, daily micro-targets, and mathematically calibrated readiness metrics that keep your focus sharp every day.",
      href: "/dashboard?tab=readiness",
      cta: "View Readiness Analytics",
      icon: FlameIcon,
      color: "border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
    },
    {
      problem: "Intimidated by the historical 76% failure rate of JAMB candidates in Nigeria",
      solution: "The PrepSmart Philosophy & Demystification",
      description:
        "Read why JAMB is one of the most predictable and straightforward exams in academics when approached with structured concept mastery rather than cramming.",
      href: "/about",
      cta: "Why JAMB is Easy",
      icon: ShieldIcon,
      color: "border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400",
    },
  ];

  const facultyStreams = [
    {
      id: "science",
      title: "Science & Engineering Faculty",
      tagline: "Medicine, Computing, Engineering, Pharmacy & Pure Sciences",
      subjects: ["Use of English", "Mathematics", "Physics", "Chemistry", "Biology"],
      color: "border-teal-500/30 bg-teal-500/5",
      badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
      icon: BeakerIcon,
      description:
        "Master high-frequency calculation shortcuts, balancing chemical equations, mechanics, calculus principles, and biological systems without panic.",
    },
    {
      id: "commercial",
      title: "Commercial & Management Sciences",
      tagline: "Accounting, Business Administration, Economics & Finance",
      subjects: ["Use of English", "Mathematics", "Economics", "Commerce", "Principles of Accounts"],
      color: "border-amber-500/30 bg-amber-500/5",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      icon: BriefcaseIcon,
      description:
        "Deconstruct balance sheets, elasticity of demand curves, commercial banking principles, and quantitative business reasoning with precision.",
    },
    {
      id: "arts",
      title: "Arts & Humanities Faculty",
      tagline: "Law, Mass Communication, International Relations & Literature",
      subjects: ["Use of English", "Literature in English", "Government", "CRS/IRS", "History"],
      color: "border-purple-500/30 bg-purple-500/5",
      badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
      icon: PaletteIcon,
      description:
        "Analyse prescribed literary texts, constitutional history, grammar mechanics, figures of speech, and geopolitical institutions methodically.",
    },
  ];

  const pedagogyWeeks = [
    {
      week: "Week 01",
      title: "Foundations & Axioms",
      description:
        "Establish core definitions, fundamental formulas, grammatical syntax, and governing principles across all 4 subjects.",
      outcomes: ["Formula derivation tables", "Grammar & comprehension rules", "First-principles diagnostics"],
    },
    {
      week: "Week 02",
      title: "Mechanisms & Synthesis",
      description:
        "Connect foundational knowledge to complex mechanisms, reaction pathways, economic models, and textual analyses.",
      outcomes: ["Cross-topic synthesis", "Conceptual error-mapping", "Mid-term milestone quiz"],
    },
    {
      week: "Week 03",
      title: "Examiner Trap Deconstruction",
      description:
        "Dissect the recurring distractor patterns used by UTME examiners over the past 20 years to avoid common pitfalls.",
      outcomes: ["Distractor neutralization", "Speed calculation techniques", "Subject mastery benchmark"],
    },
    {
      week: "Week 04",
      title: "Full CBT Simulation & Readiness",
      description:
        "Execute timed 180-question simulations under genuine exam conditions to calibrate pacing and mental endurance.",
      outcomes: ["Authentic 8-key muscle memory", "Readiness index verification", "Peak score confidence"],
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* ========================================================================= */}
      {/* Scholarly Hero Section: Purpose, Outcomes & Integrated Problem Solvers     */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-linear-to-tr from-amber-600/5 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Institutional Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-950/60 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-widest">
              <GraduationCapIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Official 4-Week JAMB Curriculum Platform</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-muted/80 text-muted-foreground text-xs font-semibold border border-border/60">
              Session 2026/2027 Academic Cycle
            </span>
          </div>

          {/* Master Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
            Master the JAMB UTME with the Academic Rigor of the World&apos;s Best Educational Institutions.
          </h1>

          {/* Academic Mission Description */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Over 1.4 million candidates score below 200 every year because of passive cramming, unfamiliarity with CBT software, and unorganized reading. PrepSmart replaces cramming with a faculty-structured 28-day curriculum: active recall, syllabus mastery, and authentic timed CBT simulations designed to secure 280+ to 340+ UTME scores.
          </p>

          {/* Target Outcomes Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-foreground tabular-nums">280+</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Target Score Benchmark
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">28 Days</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Curriculum Duration
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">100%</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Official Syllabus Match
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/70">
              <span className="block text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">0%</span>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                Guesswork or Cramming
              </span>
            </div>
          </div>

          {/* Primary Action Row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/study"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore 4-Week Curriculum</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/study?tab=mock-exam"
              className="px-6 py-3.5 rounded-xl bg-card hover:bg-muted text-foreground border border-border font-extrabold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <CalculatorIcon className="w-4 h-4 text-emerald-600" />
              <span>Take Full-Length CBT Mock</span>
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
      {/* Problem-to-Solution Architecture: Direct Paths for Every Student Struggle */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Intelligent Problem Resolution
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            How PrepSmart Solves the Core Roadblocks of Every UTME Candidate
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select the specific academic or technical challenge you are currently facing to access the direct tool engineered to resolve it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problemSolutions.map((item, index) => {
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
                      Module 0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block">
                      Struggle: {item.problem}
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
      {/* Comparative Pedagogy: Passive Cramming vs. The PrepSmart Method           */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-border bg-muted/30 p-8 sm:p-10 space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Cognitive Science Behind The System
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Why Traditional Revision Fails and How Our Framework Guarantees Results
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Comparison between how 76% of Nigerian students traditionally study versus the cognitive learning model deployed in PrepSmart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Traditional Method */}
          <div className="rounded-2xl border border-rose-500/30 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                The Traditional Path (76% Sub-200 Failure)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Passive Reading:</strong> Reading voluminous past question pamphlets from cover to cover without active recall or testing under timed stress.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Unclassified Error Cycles:</strong> Checking answers at the back of the book without understanding the underlying distractor trap designed by the examiner.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>CBT Software Disorientation:</strong> Walking into the exam centre having never practiced with the official 8-key keyboard navigation and onscreen calculator.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-rose-500 shrink-0">•</span>
                <span>
                  <strong>Uncalibrated Score Confidence:</strong> Assuming readiness based on feeling rather than mathematically verified mastery per syllabus topic.
                </span>
              </li>
            </ul>
          </div>

          {/* PrepSmart Method */}
          <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <h3 className="text-base font-extrabold text-foreground">
                The PrepSmart Method (280+ Admission Blueprint)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Structured 4-Week Modular Progression:</strong> Every day tackles specific syllabus modules with measurable objectives across all 4 subjects.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated Spaced Repetition:</strong> Questions answered incorrectly are systematically queued and resurfaced until recall is proven.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>High-Fidelity CBT Muscle Memory:</strong> Practice full mocks with the identical 8-key system (A, B, C, D, N, P, R, S) and onscreen scientific calculator.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Empirically Grounded Readiness:</strong> Real database analytics compute your true projected UTME score based on actual recorded answers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4-Week Academic Curriculum Blueprint                                      */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The 28-Day Syllabus Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              A 4-Week Sequential Masterplan for Every Candidate
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              From foundational axioms to final exam simulations, each week builds the mental agility and pacing required to excel.
            </p>
          </div>
          <Link
            href="/study"
            className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors shrink-0 flex items-center gap-1.5 self-start"
          >
            <span>View Complete Syllabus Breakdown</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pedagogyWeeks.map((w, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {w.week}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-extrabold text-foreground text-base">
                  {w.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {w.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                  Learning Deliverables
                </span>
                {w.outcomes.map((outcome, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CheckCircleIcon className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 Specialized Faculty Programs (Departmental Streams)                    */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Targeted Faculty Curricula
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Specialized Preparation for Your Specific University Course
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Choose your departmental faculty to access subject combinations and syllabus modules specifically tuned to high-demand Nigerian degree programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facultyStreams.map((faculty) => {
            const Icon = faculty.icon;
            return (
              <div
                key={faculty.id}
                className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-5 transition-all ${faculty.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${faculty.badgeColor}`}
                    >
                      Faculty Division
                    </span>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-foreground">
                      {faculty.title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">
                      {faculty.tagline}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {faculty.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block mb-2">
                      Core Subject Combinations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {faculty.subjects.map((sub) => (
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
                    href={`/study/${faculty.id}`}
                    className="w-full py-2.5 rounded-xl bg-card hover:bg-muted text-foreground border border-border text-xs font-bold transition-all text-center block shadow-2xs"
                  >
                    Enter {faculty.title.split(" ")[0]} Faculty Hub →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* University Directory & Cut-Off Guidance Teaser                             */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-blue-500/25 bg-linear-to-r from-blue-900/10 via-card to-indigo-900/10 p-8 sm:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
              <GraduationCapIcon className="w-3.5 h-3.5" />
              <span>National University Admissions Engine</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Know Exact General &amp; Departmental Cut-Off Marks Before You Register
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Don&apos;t apply blindly. Search cut-off requirements for UNILAG, UI, OAU, UNN, ABU, and 40+ other accredited federal and state institutions, verify prerequisites, and evaluate your admission probability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/universities"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Universities &amp; Cut-Offs</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/careers"
              className="px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs text-foreground transition-all text-center"
            >
              Career Mapping Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* The Founder's Conviction Banner                                           */}
      {/* ========================================================================= */}
      <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            The PrepSmart Conviction
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            &ldquo;JAMB is easy and most likely one of the easiest exams you may take in academics.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The examiners draw from a strict, finite syllabus. When you practice the exact concepts rather than guessing past questions, the questions become transparent and predictable. We created PrepSmart using the exact preparation strategies we used to excel.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            Read Our Full Philosophy &amp; Historical Breakdown
          </Link>
          <Link
            href="/study"
            className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-bold text-xs text-foreground transition-all"
          >
            Start Preparing Today
          </Link>
        </div>
      </section>
    </div>
  );
}
