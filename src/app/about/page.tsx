import type { Metadata } from "next";
import Link from "next/link";
import {
  SparklesIcon,
  BrainIcon,
  RefreshCwIcon,
  ClockIcon,
  TargetIcon,
  AlertTriangleIcon,
  EyeIcon,
  BookOpenIcon,
  CheckCircleIcon,
  LightbulbIcon,
  RocketIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About Us — Helping Nigerian Students Clear JAMB UTME | PrepSmart",
  description:
    "The story, conviction, and study routine behind PrepSmart. Learn why so many candidates struggle, why JAMB is one of the most predictable exams to pass, and how our team practiced to excel.",
  keywords: [
    "About PrepSmart",
    "JAMB failure statistics Nigeria",
    "JAMB is easy",
    "How to pass JAMB",
    "UTME 300+ score strategy",
    "Nigerian education CBT",
  ],
};

export default function AboutPage() {
  const stats = [
    {
      value: "1.9M+",
      label: "Annual Candidates",
      detail: "Nigerian secondary school leavers sitting for UTME each year",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    },
    {
      value: "76.8%",
      label: "Historical Failure Rate",
      detail: "Candidates scoring below 200 out of 400 nationwide",
      color: "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
    },
    {
      value: "< 1.5%",
      label: "Scoring 300+",
      detail: "A tiny minority reaching top percentiles due to broken study habits",
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    },
    {
      value: "280+",
      label: "PrepSmart Target",
      detail: "The realistic benchmark when students switch to active recall",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
  ];

  const pillars = [
    {
      icon: BrainIcon,
      title: "Active Recall over Passive Reading",
      description:
        "Rereading dense textbooks creates an illusion of competence. We practiced by forcing ourselves to retrieve answers under exam constraints with immediate examiner rationale.",
    },
    {
      icon: RefreshCwIcon,
      title: "Spaced Repetition Queue",
      description:
        "Every question you miss shouldn't disappear. Our creators kept a personal 'Error Log' that resurfaced tricky concepts at spaced intervals until they became second nature.",
    },
    {
      icon: ClockIcon,
      title: "CBT Pacing & Pressure Conditioning",
      description:
        "180 questions in 120 minutes is 40 seconds per question. We trained our internal biological clock so the official exam day felt like just another rehearsal session.",
    },
    {
      icon: TargetIcon,
      title: "Syllabus Boundary Mastery",
      description:
        "JAMB is legally bounded by its official syllabus. We mapped every question back to core concepts rather than memorizing random question letters that change every year.",
    },
  ];

  const comparisons = [
    {
      myth: "JAMB is a merciless trap meant to weed out millions.",
      truth:
        "JAMB is strictly multiple-choice with a finite syllabus. The correct answer is guaranteed to be right on your screen.",
    },
    {
      myth: "You must cram thousands of past question letters (A, B, C, D).",
      truth:
        "Examiners intentionally shuffle options and invert stems. Understanding the 108 syllabus concepts makes options irrelevant.",
    },
    {
      myth: "Only students with extraordinary natural brilliance can score 320+.",
      truth:
        "Standardized test scores are a trainable mechanical skill. Structured practice beats raw talent every single time.",
    },
    {
      myth: "Expensive physical miracle centers hold the secret keys to admission.",
      truth:
        "The real secret is authentic CBT simulations, immediate explanation feedback, and spaced mastery of past failures.",
    },
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-600/10 via-background to-background border border-border p-8 sm:p-14 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
          <SparklesIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>The PrepSmart Manifesto</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
          Making JAMB UTME Clear and Straightforward for Every Nigerian Student.
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Over 76% of Nigerian JAMBites fail to cross 200 every year—not because they lack
          intelligence, but because they are taught to prepare the wrong way. We built PrepSmart
          to show you why <span className="text-foreground font-semibold">JAMB is actually one of the easiest academic exams</span> you will ever write, and how we practiced to conquer it.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/study"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Explore Unified Study & CBT Hub →
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-card hover:bg-muted border border-border text-foreground font-bold text-sm transition-all cursor-pointer"
          >
            Go to Candidate Dashboard
          </Link>
        </div>
      </section>

      {/* 2. The Hard Reality: Historical Statistics */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            The Historical Reality of JAMBites in Nigeria
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Decade after decade, millions of ambitious Nigerian candidates sit for the UTME with high hopes, only to be heartbroken by predictable roadblocks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-card border ${item.color.split(" ")[3]} flex flex-col justify-between space-y-4 shadow-xs transition-transform hover:-translate-y-1`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <div className={`text-4xl font-black ${item.color.split(" ")[2]}`}>
                  {item.value}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Why Millions Struggle Every Single Year</span>
          </h3>
          <p>
            In Nigerian academic history, the Unified Tertiary Matriculation Examination has developed an almost mythical reputation as a fearsome monster. Students spend months cramming thousand-page textbooks, paying exorbitant fees for miracle centers, or staying awake late into the night memorizing past questions from 1983.
          </p>
          <p>
            Yet when exam day arrives in a crowded CBT center, the clock begins ticking mercilessly. Panic sets in, trick options lure candidates into traps, and when the results drop, more than three out of every four students find themselves stranded below the 200 cutoff benchmark.
          </p>
          <p className="text-foreground font-semibold">
            This is not an intellectual failure of Nigerian youth. It is a failure of preparation methodology.
          </p>
        </div>
      </section>

      {/* 3. The Core Conviction: "JAMB is Easy" */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500/10 via-card to-blue-500/10 border-2 border-emerald-500/30 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider">
          Our Unapologetic Core Conviction
        </div>

        <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground max-w-4xl mx-auto leading-tight tracking-tight">
          &ldquo;JAMB is easy and most likely one of the easiest exams you may take in academics.&rdquo;
        </blockquote>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Hear us clearly: Compared to university semester exams where you must draft 6-page essays from memory, WAEC practicals, or medical boards, JAMB is remarkably structured, transparent, and winnable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-4 max-w-4xl mx-auto">
          <div className="p-5 rounded-xl bg-background/80 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <EyeIcon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">The Answer is on the Screen</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are never asked to invent solutions from a blank canvas. One of options A, B, C, or D is 100% correct. You are recognizing, not recreating.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-background/80 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <BookOpenIcon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">A Strictly Bounded Syllabus</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              JAMB is legally prohibited from testing outside its published curriculum. Every question tests a known, finite list of concepts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-background/80 border border-border space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Zero Subjective Bias</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No marker penalizes poor handwriting, no examiner holds personal grudges. A computer checks whether option B matches option B.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Creators' Story */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            From Candidates to Creators
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How We Practiced to Excel in Our Own JAMB Exams
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We are not detached academic researchers. We are Nigerian scholars who sat in the very same test centers you are preparing for today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="p-7 sm:p-8 rounded-2xl bg-card border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <LightbulbIcon className="w-7 h-7 text-amber-500" />
              <h3 className="text-xl font-bold text-foreground">The Epiphany of Deliberate Practice</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When we prepared for our UTME, we realized early on that reading our textbooks from cover to cover made us feel smart but performed terribly on CBT mock timers.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We stopped reading passively. Instead, we built physical flashcards, categorized past questions by syllabus concepts, timed ourselves with stopwatches, and logged every missed question into a &ldquo;Revision Hub&rdquo; that we revisited every 48 hours.
              </p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">The Result:</span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                99th Percentile Admission Scores
              </span>
            </div>
          </div>

          <div className="p-7 sm:p-8 rounded-2xl bg-card border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <RocketIcon className="w-7 h-7 text-blue-500" />
              <h3 className="text-xl font-bold text-foreground">Why We Built PrepSmart</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We saw our friends, younger siblings, and thousands of brilliant candidates repeating JAMB year after year simply because nobody showed them the system.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                PrepSmart was built using the exact study routine we used to clear our exams. We automated the Spaced Repetition Queue, added examiner trap alerts, integrated authentic 120-minute CBT calculators, and created a step-by-step syllabus roadmap so any student in Nigeria can follow the same winning routine.
              </p>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Our Mission:</span>
              <span className="px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">
                100,000+ Students Scoring 280+
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of the PrepSmart Practice System */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-extrabold text-foreground text-center">
            The 4 Pillars of the PrepSmart Method
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, i) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-card border border-border space-y-2.5 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <PillarIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{pillar.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Myths vs Truths */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Separating UTME Myths from Mathematical Truth
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Stop listening to street myths. Here is what actually dictates your score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card border border-border space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider shrink-0 mt-0.5">
                  Myth
                </span>
                <p className="text-xs text-muted-foreground line-through decoration-rose-500/40">
                  {c.myth}
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1 border-t border-border/60">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider shrink-0 mt-0.5">
                  Truth
                </span>
                <p className="text-xs text-foreground font-semibold leading-relaxed">
                  {c.truth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. High-Impact Call to Action */}
      <section className="rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-blue-500/10">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Your University Admission Journey Begins Today.
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Stop leaving your future to chance or fear. Join thousands of Nigerian candidates mastering the syllabus, banishing CBT anxiety, and achieving their dream scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/study"
            className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Start Practicing in Study Hub →
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer"
          >
            View Candidate Command Center
          </Link>
        </div>
      </section>
    </div>
  );
}
