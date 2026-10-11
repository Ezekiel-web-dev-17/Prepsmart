import {
  mathematicsSyllabus,
  physicsSyllabus,
  chemistrySyllabus,
  biologySyllabus,
  useOfEnglishSyllabus,
} from "@/data/syllabuses";

export interface NormalizedTopic {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  topicNumber: number;
  title: string;
  section?: string;
  contents: string[];
  objectives: string[];
  drillTopicId: string;
}

export interface AcademicStream {
  id: "science" | "commercial" | "arts";
  title: string;
  tagline: string;
  badge: string;
  targetScore: string;
  studyTime: string;
  href: string;
  accentBorder: string;
  accentBg: string;
  accentBadge: string;
  accentText: string;
  iconBg: string;
  subjects: Array<{
    name: string;
    code: string;
    questionsCount: number;
    badge: string;
  }>;
  faculties: string[];
  topCareerPaths: string[];
}

export interface WeekPlan {
  week: number;
  phase: string;
  title: string;
  badge: string;
  tagline: string;
  focus: string;
  target: string;
  dailyRoutine: Array<{
    time: string;
    activity: string;
    purpose: string;
  }>;
  milestones: string[];
  highYieldTips: string[];
}

export interface ExaminerTrap {
  id: string;
  subject: string;
  title: string;
  trapType: "SI Units" | "Distractor" | "Grammar & Phonetics" | "Negative Phrasing";
  severity: "High" | "Critical";
  examinerTechnique: string;
  studentSolution: string;
}

// Extract normalized topics from syllabuses
function extractTopics(
  syllabus: {
    sections?: Array<{ section: string; topics: Array<{ topicNumber: number; title: string; contents: string[]; objectives: string[] }> }>;
    topics?: Array<{ topicNumber: number; title: string; contents: string[]; objectives: string[] }>;
  },
  subjectId: string,
  subjectName: string,
  subjectCode: string
): NormalizedTopic[] {
  const result: NormalizedTopic[] = [];

  if (syllabus.sections) {
    syllabus.sections.forEach((sec) => {
      sec.topics.forEach((t) => {
        result.push({
          id: `${subjectId}-${t.topicNumber}`,
          subjectId,
          subjectName,
          subjectCode,
          topicNumber: t.topicNumber,
          title: t.title,
          section: sec.section,
          contents: t.contents || [],
          objectives: t.objectives || [],
          drillTopicId: subjectId,
        });
      });
    });
  } else if (syllabus.topics) {
    syllabus.topics.forEach((t) => {
      result.push({
        id: `${subjectId}-${t.topicNumber}`,
        subjectId,
        subjectName,
        subjectCode,
        topicNumber: t.topicNumber,
        title: t.title,
        contents: t.contents || [],
        objectives: t.objectives || [],
        drillTopicId: subjectId,
      });
    });
  }

  return result;
}

export const ALL_SYLLABUS_TOPICS: NormalizedTopic[] = [
  ...extractTopics(useOfEnglishSyllabus, "use-of-english", "Use of English", "ENG"),
  ...extractTopics(mathematicsSyllabus, "mathematics", "Mathematics", "MTH"),
  ...extractTopics(physicsSyllabus, "physics", "Physics", "PHY"),
  ...extractTopics(chemistrySyllabus, "chemistry", "Chemistry", "CHM"),
  ...extractTopics(biologySyllabus, "biology", "Biology", "BIO"),
];

export const ACADEMIC_STREAMS: AcademicStream[] = [
  {
    id: "science",
    title: "Science & Technology",
    tagline: "Comprehensive UTME roadmap for Medicine, Engineering, Computing, and Pure Sciences.",
    badge: "STEM Stream",
    targetScore: "310+ Score",
    studyTime: "2.5 hrs / day",
    href: "/study/science",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60 dark:border-teal-800/60 dark:hover:border-teal-700",
    accentBg: "bg-teal-500/[0.04] dark:bg-teal-950/20",
    accentBadge: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
    accentText: "text-teal-700 dark:text-teal-400",
    iconBg: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
    subjects: [
      { name: "Use of English", code: "ENG", questionsCount: 60, badge: "Compulsory" },
      { name: "Mathematics", code: "MTH", questionsCount: 40, badge: "Core STEM" },
      { name: "Physics", code: "PHY", questionsCount: 40, badge: "Calculation" },
      { name: "Chemistry", code: "CHM", questionsCount: 40, badge: "Formulas" },
      { name: "Biology", code: "BIO", questionsCount: 40, badge: "Diagnostic" },
    ],
    faculties: [
      "Medicine & Surgery (MBBS)",
      "Software & Computer Engineering",
      "Pharmacy & Pharmacology",
      "Civil & Electrical Engineering",
      "Artificial Intelligence & Data",
    ],
    topCareerPaths: ["Physician / Surgeon", "Software Engineer", "Biomedical Scientist", "Petroleum Engineer"],
  },
  {
    id: "commercial",
    title: "Commercial & Social Sciences",
    tagline: "High-yield preparation for Accounting, Economics, Business Admin, and Finance.",
    badge: "Business Stream",
    targetScore: "295+ Score",
    studyTime: "2.0 hrs / day",
    href: "/study/commercial",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60 dark:border-amber-800/60 dark:hover:border-amber-700",
    accentBg: "bg-amber-500/[0.04] dark:bg-amber-950/20",
    accentBadge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    accentText: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    subjects: [
      { name: "Use of English", code: "ENG", questionsCount: 60, badge: "Compulsory" },
      { name: "Mathematics", code: "MTH", questionsCount: 40, badge: "Analytical" },
      { name: "Economics", code: "ECO", questionsCount: 40, badge: "Theory & Graph" },
      { name: "Commerce", code: "COM", questionsCount: 40, badge: "Trade & System" },
      { name: "Principles of Accounts", code: "ACC", questionsCount: 40, badge: "Financial Core" },
    ],
    faculties: [
      "Accounting & Auditing",
      "Economics & Econometrics",
      "Business Administration & HR",
      "Banking, Insurance & Actuarial",
      "Marketing & Supply Chain",
    ],
    topCareerPaths: ["Chartered Accountant (ICAN)", "Investment Banker", "Financial Analyst", "Management Consultant"],
  },
  {
    id: "arts",
    title: "Arts & Humanities",
    tagline: "Rigorous text analysis and constitutional mastery for Law, Mass Comm, and Diplomacy.",
    badge: "Humanities Stream",
    targetScore: "285+ Score",
    studyTime: "2.0 hrs / day",
    href: "/study/arts",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60 dark:border-purple-800/60 dark:hover:border-purple-700",
    accentBg: "bg-purple-500/[0.04] dark:bg-purple-950/20",
    accentBadge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    accentText: "text-purple-700 dark:text-purple-400",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-300",
    subjects: [
      { name: "Use of English", code: "ENG", questionsCount: 60, badge: "Compulsory" },
      { name: "Literature in English", code: "LIT", questionsCount: 40, badge: "Prescribed Texts" },
      { name: "Government", code: "GOV", questionsCount: 40, badge: "Constitutional" },
      { name: "CRS / Islamic Studies", code: "REL", questionsCount: 40, badge: "Ethics & Scriptures" },
      { name: "History", code: "HIS", questionsCount: 40, badge: "Chronicles" },
    ],
    faculties: [
      "Faculty of Law (LL.B)",
      "Mass Communication & Media",
      "International Relations & Diplomacy",
      "Theatre Arts & Creative Media",
      "Philosophy & Political Science",
    ],
    topCareerPaths: ["Corporate Lawyer / Advocate", "Broadcast Journalist", "Diplomat / Foreign Attaché", "Policy Analyst"],
  },
];

export const FOUR_WEEK_CURRICULUM: WeekPlan[] = [
  {
    week: 1,
    phase: "Phase 1: Foundation",
    title: "Core Formulas, Definitions & Grammatical Concord",
    badge: "Week 01",
    tagline: "Build unshakeable fundamentals. Master definitions, SI conversions, and fundamental rules.",
    focus: "Dimensional analysis, number bases, SI unit conversion, cell structures, basic concord, and literary devices.",
    target: "Achieve 80%+ accuracy on foundational drills and memorize 35 essential core formulas.",
    dailyRoutine: [
      { time: "45 mins", activity: "Syllabus Deep Read", purpose: "Read official topic definitions and syllabus notes" },
      { time: "30 mins", activity: "Active Recall Cards", purpose: "Test recall of formulas, concord rules, and terminology" },
      { time: "30 mins", activity: "25-Question CBT Drill", purpose: "Practice untimed to timed foundational questions" },
      { time: "15 mins", activity: "Error Analysis Log", purpose: "Record every mistake and write the underlying rule" },
    ],
    milestones: [
      "Master SI fundamental & derived units with dimensional formula resolution",
      "Learn top 15 grammatical concord rules (proximity, each/every, neither-nor)",
      "Complete 50 foundational questions across your 4 registered subjects",
      "Set up your personal Error Log Notebook for recurring weak spots",
    ],
    highYieldTips: [
      "Never rush through reading comprehension. Read the questions first to know what cues to spot in the text.",
      "Check units before calculating! Examiners often give distance in km and time in seconds to test conversion.",
    ],
  },
  {
    week: 2,
    phase: "Phase 2: Understanding",
    title: "Mechanisms, Systems & Structural Rules",
    badge: "Week 02",
    tagline: "Connect ideas together. Understand reaction mechanisms, circuitry, economics, and constitutional history.",
    focus: "Redox reactions, electric circuits, organic functional groups, macroeconomics, trial balances, and constitutional milestones.",
    target: "Solve 120 intermediate-level past questions and identify distractors in multiple-choice options.",
    dailyRoutine: [
      { time: "40 mins", activity: "System Breakdown", purpose: "Study complex mechanisms and multi-step concepts" },
      { time: "30 mins", activity: "Formula Synthesis", purpose: "Derive key relationships and cross-concept connections" },
      { time: "35 mins", activity: "35-Question Drill", purpose: "Timed practice under 50 seconds per question" },
      { time: "15 mins", activity: "Distractor Deconstruction", purpose: "Explain why the 3 incorrect options are wrong" },
    ],
    milestones: [
      "Deconstruct chemical reaction mechanisms and balancing redox equations",
      "Master Kirchhoff's laws, parallel/series resistors, and wave optics formulas",
      "Analyze prescribed literature texts (character motivations, themes, and conflicts)",
      "Solve trial balance errors and bank reconciliation adjustments",
    ],
    highYieldTips: [
      "In physics circuits, calculate total equivalent resistance before trying to find branch currents.",
      "In literature, memorize who said which iconic quote to whom—JAMB tests speaker context regularly.",
    ],
  },
  {
    week: 3,
    phase: "Phase 3: Application",
    title: "Calculations, Speed Drills & Trap Avoidance",
    badge: "Week 03",
    tagline: "Sharpen your speed. Transition from 90 seconds per question down to 40 seconds.",
    focus: "Calculus, stoichiometry, projectile motion, elasticity graphs, pre-colonial governance, and oral stress patterns.",
    target: "Cut answering time to 40 seconds per question while maintaining 85%+ accuracy.",
    dailyRoutine: [
      { time: "30 mins", activity: "Speed Shortcuts", purpose: "Learn elimination tactics and estimation methods" },
      { time: "45 mins", activity: "Timed Sprint Test", purpose: "40-question sprint under strict 30-minute timer" },
      { time: "30 mins", activity: "Trap Dissection", purpose: "Flag questions with negative phrasing ('EXCEPT', 'NOT')" },
      { time: "15 mins", activity: "Flash Review", purpose: "Fast-fire revision of oral vowel/consonant pairs" },
    ],
    milestones: [
      "Reduce average question time from 75 seconds to under 42 seconds",
      "Recognize all 4 common examiner traps without falling for distractors",
      "Complete 3 full 40-question speed drills under exam conditions",
      "Zero in on your 5 weakest topics and re-study their core objectives",
    ],
    highYieldTips: [
      "When a question asks 'Which of the following is NOT true', circle or underline 'NOT' immediately.",
      "If calculation takes longer than 60 seconds, make an educated guess, flag it, and return at the end.",
    ],
  },
  {
    week: 4,
    phase: "Phase 4: Simulation",
    title: "Full Timed CBT Mocks & Final Polish",
    badge: "Week 04",
    tagline: "Exam room rehearsal. Experience the full 180 questions in 120 minutes with zero distractions.",
    focus: "Full multi-subject UTME simulation, psychological composure, time budgeting, and high-frequency past questions.",
    target: "Complete two full 400-mark mock examinations and score above your faculty target cutoff.",
    dailyRoutine: [
      { time: "120 mins", activity: "Full CBT Simulation Mock", purpose: "180 questions across 4 subjects in 2 hours non-stop" },
      { time: "30 mins", activity: "Mock Score Analytics", purpose: "Deep dive into strengths and missed questions" },
      { time: "20 mins", activity: "Rapid High-Yield Review", purpose: "Light skim of formula summary sheet and traps" },
      { time: "10 mins", activity: "Mindset & Mental Rest", purpose: "Stress reduction, breath control, and exam strategy" },
    ],
    milestones: [
      "Sit two full 400-mark simulated examinations with strict 2-hour timers",
      "Validate time allocation: English (35m), Sub 1 (25m), Sub 2 (25m), Sub 3 (25m), Buffer (10m)",
      "Review the past 5 years of recurring question patterns",
      "Arrive at 300+ predicted score confidence with stable speed and accuracy",
    ],
    highYieldTips: [
      "Start with your strongest subject after English to build momentum and calm test-day anxiety.",
      "Never leave any question blank in UTME—there is no negative marking, so an educated guess is always free points.",
    ],
  },
];

export const EXAMINER_TRAPS: ExaminerTrap[] = [
  {
    id: "trap-1",
    subject: "Physics & Chemistry",
    title: "Hidden Metric & SI Unit Mismatches",
    trapType: "SI Units",
    severity: "Critical",
    examinerTechnique:
      "JAMB provides dimensions in centimeters or grams, but formulas require meters and kilograms. Examiners place the un-converted numeric answer as Option A.",
    studentSolution:
      "Circle the unit before plugging values into formulas. Convert cm to m (÷100), g to kg (÷1000), and minutes to seconds (×60) as step zero.",
  },
  {
    id: "trap-2",
    subject: "Use of English & Government",
    title: "Inverted Double-Negative & 'EXCEPT' Phrasing",
    trapType: "Negative Phrasing",
    severity: "High",
    examinerTechnique:
      "Phrases like 'All the following are true EXCEPT' or 'Which option is LEAST associated with' are designed to trick hurried candidates into picking the first true statement.",
    studentSolution:
      "Rephrase the question in your mind as 'Which one of these is FALSE?'. Mentally check True/False beside each option until the False one stands out.",
  },
  {
    id: "trap-3",
    subject: "Mathematics & Economics",
    title: "Intermediate Value Calculation Distractors",
    trapType: "Distractor",
    severity: "Critical",
    examinerTechnique:
      "In a 2-step calculation (e.g. finding radius first, then finding total volume), the intermediate value for radius is placed as Option B to lure hasty students.",
    studentSolution:
      "Re-read the question's final sentence before clicking your answer. Ask yourself: 'Did the question ask for the radius or the total volume?'",
  },
  {
    id: "trap-4",
    subject: "Use of English (Oral)",
    title: "Spelling vs Phonetic Sound Confusion",
    trapType: "Grammar & Phonetics",
    severity: "High",
    examinerTechnique:
      "Words with silent letters (e.g., 'doubt', 'subtle', 'plumber') or different vowels that look identical in spelling (e.g., 'cough', 'rough', 'dough') are tested heavily.",
    studentSolution:
      "Focus on phonemic articulation rather than orthography. Pronounce the word in your mind without the silent consonant and match by pure sound.",
  },
];

export const EXAM_TIMING_STRATEGY = [
  {
    subject: "Use of English",
    questions: 60,
    timeMinutes: 35,
    secondsPerQ: 35,
    recommendation: "Skim passages, answer lexis and oral questions quickly, return to detailed inference.",
  },
  {
    subject: "Core Subject 1 (Strongest)",
    questions: 40,
    timeMinutes: 25,
    secondsPerQ: 37,
    recommendation: "Tackle your second strongest subject immediately after English to build points fast.",
  },
  {
    subject: "Core Subject 2",
    questions: 40,
    timeMinutes: 25,
    secondsPerQ: 37,
    recommendation: "Maintain steady pacing; skip tedious calculations and return with the buffer.",
  },
  {
    subject: "Core Subject 3",
    questions: 40,
    timeMinutes: 25,
    secondsPerQ: 37,
    recommendation: "Stay disciplined with the clock. Don't let one complex question steal 3 minutes.",
  },
  {
    subject: "Flagged Questions & Final Review",
    questions: 180,
    timeMinutes: 10,
    secondsPerQ: 0,
    recommendation: "Re-evaluate skipped questions. Make educated guesses for any remaining blanks.",
  },
];
