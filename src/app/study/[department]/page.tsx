import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  mathematicsSyllabus,
  physicsSyllabus,
  chemistrySyllabus,
  biologySyllabus,
  useOfEnglishSyllabus,
} from "@/data/syllabuses";

export const instant = false;

export function generateStaticParams() {
  return [
    { department: "science" },
    { department: "commercial" },
    { department: "arts" },
  ];
}

interface PageProps {
  params: Promise<{ department: string }>;
}

interface SubjectDetail {
  id: string;
  name: string;
  code: string;
  questionsCount: number;
  topicsCount: number;
  badge: string;
  overview: string;
  highYieldTopics: string[];
  week1Focus: string;
  drillTopicId: string;
}

interface DepartmentData {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  targetScore: string;
  studyTime: string;
  faculties: string[];
  accentBorder: string;
  accentBg: string;
  accentBadge: string;
  accentText: string;
  subjects: SubjectDetail[];
  examinerTraps: Array<{ title: string; explanation: string }>;
  weeklyGoals: Array<{
    week: number;
    title: string;
    focus: string;
    target: string;
  }>;
}

// Map actual syllabus data for science stream
const mathTopicCount =
  mathematicsSyllabus.sections?.reduce(
    (acc, sec) => acc + (sec.topics?.length || 0),
    0
  ) ?? 23;

const bioTopicCount =
  biologySyllabus.sections?.reduce(
    (acc, sec) => acc + (sec.topics?.length || 0),
    0
  ) ?? 24;

const physicsTopicCount = physicsSyllabus.topics?.length ?? 40;
const chemTopicCount = chemistrySyllabus.topics?.length ?? 18;

const departmentsMap: Record<string, DepartmentData> = {
  science: {
    id: "science",
    title: "Science & Technology",
    tagline:
      "Comprehensive 4-week UTME preparation for Medicine, Engineering, Computer Science, and Pure Sciences.",
    badge: "STEM Stream",
    targetScore: "310+ Target",
    studyTime: "2.5 hrs / day",
    faculties: [
      "Medicine & Surgery",
      "Mechanical & Electrical Eng.",
      "Computer Science & AI",
      "Pharmacy",
      "Biochemistry",
    ],
    accentBorder: "border-teal-200 dark:border-teal-900/60",
    accentBg: "bg-teal-50/50 dark:bg-teal-950/20",
    accentBadge:
      "bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    accentText: "text-teal-700 dark:text-teal-400",
    subjects: [
      {
        id: "english",
        name: "Use of English",
        code: "ENG",
        questionsCount: 60,
        topicsCount: 3,
        badge: "Compulsory",
        overview:
          "Comprehension passages, Lexis and structure, Sentence interpretation, Antonyms/Synonyms, and Oral English.",
        highYieldTopics: [
          "Comprehension & Inference",
          "Lexis & Register",
          "Stress Patterns & Vowel Contrast",
          "Idiomatic Expressions",
        ],
        week1Focus: "Passage skimming strategies and vowel/consonant sound contrasts",
        drillTopicId: "use-of-english",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        code: "MTH",
        questionsCount: 40,
        topicsCount: mathTopicCount,
        badge: "Core STEM",
        overview:
          "Algebra, Coordinate Geometry, Trigonometry, Matrices, Calculus (Differentiation & Integration), and Probability.",
        highYieldTopics: [
          "Calculus & Curve Gradients",
          "Matrices & Determinants",
          "Trigonometric Identities",
          "Geometric Progression (G.P)",
        ],
        week1Focus: "Number bases, Indices, Logarithms, Surds, and Set operations",
        drillTopicId: "mathematics",
      },
      {
        id: "physics",
        name: "Physics",
        code: "PHY",
        questionsCount: 40,
        topicsCount: physicsTopicCount,
        badge: "Calculation Heavy",
        overview:
          "Mechanics, Projectile Motion, Heat Energy, Wave Optics, Electricity & Magnetism, Atomic & Modern Physics.",
        highYieldTopics: [
          "Equations of Motion & Work-Energy",
          "Simple Harmonic Motion (SHM)",
          "Electric Circuits & Kirchhoff's Laws",
          "Radioactivity & Half-life",
        ],
        week1Focus: "Dimensions, Scalar/Vector resolution, Uniform acceleration & friction",
        drillTopicId: "physics",
      },
      {
        id: "chemistry",
        name: "Chemistry",
        code: "CHM",
        questionsCount: 40,
        topicsCount: chemTopicCount,
        badge: "Formula & Concept",
        overview:
          "Atomic structure, Periodic trends, Stoichiometry, Acid-Base titrations, Electrochemistry, and Organic Chemistry.",
        highYieldTopics: [
          "Mole Concept & Gas Laws",
          "Equilibrium Constants & Le Chatelier",
          "Redox & Electrolysis Calculations",
          "Hydrocarbons & Functional Groups",
        ],
        week1Focus: "Separation techniques, Atomic theory, and Chemical bonding",
        drillTopicId: "chemistry",
      },
      {
        id: "biology",
        name: "Biology",
        code: "BIO",
        questionsCount: 40,
        topicsCount: bioTopicCount,
        badge: "Diagnostic Recall",
        overview:
          "Cell structure, Nutrient cycling, Plant/Animal physiology, Genetics & Heredity, Ecology, and Evolution.",
        highYieldTopics: [
          "Mendelian Genetics & Pedigrees",
          "Photosynthesis & Respiration",
          "Circulatory & Excretory Systems",
          "Ecosystem Dynamics & Food Webs",
        ],
        week1Focus: "Cellular organization, Microorganisms, and Classification of living things",
        drillTopicId: "biology",
      },
    ],
    weeklyGoals: [
      {
        week: 1,
        title: "Foundation & Core Equations",
        focus: "Dimensional analysis, molar masses, SI conversions, cell structures, and base laws.",
        target: "Master top 25 formulas and achieve 80%+ on daily exit quizzes.",
      },
      {
        week: 2,
        title: "Mechanisms & Systems",
        focus: "Chemical reaction pathways, electrical networks, anatomical systems, and trigonometry.",
        target: "Complete 150 topic-focused drill questions with instant rationale review.",
      },
      {
        week: 3,
        title: "Calculations & Speed Tactics",
        focus: "Multi-step thermodynamics, calculus applications, genetics ratios, and time-saving shortcuts.",
        target: "Reduce average question answering time from 90 seconds to 45 seconds.",
      },
      {
        week: 4,
        title: "UTME Simulation & Examiner Traps",
        focus: "Past 10-year question patterns, negative phrasing ('EXCEPT', 'NOT'), and mock exams.",
        target: "Sit two full 400-point timed simulation mocks under exam conditions.",
      },
    ],
    examinerTraps: [
      {
        title: "Hidden Unit Mismatches",
        explanation:
          "JAMB frequently mixes cm with m, or grams with kilograms in physics and chemistry calculation questions. Always check SI units first.",
      },
      {
        title: "Inverse & Double-Negative Phrasing",
        explanation:
          "Watch out for questions ending with 'all the following are correct EXCEPT' or 'which is LEAST likely'. Circle key qualifiers immediately.",
      },
      {
        title: "Common Chemistry Byproduct Distractors",
        explanation:
          "In organic chemistry and gas preparation, examiners place secondary byproducts in options A and B to trick hurried candidates.",
      },
    ],
  },

  commercial: {
    id: "commercial",
    title: "Commercial & Social Sciences",
    tagline:
      "Structured syllabus mastery for Accounting, Economics, Business Administration, and Banking & Finance.",
    badge: "Business Stream",
    targetScore: "295+ Target",
    studyTime: "2 hrs / day",
    faculties: [
      "Accounting & Finance",
      "Economics & Econometrics",
      "Business Administration",
      "Marketing",
      "Banking & Insurance",
    ],
    accentBorder: "border-amber-200 dark:border-amber-900/60",
    accentBg: "bg-amber-50/50 dark:bg-amber-950/20",
    accentBadge:
      "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    accentText: "text-amber-700 dark:text-amber-400",
    subjects: [
      {
        id: "english",
        name: "Use of English",
        code: "ENG",
        questionsCount: 60,
        topicsCount: 3,
        badge: "Compulsory",
        overview:
          "Comprehension passages on economic & social trends, grammatical rules, register of business, and oral forms.",
        highYieldTopics: [
          "Business Register & Lexis",
          "Summary & Central Ideas",
          "Sentence Structure & Agreement",
          "Vowels & Syllabic Stress",
        ],
        week1Focus: "Passage extraction techniques and basic grammatical concord",
        drillTopicId: "use-of-english",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        code: "MTH",
        questionsCount: 40,
        topicsCount: mathTopicCount,
        badge: "Analytical",
        overview:
          "Commercial arithmetic, compound interest, linear inequalities, probability, statistics, and matrices.",
        highYieldTopics: [
          "Compound Interest & Depreciation",
          "Statistics (Mean, Variance, Ogive)",
          "Linear Programming",
          "Probability Distributions",
        ],
        week1Focus: "Percentages, Ratios, Number systems, and Simple/Compound Interest",
        drillTopicId: "mathematics",
      },
      {
        id: "economics",
        name: "Economics",
        code: "ECO",
        questionsCount: 40,
        topicsCount: 16,
        badge: "Core Discipline",
        overview:
          "Price mechanism, Elasticity of demand/supply, Market structures, National income accounting, and Inflation.",
        highYieldTopics: [
          "Elasticity of Demand & Supply",
          "National Income & Multiplier",
          "Fiscal & Monetary Policies",
          "International Trade & Balance of Payments",
        ],
        week1Focus: "Basic economic concepts, Production possibility frontier (PPF), and utility theory",
        drillTopicId: "economics",
      },
      {
        id: "commerce",
        name: "Commerce",
        code: "COM",
        questionsCount: 40,
        topicsCount: 15,
        badge: "Practical Trade",
        overview:
          "Aids to trade, Banking systems, Insurance principles, Stock exchange, Consumer protection, and e-Commerce.",
        highYieldTopics: [
          "Wholesale & Retail Channels",
          "Stock Exchange & Capital Markets",
          "Insurance Principles & Utmost Good Faith",
          "Business Organizations & Mergers",
        ],
        week1Focus: "Evolution of commerce, Divisions of trade, and Sole proprietorship vs Partnerships",
        drillTopicId: "commerce",
      },
      {
        id: "accounting",
        name: "Principles of Accounts",
        code: "ACC",
        questionsCount: 40,
        topicsCount: 14,
        badge: "Financial Core",
        overview:
          "Double entry bookkeeping, Trial balance errors, Bank reconciliation, Final accounts, and Partnership accounts.",
        highYieldTopics: [
          "Bank Reconciliation Statements",
          "Correction of Errors & Suspense A/C",
          "Manufacturing Accounts & Profit/Loss",
          "Partnership Goodwill & Dissolution",
        ],
        week1Focus: "Double-entry rules, Books of original entry, and Ledger postings",
        drillTopicId: "accounting",
      },
    ],
    weeklyGoals: [
      {
        week: 1,
        title: "Accounting & Economic Foundations",
        focus: "Ledger posting, double-entry, demand/supply curves, and trade definitions.",
        target: "Master basic balance sheet equations and elasticity formulas.",
      },
      {
        week: 2,
        title: "Market Structures & Reconciliation",
        focus: "Monopoly vs perfect competition, bank reconciliation adjustments, and stock exchange trading.",
        target: "Solve 120 practice questions across Accounts and Economics.",
      },
      {
        week: 3,
        title: "Analytical Problem Solving",
        focus: "National income multipliers, depreciation methods, and commercial mathematics speed drills.",
        target: "Attain 85%+ accuracy on calculations without calculator reliance.",
      },
      {
        week: 4,
        title: "Past Questions & Full Simulation",
        focus: "10-year JAMB past questions, tricky trial balance scenarios, and full timed mocks.",
        target: "Complete two full 4-subject simulated examinations.",
      },
    ],
    examinerTraps: [
      {
        title: "Suspense Account Distortions",
        explanation:
          "Errors that do NOT affect the trial balance (such as compensating errors or omission) are frequently tested as trick questions.",
      },
      {
        title: "Shift vs Movement in Demand Curves",
        explanation:
          "A change in price causes movement along the curve, while non-price determinants shift the entire curve. Examiners test this wording heavily.",
      },
      {
        title: "Net Profit vs Gross Profit Calculations",
        explanation:
          "Pay close attention to whether the question asks for Gross Profit margin, Net Profit percentage, or Markup on Cost.",
      },
    ],
  },

  arts: {
    id: "arts",
    title: "Arts & Humanities",
    tagline:
      "Deep literary analysis, constitutional history, and humanities syllabus for Law, Mass Communication, and Performing Arts.",
    badge: "Humanities Stream",
    targetScore: "290+ Target",
    studyTime: "2 hrs / day",
    faculties: [
      "Faculty of Law (LL.B)",
      "Mass Communication & Media",
      "International Relations & Diplomacy",
      "Theater & Film Studies",
      "Philosophy & Linguistics",
    ],
    accentBorder: "border-purple-200 dark:border-purple-900/60",
    accentBg: "bg-purple-50/50 dark:bg-purple-950/20",
    accentBadge:
      "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    accentText: "text-purple-700 dark:text-purple-400",
    subjects: [
      {
        id: "english",
        name: "Use of English",
        code: "ENG",
        questionsCount: 60,
        topicsCount: 3,
        badge: "Compulsory",
        overview:
          "High-level literary and expository passages, figurative language, lexis, clause analysis, and oral phonetics.",
        highYieldTopics: [
          "Literary Devices & Figures of Speech",
          "Lexis, Synonyms & Antonyms",
          "Complex Sentence Structural Analysis",
          "Vowels, Consonants & Rhyme Schemes",
        ],
        week1Focus: "Tone, mood, stylistic analysis in comprehension, and concord rules",
        drillTopicId: "use-of-english",
      },
      {
        id: "literature",
        name: "Literature in English",
        code: "LIT",
        questionsCount: 40,
        topicsCount: 18,
        badge: "Prescribed Texts",
        overview:
          "Prescribed African and Non-African prose, drama, poetry, literary appreciation, and thematic critiques.",
        highYieldTopics: [
          "Prescribed Shakespearean Drama & Motifs",
          "African Drama & Cultural Clashes",
          "African Poetry Themes & Stanzaic Forms",
          "Poetic Devices (Metaphor, Irony, Oxymoron)",
        ],
        week1Focus: "Character breakdown, plots, and major dramatic conflicts of set texts",
        drillTopicId: "literature",
      },
      {
        id: "government",
        name: "Government",
        code: "GOV",
        questionsCount: 40,
        topicsCount: 16,
        badge: "Civic & State",
        overview:
          "Forms of government, political ideologies, Nigerian constitutional development (1922 to 1999), and foreign policy.",
        highYieldTopics: [
          "Pre-Colonial Political Systems (Hausa, Yoruba, Igbo)",
          "Clifford, Richards & Macpherson Constitutions",
          "Public Administration & Civil Service",
          "Nigeria's Role in ECOWAS, AU, and UN",
        ],
        week1Focus: "Sovereignty, Rule of Law, Separation of Powers, and Pre-colonial systems",
        drillTopicId: "government",
      },
      {
        id: "crs",
        name: "Christian / Islamic Studies",
        code: "REL",
        questionsCount: 40,
        topicsCount: 15,
        badge: "Ethics & History",
        overview:
          "Scriptural narratives, the prophetic books, moral governance, faith trials, and contemporary ethical challenges.",
        highYieldTopics: [
          "Covenant, Faith & Obedience Narratives",
          "Prophetic Teachings on Social Justice",
          "Early Church Leadership / Caliphate History",
          "Ethical Decisions in Modern Society",
        ],
        week1Focus: "Early history, scriptural context, and major prophetic callings",
        drillTopicId: "religion",
      },
      {
        id: "history",
        name: "History",
        code: "HIS",
        questionsCount: 40,
        topicsCount: 14,
        badge: "Historical Context",
        overview:
          "Pre-colonial trade routes, colonial conquest and resistance, nationalism, and independent governance challenges.",
        highYieldTopics: [
          "Trans-Saharan & Coastal Trade Dynamics",
          "Colonial Amalgamation of 1914 & Impact",
          "Nationalist Movements & Independence 1960",
          "Post-Independence Republics & Military Eras",
        ],
        week1Focus: "Ancient kingdoms (Kanem-Borno, Oyo, Benin) and trade contacts",
        drillTopicId: "history",
      },
    ],
    weeklyGoals: [
      {
        week: 1,
        title: "Prescribed Texts & Constitutional Roots",
        focus: "Character arcs in prose, dramatic conflicts, 1922-1946 constitutions, and rule of law.",
        target: "Complete full summaries and thematic outlines for all prescribed texts.",
      },
      {
        week: 2,
        title: "Poetic Appreciation & Pre-Colonial Systems",
        focus: "Stanza dissection, sound devices, comparison of Yoruba/Igbo/Hausa pre-colonial states.",
        target: "Master 50 high-frequency literary devices with practical examples.",
      },
      {
        week: 3,
        title: "Foreign Policy & Thematic Cross-Examination",
        focus: "Nigeria in international organizations, modern civil service, and subtle quote attributions.",
        target: "Practice 150 past exam questions with 90%+ target accuracy.",
      },
      {
        week: 4,
        title: "Full Mocks & Speed Analysis",
        focus: "Context questions in literature, elimination of distractor options in government, and mock drills.",
        target: "Take two complete timed mocks under timed CBT conditions.",
      },
    ],
    examinerTraps: [
      {
        title: "Quote Attribution in Literature",
        explanation:
          "JAMB often quotes a single line from prescribed drama and asks 'Who said this to whom and under what condition?' Know speaker contexts thoroughly.",
      },
      {
        title: "Constitutional Date & Feature Confusion",
        explanation:
          "Examiners love to mix up features of the 1954 Lyttelton Constitution (first federal constitution) with the 1960 Independence Constitution.",
      },
      {
        title: "Poetic Tone vs Mood Distinction",
        explanation:
          "Tone is the author's attitude towards the subject; mood is the emotional atmosphere created for the reader. Don't confuse the two.",
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { department } = await params;
  const deptKey = department.toLowerCase();
  const data = departmentsMap[deptKey];

  if (!data) {
    return {
      title: "Department Curriculum - Prepsmart",
      description: "Explore the structured 4-week JAMB/UTME curriculum by department.",
    };
  }

  return {
    title: `${data.title} Curriculum - Prepsmart JAMB 2026`,
    description: `${data.tagline} Structured 4-week syllabus, topic breakdown, and high-yield CBT drills.`,
  };
}

export default async function DepartmentStudyPage({ params }: PageProps) {
  const { department } = await params;
  const deptKey = department.toLowerCase();
  const deptData = departmentsMap[deptKey];

  // If department does not match known stream, trigger not-found
  if (!deptData) {
    notFound();
  }

  const totalTopics = deptData.subjects.reduce((acc, sub) => acc + sub.topicsCount, 0);

  return (
    <div className="space-y-10">
      {/* Hero Stream Banner */}
      <section
        className={`border rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all duration-200 ${deptData.accentBorder} ${deptData.accentBg}`}
      >
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${deptData.accentBadge}`}
            >
              {deptData.badge}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-card border border-border text-foreground shadow-2xs">
              {deptData.targetScore}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-card border border-border text-muted-foreground shadow-2xs">
              ⏱ {deptData.studyTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {deptData.title}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
            {deptData.tagline}
          </p>

          {/* Target Faculties Chips */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Common University Target Faculties:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {deptData.faculties.map((fac) => (
                <span
                  key={fac}
                  className="text-xs font-medium bg-card/90 dark:bg-card/70 border border-border px-2.5 py-1 rounded-lg text-foreground shadow-2xs"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* High-Level Overview Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Subjects in Stream</span>
          <div className="text-2xl font-black text-foreground">{deptData.subjects.length}</div>
          <p className="text-[11px] text-muted-foreground">Compulsory UTME comb.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">High-Yield Topics</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {totalTopics}+
          </div>
          <p className="text-[11px] text-muted-foreground">Official syllabus modules</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Preparation Plan</span>
          <div className="text-2xl font-black text-foreground">4 Weeks</div>
          <p className="text-[11px] text-muted-foreground">Foundation to Mock Mocks</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Benchmark Readiness</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {deptData.targetScore}
          </div>
          <p className="text-[11px] text-muted-foreground">Competitive cut-off</p>
        </div>
      </section>

      {/* 4-Week Milestone Roadmap */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              4-Week Syllabus Roadmap
            </h2>
            <p className="text-xs text-muted-foreground">
              Weekly progress milestones engineered for progressive mastery and active recall.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 self-start sm:self-auto">
            100% Syllabus Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deptData.weeklyGoals.map((wk) => (
            <div
              key={wk.week}
              className="bg-card border border-border rounded-2xl p-5 shadow-2xs space-y-2 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground">
                    Week {wk.week}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Phase {wk.week}/4
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground leading-snug">
                  {wk.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {wk.focus}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                  Milestone Target
                </span>
                <p className="text-[11px] font-medium text-foreground">
                  {wk.target}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Subject Breakdown Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              Department Subjects & Modules
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore syllabus requirements, topic counts, and launch targeted topic drills.
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {deptData.subjects.length} Subjects Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deptData.subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3.5">
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center justify-center">
                    {sub.code}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {sub.questionsCount} UTME Questions
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sub.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {sub.topicsCount} Syllabus Topics
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {sub.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sub.overview}
                </p>

                {/* High Yield Topics Preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    High-Frequency Exam Topics:
                  </div>
                  <ul className="space-y-1">
                    {sub.highYieldTopics.map((topic) => (
                      <li
                        key={topic}
                        className="text-xs text-foreground/90 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                        <span className="truncate">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Week 1 Focus */}
                <div className="bg-muted/40 p-2.5 rounded-xl border border-border/50 text-[11px] text-muted-foreground">
                  <span className="font-bold text-foreground">Week 1 Kickoff: </span>
                  {sub.week1Focus}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/quiz/${sub.drillTopicId}`}
                  className="flex-1 py-2 px-3 text-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  Start Practice Drill
                </Link>
                <Link
                  href={`/study?stream=${deptData.id}&subject=${sub.id}`}
                  className="py-2 px-3 text-center rounded-xl border border-border bg-card hover:bg-muted font-semibold text-xs text-foreground transition-colors cursor-pointer"
                >
                  Syllabus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Examiner Traps & High-Frequency Warnings */}
      <section className="bg-card border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 dark:bg-rose-500 animate-pulse" />
          <h2 className="text-xl font-extrabold text-foreground">
            Examiner Traps to Avoid in {deptData.title}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-3xl">
          Historical analysis of candidate errors across 10 years of JAMB/UTME past tests reveals these recurring trap patterns:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {deptData.examinerTraps.map((trap, index) => (
            <div
              key={trap.title}
              className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                  Trap #{index + 1}
                </span>
                <h3 className="font-bold text-xs text-foreground">
                  {trap.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {trap.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Test Evaluation Callout */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <h2 className="text-xl font-extrabold text-foreground">
            Unsure of your starting baseline in {deptData.title}?
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Take the 15-minute diagnostic pre-test to evaluate your strengths, identify critical syllabus gaps, and calibrate your personalized 4-week timetable.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/onboarding"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all text-center"
          >
            Take 15-Min Diagnostic Pre-Test
          </Link>
          <Link
            href="/progress"
            className="px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs text-foreground transition-colors text-center"
          >
            My Progress
          </Link>
        </div>
      </section>
    </div>
  );
}