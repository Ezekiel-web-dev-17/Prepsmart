/**
 * Question seeder for the JAMB Mock Exam system.
 * Provides realistic JAMB-style past questions with verified solutions.
 * Run via: npx tsx prisma/seed-questions.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionSeed = {
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  topic: string;
  concept: string;
  explanation: string;
  difficulty: string;
};

const QUESTIONS: QuestionSeed[] = [
  // ================== USE OF ENGLISH ==================
  {
    subject: "Use of English",
    year: 2023,
    text: "Choose the option that best completes the gap: The manager insisted that each employee _____ the safety manual.",
    options: [{ id: "A", text: "read" }, { id: "B", text: "reads" }, { id: "C", text: "reading" }, { id: "D", text: "to read" }],
    correctOption: "A",
    topic: "Grammar",
    concept: "Subjunctive Mood",
    explanation: "After verbs of insistence, recommendation, or suggestion (insisted, suggested, recommended), English uses the subjunctive mood which requires the base form of the verb regardless of subject. 'insisted that each employee read' — not 'reads'.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2022,
    text: "In which of the following sentences is the word 'LIGHT' used as an adjective?",
    options: [{ id: "A", text: "Please light the candle" }, { id: "B", text: "The light was too bright" }, { id: "C", text: "She wore a light dress" }, { id: "D", text: "Light travels in a straight line" }],
    correctOption: "C",
    topic: "Parts of Speech",
    concept: "Word Classes (Adjective)",
    explanation: "In option C, 'light' modifies the noun 'dress' — telling us what kind of dress it is. That makes it an adjective. In A it's a verb (to light), in B it's a noun (the light), and in D it's a noun used as subject.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "Select the option that correctly fills the gap: He was told to _____ from the ongoing investigation.",
    options: [{ id: "A", text: "refrain" }, { id: "B", text: "restrain" }, { id: "C", text: "retain" }, { id: "D", text: "reclaim" }],
    correctOption: "A",
    topic: "Lexis and Structure",
    concept: "Lexical Confusion (Homophones & Similar Words)",
    explanation: "'Refrain from' means to stop yourself from doing something — this fits the context of being instructed not to participate. 'Restrain' usually involves physical force. 'Retain' means to keep. 'Reclaim' means to get back.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2021,
    text: "The figure of speech in the sentence 'The thunder roared angrily across the sky' is:",
    options: [{ id: "A", text: "Simile" }, { id: "B", text: "Personification" }, { id: "C", text: "Metaphor" }, { id: "D", text: "Hyperbole" }],
    correctOption: "B",
    topic: "Literary Devices",
    concept: "Personification",
    explanation: "Personification gives human qualities to non-human things. 'Thunder roared angrily' attributes anger (a human emotion) to thunder (a natural phenomenon). There is no comparison word like 'like' or 'as' (which would make it a simile), and it's not a direct identity statement (metaphor).",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2020,
    text: "Identify the word that is correctly spelt: _____ is a feature of good writing.",
    options: [{ id: "A", text: "Intelligibilty" }, { id: "B", text: "Intelligibility" }, { id: "C", text: "Inteligibility" }, { id: "D", text: "Intelligibillity" }],
    correctOption: "B",
    topic: "Spelling",
    concept: "Correct Spelling",
    explanation: "The correct spelling is 'Intelligibility' — from the root 'intelligible' + '-ity'. Common traps: double 'l' in 'intell-', single 'g', and '-ibility' (not '-ilty' or '-illity').",
    difficulty: "medium",
  },

  // ================== MATHEMATICS ==================
  {
    subject: "Mathematics",
    year: 2023,
    text: "Evaluate: ∫(3x² + 2x - 1)dx",
    options: [{ id: "A", text: "x³ + x² - x + C" }, { id: "B", text: "6x + 2 + C" }, { id: "C", text: "x³ + x² + C" }, { id: "D", text: "3x³ + 2x² - x + C" }],
    correctOption: "A",
    topic: "Calculus",
    concept: "Indefinite Integration (Power Rule)",
    explanation: "Using the power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C\n∫3x²dx = 3·x³/3 = x³\n∫2x dx = 2·x²/2 = x²\n∫(-1)dx = -x\nSo: x³ + x² - x + C",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "A bag contains 5 red balls and 3 blue balls. Two balls are drawn at random without replacement. What is the probability that both balls are red?",
    options: [{ id: "A", text: "5/14" }, { id: "B", text: "25/64" }, { id: "C", text: "5/8" }, { id: "D", text: "15/56" }],
    correctOption: "A",
    topic: "Probability",
    concept: "Probability Without Replacement",
    explanation: "P(1st red) = 5/8\nP(2nd red | 1st red) = 4/7 (one red ball removed)\nP(both red) = 5/8 × 4/7 = 20/56 = 5/14",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "Find the value of x if log₂(x+1) = 3",
    options: [{ id: "A", text: "7" }, { id: "B", text: "8" }, { id: "C", text: "6" }, { id: "D", text: "9" }],
    correctOption: "A",
    topic: "Algebra",
    concept: "Logarithms",
    explanation: "log₂(x+1) = 3 means 2³ = x+1\n8 = x+1\nx = 7",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2021,
    text: "The sum of the first n terms of an arithmetic progression is given by Sn = 3n² + 5n. Find the common difference.",
    options: [{ id: "A", text: "3" }, { id: "B", text: "6" }, { id: "C", text: "5" }, { id: "D", text: "8" }],
    correctOption: "B",
    topic: "Sequences and Series",
    concept: "Arithmetic Progression (Sum Formula)",
    explanation: "From Sn = 3n² + 5n:\nS₁ = a₁ = 3(1) + 5(1) = 8\nS₂ = 3(4) + 5(2) = 12 + 10 = 22\na₂ = S₂ - S₁ = 22 - 8 = 14\nCommon difference d = a₂ - a₁ = 14 - 8 = 6\nAlternatively: For Sn = An² + Bn, d = 2A = 2(3) = 6",
    difficulty: "hard",
  },
  {
    subject: "Mathematics",
    year: 2020,
    text: "Solve: 3x - 2 > 7",
    options: [{ id: "A", text: "x > 3" }, { id: "B", text: "x > 5/3" }, { id: "C", text: "x < 3" }, { id: "D", text: "x > -3" }],
    correctOption: "A",
    topic: "Algebra",
    concept: "Linear Inequalities",
    explanation: "3x - 2 > 7\n3x > 7 + 2\n3x > 9\nx > 3",
    difficulty: "easy",
  },

  // ================== PHYSICS ==================
  {
    subject: "Physics",
    year: 2023,
    text: "A body of mass 5 kg is moving with a velocity of 10 m/s. Calculate its kinetic energy.",
    options: [{ id: "A", text: "250 J" }, { id: "B", text: "500 J" }, { id: "C", text: "50 J" }, { id: "D", text: "100 J" }],
    correctOption: "A",
    topic: "Mechanics",
    concept: "Kinetic Energy",
    explanation: "KE = ½mv²\nKE = ½ × 5 × (10)²\nKE = ½ × 5 × 100\nKE = 250 J",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2022,
    text: "Which type of wave requires a material medium for propagation?",
    options: [{ id: "A", text: "Radio waves" }, { id: "B", text: "Mechanical waves" }, { id: "C", text: "Electromagnetic waves" }, { id: "D", text: "X-rays" }],
    correctOption: "B",
    topic: "Waves",
    concept: "Types of Waves (Mechanical vs Electromagnetic)",
    explanation: "Mechanical waves require a material medium to propagate because energy is transferred through vibrations of particles in the medium (e.g., sound waves in air, water waves). Electromagnetic waves (radio, X-rays, light) can travel through a vacuum.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "An electric heater of resistance 25Ω is connected to a 200V supply. Calculate the power consumed.",
    options: [{ id: "A", text: "1600 W" }, { id: "B", text: "800 W" }, { id: "C", text: "200 W" }, { id: "D", text: "5000 W" }],
    correctOption: "A",
    topic: "Electricity",
    concept: "Electrical Power",
    explanation: "P = V²/R\nP = (200)²/25\nP = 40000/25\nP = 1600 W",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2021,
    text: "A particle moves in a circular path of radius 2 m with a speed of 4 m/s. Calculate its centripetal acceleration.",
    options: [{ id: "A", text: "8 m/s²" }, { id: "B", text: "2 m/s²" }, { id: "C", text: "16 m/s²" }, { id: "D", text: "4 m/s²" }],
    correctOption: "A",
    topic: "Circular Motion",
    concept: "Centripetal Acceleration",
    explanation: "a = v²/r\na = (4)²/2\na = 16/2\na = 8 m/s²",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2020,
    text: "The half-life of a radioactive substance is 20 years. What fraction remains after 60 years?",
    options: [{ id: "A", text: "1/4" }, { id: "B", text: "1/8" }, { id: "C", text: "1/6" }, { id: "D", text: "1/3" }],
    correctOption: "B",
    topic: "Radioactivity",
    concept: "Half-Life Decay",
    explanation: "Number of half-lives = 60/20 = 3\nFraction remaining = (1/2)³ = 1/8",
    difficulty: "medium",
  },

  // ================== CHEMISTRY ==================
  {
    subject: "Chemistry",
    year: 2023,
    text: "What is the IUPAC name of CH₃CH₂CH₂OH?",
    options: [{ id: "A", text: "Propan-1-ol" }, { id: "B", text: "Propan-2-ol" }, { id: "C", text: "Butanol" }, { id: "D", text: "Ethanol" }],
    correctOption: "A",
    topic: "Organic Chemistry",
    concept: "Nomenclature of Alcohols",
    explanation: "CH₃CH₂CH₂OH has 3 carbon atoms (prop-) with an -OH group on carbon 1. IUPAC: propan-1-ol. Propan-2-ol would have -OH on the middle carbon (CH₃CHOHCH₃).",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2022,
    text: "Which of the following gases is responsible for acid rain?",
    options: [{ id: "A", text: "CO₂" }, { id: "B", text: "SO₂" }, { id: "C", text: "N₂" }, { id: "D", text: "O₃" }],
    correctOption: "B",
    topic: "Environmental Chemistry",
    concept: "Acid Rain",
    explanation: "SO₂ (sulphur dioxide), primarily released by burning fossil fuels and volcanic eruptions, reacts with water and oxygen in the atmosphere to form H₂SO₄ (sulphuric acid), which falls as acid rain. NO₂ also contributes, but SO₂ is the primary cause.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "Calculate the molar mass of H₂SO₄. (H=1, S=32, O=16)",
    options: [{ id: "A", text: "96 g/mol" }, { id: "B", text: "98 g/mol" }, { id: "C", text: "100 g/mol" }, { id: "D", text: "64 g/mol" }],
    correctOption: "B",
    topic: "Mole Concept",
    concept: "Molar Mass Calculation",
    explanation: "H₂SO₄:\n2(H) = 2×1 = 2\n1(S) = 1×32 = 32\n4(O) = 4×16 = 64\nMolar mass = 2 + 32 + 64 = 98 g/mol",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2021,
    text: "Which type of isomerism is exhibited by CH₃CH₂OH and CH₃OCH₃?",
    options: [{ id: "A", text: "Chain isomerism" }, { id: "B", text: "Position isomerism" }, { id: "C", text: "Functional group isomerism" }, { id: "D", text: "Optical isomerism" }],
    correctOption: "C",
    topic: "Organic Chemistry",
    concept: "Isomerism",
    explanation: "CH₃CH₂OH is ethanol (alcohol functional group -OH) and CH₃OCH₃ is dimethyl ether (ether functional group -O-). Same molecular formula (C₂H₆O) but different functional groups = Functional Group Isomerism.",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2020,
    text: "In the electrolysis of dilute H₂SO₄, which product is formed at the anode?",
    options: [{ id: "A", text: "Hydrogen" }, { id: "B", text: "Sulphur" }, { id: "C", text: "Oxygen" }, { id: "D", text: "Sulphuric acid" }],
    correctOption: "C",
    topic: "Electrochemistry",
    concept: "Electrolysis of Dilute H₂SO₄",
    explanation: "In electrolysis of dilute H₂SO₄:\nAnode (oxidation, positive electrode): Water is preferentially oxidized — 2H₂O → O₂ + 4H⁺ + 4e⁻ → Oxygen gas is produced.\nCathode: 2H⁺ + 2e⁻ → H₂ (Hydrogen gas)",
    difficulty: "medium",
  },

  // ================== BIOLOGY ==================
  {
    subject: "Biology",
    year: 2023,
    text: "Which organelle is responsible for ATP production through aerobic respiration?",
    options: [{ id: "A", text: "Ribosome" }, { id: "B", text: "Mitochondria" }, { id: "C", text: "Nucleus" }, { id: "D", text: "Golgi apparatus" }],
    correctOption: "B",
    topic: "Cell Biology",
    concept: "Organelle Functions",
    explanation: "The mitochondria is the 'powerhouse of the cell'. It is the site of aerobic respiration where glucose and oxygen are converted to ATP (adenosine triphosphate), carbon dioxide, and water via the Krebs cycle and oxidative phosphorylation.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2022,
    text: "The movement of water from a region of higher water potential to lower water potential through a semi-permeable membrane is called:",
    options: [{ id: "A", text: "Diffusion" }, { id: "B", text: "Active transport" }, { id: "C", text: "Osmosis" }, { id: "D", text: "Facilitated diffusion" }],
    correctOption: "C",
    topic: "Cell Physiology",
    concept: "Osmosis",
    explanation: "Osmosis is specifically the movement of WATER molecules from a region of higher water potential (lower solute concentration) to lower water potential (higher solute concentration) across a selectively permeable membrane. Diffusion involves all molecules. Active transport requires energy.",
    difficulty: "easy",
  },

  // ================== ECONOMICS ==================
  {
    subject: "Economics",
    year: 2023,
    text: "Which of the following best defines 'opportunity cost'?",
    options: [{ id: "A", text: "The monetary cost of purchasing a commodity" }, { id: "B", text: "The next best alternative forgone when a choice is made" }, { id: "C", text: "The cost of production for a firm" }, { id: "D", text: "The market price of a good" }],
    correctOption: "B",
    topic: "Basic Economic Concepts",
    concept: "Opportunity Cost",
    explanation: "Opportunity cost is the value of the next best alternative sacrificed when a decision is made. Economics assumes resources are scarce, so every choice implies giving up something else. It's NOT just money — it includes time, utility, and any foregone benefit.",
    difficulty: "easy",
  },
  {
    subject: "Economics",
    year: 2022,
    text: "When the price of a good falls and demand for that good rises, this is consistent with:",
    options: [{ id: "A", text: "The law of supply" }, { id: "B", text: "The law of demand" }, { id: "C", text: "Giffen's paradox" }, { id: "D", text: "Engel's law" }],
    correctOption: "B",
    topic: "Demand and Supply",
    concept: "Law of Demand",
    explanation: "The law of demand states that, all else being equal, as the price of a good falls, the quantity demanded rises (inverse relationship). This is represented by a downward sloping demand curve.",
    difficulty: "easy",
  },
];

async function seedQuestions() {
  console.log("Seeding JAMB question bank...");

  // Remove all existing questions first for idempotency
  await prisma.examSessionQuestion.deleteMany({});
  await prisma.failedQuestion.deleteMany({});
  await prisma.question.deleteMany({});

  let created = 0;
  for (const q of QUESTIONS) {
    await prisma.question.create({
      data: {
        subject: q.subject,
        year: q.year,
        text: q.text,
        options: JSON.stringify(q.options),
        correctOption: q.correctOption,
        topic: q.topic,
        concept: q.concept,
        explanation: q.explanation,
        difficulty: q.difficulty,
        isActive: true,
      },
    });
    created++;
  }

  console.log(`✓ Seeded ${created} questions across ${[...new Set(QUESTIONS.map((q) => q.subject))].join(", ")}`);
}

seedQuestions()
  .catch((e) => {
    console.error("Question seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
