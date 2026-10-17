import { PrismaClient } from "@prisma/client";
import { UNIVERSITIES_DATA } from "../src/data/universities";

const prisma = new PrismaClient();

// ==========================================
// Universities & Admission Types & Catalog
// ==========================================
interface CourseMeta {
  name: string;
  faculty: string;
  durationYears: number;
  oLevelRequirements: string;
  directEntryRequirements: string;
}

const COURSE_CATALOG: Record<string, CourseMeta> = {
  medicine: {
    name: "Medicine & Surgery (MBBS)",
    faculty: "College of Medicine / Health Sciences",
    durationYears: 6,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in one sitting.",
    directEntryRequirements:
      "JUPEB / A-Level with minimum 12-14 points in Chemistry, Physics, and Biology, or B.Sc. First Class / 2nd Class Upper in relevant biological sciences.",
  },
  law: {
    name: "Law (LL.B)",
    faculty: "Faculty of Law",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Literature in English, Mathematics, and two other Arts or Social Science subjects.",
    directEntryRequirements:
      "Two A-Level passes in Arts / Social Sciences, JUPEB (min 10 points), or Degree in relevant field.",
  },
  engineering: {
    name: "Engineering (Mechanical / Electrical / Civil)",
    faculty: "Faculty of Engineering & Technology",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Further Mathematics or Technical Drawing.",
    directEntryRequirements:
      "ND Upper Credit in relevant Engineering discipline, or JUPEB / IJMB with high credit passes in Mathematics and Physics.",
  },
  computerScience: {
    name: "Computer Science (B.Sc)",
    faculty: "Faculty of Science & Computing",
    durationYears: 4,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology or Economics.",
    directEntryRequirements:
      "ND / HND Upper Credit in Computer Science or Electrical Engineering, or JUPEB (min 9-10 points) in Mathematics and Physics.",
  },
  nursing: {
    name: "Nursing Science (B.N.Sc)",
    faculty: "Faculty of Clinical & Allied Health Sciences",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in not more than two sittings.",
    directEntryRequirements:
      "Registered Nurse (RN) / Registered Midwife (RM) certificate or A-Level passes in Biology, Chemistry, and Physics.",
  },
  accounting: {
    name: "Accounting & Finance (B.Sc)",
    faculty: "Faculty of Administration & Management Sciences",
    durationYears: 4,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Economics, and two other Commercial or Social Science subjects.",
    directEntryRequirements:
      "ND Upper Credit in Accounting / Banking & Finance, ATS Stage 3, ICAN Foundation, or JUPEB with Economics and Accounting passes.",
  },
  pharmacy: {
    name: "Pharmacy (Pharm.D)",
    faculty: "Faculty of Pharmaceutical Sciences",
    durationYears: 6,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in one sitting.",
    directEntryRequirements:
      "JUPEB passes (min 11-12 points) in Chemistry, Physics, and Biology, or B.Sc. in Biochemistry / Pharmacology / Microbiology.",
  },
  architecture: {
    name: "Architecture (B.Sc)",
    faculty: "Faculty of Environmental Sciences",
    durationYears: 5,
    oLevelRequirements:
      "5 SSCE credit passes in English Language, Mathematics, Physics, and any two from Chemistry, Technical Drawing, Geography, Fine Arts.",
    directEntryRequirements:
      "ND Upper Credit in Architectural Technology, or A-Level / JUPEB passes in Mathematics and Physics.",
  },
};

const BASE_DOCUMENTS = [
  {
    title: "Original JAMB Result Slip",
    category: "JAMB",
    isRequired: true,
    description: "Official color printout with candidate photograph directly from JAMB e-Facility portal.",
  },
  {
    title: "JAMB Admission Letter (Post-Selection)",
    category: "JAMB",
    isRequired: true,
    description: "Institutional and candidate copies downloaded from JAMB CAPS after accepting offer.",
  },
  {
    title: "O'Level Result Slip / Certificate (WAEC/NECO/NABTEB)",
    category: "O'Level",
    isRequired: true,
    description: "Original certificate or online statement of results showing mandatory credits in relevant subject combination.",
  },
  {
    title: "O'Level Result Verification Scratch Card / PIN Token",
    category: "O'Level",
    isRequired: true,
    description: "Unused examination scratch card PIN or e-verification token corresponding to the candidate's exam diet.",
  },
  {
    title: "Local Government (LGA) Identification Letter",
    category: "Identity",
    isRequired: true,
    description: "Authentic certificate of indigene status endorsed by the candidate's Local Government Area council.",
  },
  {
    title: "National Identity Card (NIN Slip) & Birth Certificate",
    category: "Identity",
    isRequired: true,
    description: "NIMC digital verification slip and National Population Commission (NPC) birth certificate or statutory age declaration.",
  },
  {
    title: "Post-UTME Screening Registration & Payment Slip",
    category: "JAMB",
    isRequired: true,
    description: "Official application acknowledgement and fee payment transaction printout from the university portal.",
  },
  {
    title: "Attestation & Recommendation Letters",
    category: "Identity",
    isRequired: true,
    description: "Two signed letters of recommendation from a reputable clergy, civil servant (Grade Level 12+), or secondary school principal.",
  },
  {
    title: "Recent Passport Photographs (8-12 Copies)",
    category: "Identity",
    isRequired: true,
    description: "Identical colored passport photographs on red or white background with candidate name and registration number written on the reverse.",
  },
  {
    title: "Direct Entry Transcript & A-Level / ND Certificate (DE Candidates)",
    category: "Direct Entry",
    isRequired: false,
    description: "Official academic transcript forwarded directly from prior polytechnic or A-Level / JUPEB institute, along with notification of results.",
  },
];

// ==========================================
// Question Seed Types & Base Questions
// ==========================================
interface BaseQuestion {
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  topic: string;
  concept: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

const BASE_QUESTIONS: BaseQuestion[] = [
  // ─── 1. USE OF ENGLISH (15 Authentic JAMB Questions) ───
  {
    subject: "Use of English",
    year: 2023,
    text: "The principal recommended that every student _____ punctual to the morning assembly.",
    options: [
      { id: "A", text: "be" },
      { id: "B", text: "is" },
      { id: "C", text: "was" },
      { id: "D", text: "are" },
    ],
    correctOption: "A",
    topic: "Grammar & Structure",
    concept: "Mandative Subjunctive",
    explanation: "After verbs of recommendation, demand, or insistence ('recommended that...'), standard English employs the subjunctive mood requiring the base form of the verb ('be') regardless of singular or plural subject.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2022,
    text: "Neither the class captain nor the prefects _____ willing to accept responsibility for the damage.",
    options: [
      { id: "A", text: "was" },
      { id: "B", text: "were" },
      { id: "C", text: "is" },
      { id: "D", text: "has been" },
    ],
    correctOption: "B",
    topic: "Concord",
    concept: "Proximity Rule with Correlative Conjunctions",
    explanation: "When subjects are joined by 'neither... nor', the verb agrees in number with the subject closer to it ('the prefects', plural), thus requiring 'were'.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "The defense counsel decided to take the witness's testimony with a grain of salt because _____.",
    options: [
      { id: "A", text: "it was seasoned with undeniable facts" },
      { id: "B", text: "it lacked credibility and seemed exaggerated" },
      { id: "C", text: "it was spoken with bitter emotion" },
      { id: "D", text: "the witness spoke in a barely audible whisper" },
    ],
    correctOption: "B",
    topic: "Idiomatic Expressions",
    concept: "Idiom Interpretation ('Take with a grain of salt')",
    explanation: "To 'take something with a grain of salt' means to maintain skepticism and not accept it at face value due to doubts about complete truthfulness.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2021,
    text: "Choose the word with the correct spelling to fill the gap: The government has commissioned new staff _____ in the state capital.",
    options: [
      { id: "A", text: "accomodation" },
      { id: "B", text: "accommodation" },
      { id: "C", text: "acommodation" },
      { id: "D", text: "acomodation" },
    ],
    correctOption: "B",
    topic: "Spelling",
    concept: "Double Consonants in English Lexis",
    explanation: "'Accommodation' is correctly spelt with double 'c' and double 'm' (a-c-c-o-m-m-o-d-a-t-i-o-n).",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2022,
    text: "Choose the option opposite in meaning to the capitalized word: The general described the soldiers' morale as EXUBERANT.",
    options: [
      { id: "A", text: "joyous" },
      { id: "B", text: "crestfallen" },
      { id: "C", text: "animated" },
      { id: "D", text: "triumphant" },
    ],
    correctOption: "B",
    topic: "Antonyms",
    concept: "Vocabulary Opposites",
    explanation: "'Exuberant' denotes high spirits, exuberance, and vitality. Its direct opposite is 'crestfallen' (dejected, downcast, dispirited).",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "Choose the option nearest in meaning to the capitalized word: The auditor gave a LUCID account of the financial records.",
    options: [
      { id: "A", text: "ambiguous" },
      { id: "B", text: "clear and easy to understand" },
      { id: "C", text: "convoluted" },
      { id: "D", text: "secretive" },
    ],
    correctOption: "B",
    topic: "Synonyms",
    concept: "Contextual Equivalence",
    explanation: "'Lucid' means expressed clearly and easily comprehended; hence 'clear and easy to understand' is the exact equivalent.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2020,
    text: "From the options lettered A to D, choose the word that has the SAME vowel sound as the one represented in 'b-ir-d'.",
    options: [
      { id: "A", text: "board" },
      { id: "B", text: "word" },
      { id: "C", text: "heart" },
      { id: "D", text: "bare" },
    ],
    correctOption: "B",
    topic: "Oral English",
    concept: "Central Vowel /ɜː/",
    explanation: "'Bird' contains the long central vowel phoneme /ɜː/. 'Word' /wɜːd/ shares this identical vowel sound.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2021,
    text: "Choose the option that has the correct primary stress placement for the noun 'PHOTOGRAPH'.",
    options: [
      { id: "A", text: "PHO-to-graph" },
      { id: "B", text: "pho-TO-graph" },
      { id: "C", text: "pho-to-GRAPH" },
      { id: "D", text: "pho-tog-RA-pher" },
    ],
    correctOption: "A",
    topic: "Oral English",
    concept: "Syllabic Stress in Nouns",
    explanation: "The noun 'photograph' takes primary stress on the first syllable: /ˈfəʊ.tə.ɡrɑːf/.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2022,
    text: "The literary device in the sentence 'The silence in the examination hall was deafening' is:",
    options: [
      { id: "A", text: "Metonymy" },
      { id: "B", text: "Oxymoron" },
      { id: "C", text: "Litotes" },
      { id: "D", text: "Euphemism" },
    ],
    correctOption: "B",
    topic: "Literary Appreciation",
    concept: "Oxymoron",
    explanation: "An oxymoron juxtaposes seemingly contradictory words ('deafening' and 'silence') to create a striking semantic effect.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "He was completely exonerated _____ all allegations of examination malpractice.",
    options: [
      { id: "A", text: "of" },
      { id: "B", text: "from" },
      { id: "C", text: "with" },
      { id: "D", text: "about" },
    ],
    correctOption: "B",
    topic: "Grammar & Structure",
    concept: "Dependent Prepositions",
    explanation: "The verb 'exonerate' standardly collocates with the preposition 'from' (exonerated from blame, guilt, or charges).",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2021,
    text: "If the candidate _____ studied diligently, he would have passed the UTME in a single sitting.",
    options: [
      { id: "A", text: "has" },
      { id: "B", text: "had" },
      { id: "C", text: "have" },
      { id: "D", text: "would have" },
    ],
    correctOption: "B",
    topic: "Grammar",
    concept: "Third Conditional (Past Unreal)",
    explanation: "Third conditional structures follow the rule: 'If + past perfect ('had studied'), ... would have + past participle'.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2022,
    text: "You barely know the new mathematics instructor, _____?",
    options: [
      { id: "A", text: "don't you" },
      { id: "B", text: "do you" },
      { id: "C", text: "haven't you" },
      { id: "D", text: "did you" },
    ],
    correctOption: "B",
    topic: "Grammar",
    concept: "Question Tags with Negative Adverbs",
    explanation: "Adverbs like 'barely', 'scarcely', and 'seldom' give the clause a negative sense, requiring an affirmative question tag ('do you?').",
    difficulty: "hard",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "Scarcely _____ into the hall when the final examination bell rang.",
    options: [
      { id: "A", text: "had he walked" },
      { id: "B", text: "he walked" },
      { id: "C", text: "did he walked" },
      { id: "D", text: "he had walked" },
    ],
    correctOption: "A",
    topic: "Grammar",
    concept: "Negative Inversion",
    explanation: "When a sentence opens with a negative or restrictive adverb like 'Scarcely', subject-auxiliary inversion is mandatory ('had he walked').",
    difficulty: "hard",
  },
  {
    subject: "Use of English",
    year: 2020,
    text: "In which of the following words is the consonant letter 'p' silent in pronunciation?",
    options: [
      { id: "A", text: "Psychology" },
      { id: "B", text: "Pavement" },
      { id: "C", text: "Prophet" },
      { id: "D", text: "Puppy" },
    ],
    correctOption: "A",
    topic: "Oral English",
    concept: "Silent Letters",
    explanation: "In words of Greek origin starting with 'ps-' such as 'psychology', 'psalm', and 'psychiatrist', the letter 'p' is silent: /saɪˈkɒl.ə.dʒi/.",
    difficulty: "easy",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "The nutritionist recommended a _____ meal rich in whole grains and fresh vegetables.",
    options: [
      { id: "A", text: "wholesome" },
      { id: "B", text: "lethal" },
      { id: "C", text: "sparse" },
      { id: "D", text: "redundant" },
    ],
    correctOption: "A",
    topic: "Lexis and Structure",
    concept: "Contextual Vocabulary",
    explanation: "'Wholesome' means promoting physical health or well-being, fitting the doctor's dietary recommendation.",
    difficulty: "easy",
  },

  // ─── 2. MATHEMATICS (15 Authentic JAMB Questions) ───
  {
    subject: "Mathematics",
    year: 2023,
    text: "Evaluate the indefinite integral: ∫(6x² - 4x + 3) dx",
    options: [
      { id: "A", text: "2x³ - 2x² + 3x + C" },
      { id: "B", text: "12x - 4 + C" },
      { id: "C", text: "3x³ - 4x² + 3x + C" },
      { id: "D", text: "2x³ + 2x² - 3x + C" },
    ],
    correctOption: "A",
    topic: "Calculus",
    concept: "Indefinite Integration (Power Rule)",
    explanation: "Applying the power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C. ∫6x²dx = 6·(x³/3) = 2x³; ∫-4xdx = -4·(x²/2) = -2x²; ∫3dx = 3x. Hence: 2x³ - 2x² + 3x + C.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "Solve for x in the logarithmic equation: log₂(2x + 4) = 4",
    options: [
      { id: "A", text: "6" },
      { id: "B", text: "8" },
      { id: "C", text: "10" },
      { id: "D", text: "12" },
    ],
    correctOption: "A",
    topic: "Algebra",
    concept: "Logarithms",
    explanation: "Converting to exponential form: 2⁴ = 2x + 4 ⇒ 16 = 2x + 4 ⇒ 2x = 12 ⇒ x = 6.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "Find the determinant of the 2×2 matrix: | 4  -2 |\n| 3   5 |",
    options: [
      { id: "A", text: "26" },
      { id: "B", text: "14" },
      { id: "C", text: "-26" },
      { id: "D", text: "20" },
    ],
    correctOption: "A",
    topic: "Matrices & Determinants",
    concept: "Determinant of 2x2 Matrix",
    explanation: "det = (4)(5) - (-2)(3) = 20 - (-6) = 20 + 6 = 26.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2021,
    text: "The 3rd term of an arithmetic progression (AP) is 10 and the 8th term is 25. Find the common difference (d).",
    options: [
      { id: "A", text: "3" },
      { id: "B", text: "5" },
      { id: "C", text: "4" },
      { id: "D", text: "2" },
    ],
    correctOption: "A",
    topic: "Sequences & Series",
    concept: "Arithmetic Progression (AP)",
    explanation: "T₈ - T₃ = (a + 7d) - (a + 2d) = 5d. 25 - 10 = 15 ⇒ 5d = 15 ⇒ d = 3.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "Find the sum to infinity of a geometric progression whose first term is 8 and common ratio is 1/2.",
    options: [
      { id: "A", text: "16" },
      { id: "B", text: "12" },
      { id: "C", text: "4" },
      { id: "D", text: "8" },
    ],
    correctOption: "A",
    topic: "Sequences & Series",
    concept: "Sum to Infinity of a GP",
    explanation: "S∞ = a / (1 - r) = 8 / (1 - 0.5) = 8 / 0.5 = 16.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "A fair die is tossed once. What is the probability of obtaining a prime number?",
    options: [
      { id: "A", text: "1/2" },
      { id: "B", text: "1/3" },
      { id: "C", text: "2/3" },
      { id: "D", text: "1/6" },
    ],
    correctOption: "A",
    topic: "Probability",
    concept: "Single Event Probability",
    explanation: "Sample space S = {1, 2, 3, 4, 5, 6}. Prime numbers = {2, 3, 5} (3 outcomes). P(prime) = 3/6 = 1/2.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2020,
    text: "If the roots of the quadratic equation x² - 7x + k = 0 differ by 3, find the value of k.",
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "12" },
      { id: "C", text: "8" },
      { id: "D", text: "14" },
    ],
    correctOption: "A",
    topic: "Algebra",
    concept: "Roots of Quadratic Equation",
    explanation: "Let roots be α and β. α + β = 7, α - β = 3. Adding gives 2α = 10 ⇒ α = 5, β = 2. Product αβ = k ⇒ k = 5 × 2 = 10.",
    difficulty: "hard",
  },
  {
    subject: "Mathematics",
    year: 2021,
    text: "Evaluate: sin(60°)cos(30°) + cos(60°)sin(30°)",
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "1/2" },
      { id: "C", text: "√3/2" },
      { id: "D", text: "0" },
    ],
    correctOption: "A",
    topic: "Trigonometry",
    concept: "Compound Angle Formula",
    explanation: "sin(A + B) = sin A cos B + cos A sin B. So sin(60° + 30°) = sin(90°) = 1.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "In how many ways can a committee of 3 boys and 2 girls be formed from a group of 5 boys and 4 girls?",
    options: [
      { id: "A", text: "60" },
      { id: "B", text: "120" },
      { id: "C", text: "30" },
      { id: "D", text: "20" },
    ],
    correctOption: "A",
    topic: "Permutations & Combinations",
    concept: "Combinations (Selection)",
    explanation: "⁵C₃ × ⁴C₂ = [5!/(3!2!)] × [4!/(2!2!)] = 10 × 6 = 60 ways.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "Find the variance of the numbers: 2, 4, 6, 8, 10.",
    options: [
      { id: "A", text: "8" },
      { id: "B", text: "4" },
      { id: "C", text: "10" },
      { id: "D", text: "2" },
    ],
    correctOption: "A",
    topic: "Statistics",
    concept: "Measures of Dispersion (Variance)",
    explanation: "Mean x̄ = 30/5 = 6. Deviations (x - x̄): -4, -2, 0, 2, 4. Squared deviations: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/5 = 8.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2021,
    text: "Rationalize the denominator of: (3 + √2) / (3 - √2)",
    options: [
      { id: "A", text: "(11 + 6√2) / 7" },
      { id: "B", text: "(7 + 6√2) / 7" },
      { id: "C", text: "(11 - 6√2) / 7" },
      { id: "D", text: "11 + 6√2" },
    ],
    correctOption: "A",
    topic: "Surds",
    concept: "Rationalization of Surds",
    explanation: "Multiply numerator and denominator by conjugate (3 + √2): (3 + √2)² / (3² - (√2)²) = (9 + 6√2 + 2) / (9 - 2) = (11 + 6√2) / 7.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "Find the gradient (slope) of the line perpendicular to 2x - 3y = 6.",
    options: [
      { id: "A", text: "-3/2" },
      { id: "B", text: "2/3" },
      { id: "C", text: "3/2" },
      { id: "D", text: "-2/3" },
    ],
    correctOption: "A",
    topic: "Coordinate Geometry",
    concept: "Perpendicular Lines",
    explanation: "2x - 3y = 6 ⇒ 3y = 2x - 6 ⇒ y = (2/3)x - 2. Slope m₁ = 2/3. For perpendicular lines, m₁m₂ = -1 ⇒ m₂ = -3/2.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2020,
    text: "Convert the binary number 11011₂ to base 10.",
    options: [
      { id: "A", text: "27" },
      { id: "B", text: "25" },
      { id: "C", text: "29" },
      { id: "D", text: "31" },
    ],
    correctOption: "A",
    topic: "Number Bases",
    concept: "Binary to Denary Conversion",
    explanation: "1×2⁴ + 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 16 + 8 + 0 + 2 + 1 = 27.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "In a class of 40 students, 25 offer Mathematics, 20 offer Physics, and 5 offer neither. How many students offer both subjects?",
    options: [
      { id: "A", text: "10" },
      { id: "B", text: "5" },
      { id: "C", text: "15" },
      { id: "D", text: "8" },
    ],
    correctOption: "A",
    topic: "Set Theory",
    concept: "Venn Diagrams & Intersection",
    explanation: "n(M ∪ P) = 40 - 5 = 35. n(M ∪ P) = n(M) + n(P) - n(M ∩ P) ⇒ 35 = 25 + 20 - x ⇒ 35 = 45 - x ⇒ x = 10.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "If y = (3x + 2)⁴, find dy/dx when x = 0.",
    options: [
      { id: "A", text: "96" },
      { id: "B", text: "32" },
      { id: "C", text: "24" },
      { id: "D", text: "72" },
    ],
    correctOption: "A",
    topic: "Calculus",
    concept: "Differentiation (Chain Rule)",
    explanation: "By chain rule: dy/dx = 4(3x + 2)³ × d/dx(3x + 2) = 12(3x + 2)³. At x = 0: 12(2)³ = 12 × 8 = 96.",
    difficulty: "hard",
  },

  // ─── 3. PHYSICS (15 Authentic JAMB Questions) ───
  {
    subject: "Physics",
    year: 2023,
    text: "A pump raises 200 kg of water through a vertical height of 10 m in 20 seconds. Calculate its useful power output. (g = 10 m/s²)",
    options: [
      { id: "A", text: "1000 W" },
      { id: "B", text: "500 W" },
      { id: "C", text: "2000 W" },
      { id: "D", text: "100 W" },
    ],
    correctOption: "A",
    topic: "Work, Energy & Power",
    concept: "Power Output Calculation",
    explanation: "Work done W = mgh = 200 × 10 × 10 = 20,000 J. Power P = W/t = 20,000 / 20 = 1000 W.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2022,
    text: "Two resistors of resistances 6 Ω and 3 Ω are connected in parallel, and the combination is in series with a 4 Ω resistor. Calculate the equivalent resistance.",
    options: [
      { id: "A", text: "6 Ω" },
      { id: "B", text: "9 Ω" },
      { id: "C", text: "2 Ω" },
      { id: "D", text: "13 Ω" },
    ],
    correctOption: "A",
    topic: "Current Electricity",
    concept: "Series-Parallel Resistor Circuits",
    explanation: "Parallel pair: (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω. In series with 4 Ω: R_eq = 2 + 4 = 6 Ω.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "The speed of light in vacuum is 3.0 × 10⁸ m/s. If its speed in a glass block is 2.0 × 10⁸ m/s, what is the refractive index of the glass?",
    options: [
      { id: "A", text: "1.5" },
      { id: "B", text: "0.67" },
      { id: "C", text: "1.33" },
      { id: "D", text: "2.0" },
    ],
    correctOption: "A",
    topic: "Optics",
    concept: "Refractive Index (Snell's Law)",
    explanation: "Refractive index n = c / v = (3.0 × 10⁸) / (2.0 × 10⁸) = 1.5.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2021,
    text: "Calculate the quantity of heat required to raise the temperature of 2 kg of copper from 25°C to 45°C. (Specific heat capacity of copper = 400 J/kg·K)",
    options: [
      { id: "A", text: "16,000 J" },
      { id: "B", text: "8,000 J" },
      { id: "C", text: "36,000 J" },
      { id: "D", text: "20,000 J" },
    ],
    correctOption: "A",
    topic: "Thermal Physics",
    concept: "Specific Heat Capacity",
    explanation: "Q = mcΔT = 2 × 400 × (45 - 25) = 800 × 20 = 16,000 J.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2022,
    text: "A radio station broadcasts electromagnetic waves at a frequency of 100 MHz. What is the wavelength of the waves? (c = 3.0 × 10⁸ m/s)",
    options: [
      { id: "A", text: "3.0 m" },
      { id: "B", text: "0.33 m" },
      { id: "C", text: "30 m" },
      { id: "D", text: "300 m" },
    ],
    correctOption: "A",
    topic: "Waves",
    concept: "Wave Equation (v = fλ)",
    explanation: "λ = v / f = (3.0 × 10⁸ m/s) / (100 × 10⁶ Hz) = 3.0 m.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "A radioactive sample has an initial mass of 80 g. If its half-life is 5 days, what mass remains undecayed after 20 days?",
    options: [
      { id: "A", text: "5 g" },
      { id: "B", text: "10 g" },
      { id: "C", text: "20 g" },
      { id: "D", text: "2.5 g" },
    ],
    correctOption: "A",
    topic: "Nuclear Physics",
    concept: "Radioactive Half-Life",
    explanation: "Number of half-lives n = 20 / 5 = 4. Remaining mass = 80 / (2⁴) = 80 / 16 = 5 g.",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2020,
    text: "What is the period of a simple pendulum of length 0.98 m on Earth where g = 9.8 m/s²? (Take π ≈ 3.142)",
    options: [
      { id: "A", text: "2.0 s" },
      { id: "B", text: "1.0 s" },
      { id: "C", text: "3.14 s" },
      { id: "D", text: "4.0 s" },
    ],
    correctOption: "A",
    topic: "Simple Harmonic Motion",
    concept: "Period of Simple Pendulum",
    explanation: "T = 2π√(L/g) = 2π√(0.98 / 9.8) = 2π√(0.1) ≈ 2 × 3.142 × 0.3162 ≈ 1.99 s ≈ 2.0 s.",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2021,
    text: "A force acts on a 1200 kg vehicle, accelerating it from rest to 20 m/s in 5 seconds. What is the magnitude of the force?",
    options: [
      { id: "A", text: "4800 N" },
      { id: "B", text: "2400 N" },
      { id: "C", text: "6000 N" },
      { id: "D", text: "1200 N" },
    ],
    correctOption: "A",
    topic: "Mechanics",
    concept: "Newton's Second Law (F = ma)",
    explanation: "Acceleration a = (v - u)/t = (20 - 0)/5 = 4 m/s². Force F = ma = 1200 × 4 = 4800 N.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2022,
    text: "If the distance between two spherical masses is doubled, the gravitational force between them will:",
    options: [
      { id: "A", text: "decrease to 1/4 of its initial value" },
      { id: "B", text: "decrease to 1/2 of its initial value" },
      { id: "C", text: "increase by a factor of 4" },
      { id: "D", text: "remain unchanged" },
    ],
    correctOption: "A",
    topic: "Gravitational Field",
    concept: "Newton's Law of Universal Gravitation",
    explanation: "Gravitational force F ∝ 1/r². When r is multiplied by 2, force becomes 1/(2²) = 1/4 of original.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "An ideal transformer has 500 primary turns and 100 secondary turns. If the input primary voltage is 240 V, what is the output secondary voltage?",
    options: [
      { id: "A", text: "48 V" },
      { id: "B", text: "1200 V" },
      { id: "C", text: "24 V" },
      { id: "D", text: "96 V" },
    ],
    correctOption: "A",
    topic: "Electromagnetism",
    concept: "Transformer Turn Ratio Equation",
    explanation: "Vs / Vp = Ns / Np ⇒ Vs = Vp × (Ns / Np) = 240 × (100 / 500) = 240 / 5 = 48 V.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2021,
    text: "The work function of a metal is 3.2 eV. Determine its threshold frequency. (h = 6.63 × 10⁻³⁴ J·s, 1 eV = 1.6 × 10⁻¹⁹ J)",
    options: [
      { id: "A", text: "7.72 × 10¹⁴ Hz" },
      { id: "B", text: "4.82 × 10¹⁴ Hz" },
      { id: "C", text: "2.12 × 10¹⁴ Hz" },
      { id: "D", text: "9.60 × 10¹⁴ Hz" },
    ],
    correctOption: "A",
    topic: "Modern Physics",
    concept: "Photoelectric Effect (Threshold Frequency)",
    explanation: "W₀ = hf₀ ⇒ f₀ = W₀ / h = (3.2 × 1.6 × 10⁻¹⁹ J) / (6.63 × 10⁻³⁴ J·s) ≈ 5.12 × 10⁻¹⁹ / 6.63 × 10⁻³⁴ ≈ 7.72 × 10¹⁴ Hz.",
    difficulty: "hard",
  },
  {
    subject: "Physics",
    year: 2020,
    text: "Calculate the upthrust on an object of volume 0.002 m³ completely immersed in water of density 1000 kg/m³. (g = 10 m/s²)",
    options: [
      { id: "A", text: "20 N" },
      { id: "B", text: "200 N" },
      { id: "C", text: "2 N" },
      { id: "D", text: "50 N" },
    ],
    correctOption: "A",
    topic: "Fluids & Archimedes' Principle",
    concept: "Archimedes' Upthrust Formula",
    explanation: "Upthrust U = ρVg = 1000 kg/m³ × 0.002 m³ × 10 m/s² = 20 N.",
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2022,
    text: "Calculate the electrical energy stored in a 10 μF capacitor charged to a potential difference of 200 V.",
    options: [
      { id: "A", text: "0.20 J" },
      { id: "B", text: "0.10 J" },
      { id: "C", text: "0.40 J" },
      { id: "D", text: "2.0 J" },
    ],
    correctOption: "A",
    topic: "Electrostatics",
    concept: "Energy Stored in a Capacitor",
    explanation: "E = ½CV² = 0.5 × (10 × 10⁻⁶ F) × (200 V)² = 0.5 × 10⁻⁵ × 40,000 = 0.20 J.",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "According to the kinetic theory of gases, the root mean square (r.m.s.) speed of gas molecules is directly proportional to:",
    options: [
      { id: "A", text: "the square root of absolute temperature (√T)" },
      { id: "B", text: "the absolute temperature (T)" },
      { id: "C", text: "the square of temperature (T²)" },
      { id: "D", text: "the pressure only" },
    ],
    correctOption: "A",
    topic: "Thermal Physics",
    concept: "Kinetic Theory of Gases (v_rms)",
    explanation: "v_rms = √(3RT/M), which means v_rms is directly proportional to the square root of the absolute thermodynamic temperature.",
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2021,
    text: "A conductor of length 0.5 m carrying a current of 4 A is placed perpendicular to a uniform magnetic field of 0.2 T. What force is exerted on the conductor?",
    options: [
      { id: "A", text: "0.4 N" },
      { id: "B", text: "0.8 N" },
      { id: "C", text: "0.2 N" },
      { id: "D", text: "1.0 N" },
    ],
    correctOption: "A",
    topic: "Electromagnetism",
    concept: "Magnetic Force on a Current-Carrying Conductor",
    explanation: "F = BIL sin θ. Since perpendicular, sin(90°) = 1. F = 0.2 × 4 × 0.5 = 0.4 N.",
    difficulty: "easy",
  },

  // ─── 4. CHEMISTRY (15 Authentic JAMB Questions) ───
  {
    subject: "Chemistry",
    year: 2023,
    text: "What is the ground state electronic configuration of Iron (Fe, atomic number Z = 26)?",
    options: [
      { id: "A", text: "[Ar] 4s² 3d⁶" },
      { id: "B", text: "[Ar] 4s¹ 3d⁷" },
      { id: "C", text: "[Ar] 3d⁸" },
      { id: "D", text: "[Ar] 4s² 3d⁵" },
    ],
    correctOption: "A",
    topic: "Atomic Structure",
    concept: "Electronic Configuration of Transition Metals",
    explanation: "Iron has 26 electrons. Argon accounts for 18: 1s² 2s² 2p⁶ 3s² 3p⁶. The remaining 8 fill the 4s and 3d subshells: 4s² 3d⁶.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2022,
    text: "Calculate the volume occupied by 8.8 g of CO₂ at standard temperature and pressure (s.t.p.). (C = 12, O = 16, Molar volume at s.t.p. = 22.4 dm³)",
    options: [
      { id: "A", text: "4.48 dm³" },
      { id: "B", text: "2.24 dm³" },
      { id: "C", text: "8.96 dm³" },
      { id: "D", text: "1.12 dm³" },
    ],
    correctOption: "A",
    topic: "Stoichiometry & Mole Concept",
    concept: "Molar Volume of Gases at S.T.P.",
    explanation: "Molar mass of CO₂ = 12 + 2(16) = 44 g/mol. Moles n = 8.8 / 44 = 0.2 mol. Volume = 0.2 × 22.4 dm³ = 4.48 dm³.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "In the Haber process: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = -92 kJ/mol. Which conditions favor maximum equilibrium yield of ammonia?",
    options: [
      { id: "A", text: "High pressure and low temperature" },
      { id: "B", text: "Low pressure and high temperature" },
      { id: "C", text: "High pressure and high temperature" },
      { id: "D", text: "Low pressure and low temperature" },
    ],
    correctOption: "A",
    topic: "Chemical Equilibrium",
    concept: "Le Chatelier's Principle",
    explanation: "The forward reaction is exothermic (ΔH < 0), so low temperature shifts equilibrium forward. Forward reaction decreases gas volume (4 moles → 2 moles), so high pressure shifts equilibrium toward fewer moles (ammonia).",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2021,
    text: "Controlled oxidation of a primary alkanol using acidified potassium heptaoxodichromate(VI) yields an alkanal, which upon further oxidation yields a/an:",
    options: [
      { id: "A", text: "alkanoic acid" },
      { id: "B", text: "alkanone" },
      { id: "C", text: "ester" },
      { id: "D", text: "alkene" },
    ],
    correctOption: "A",
    topic: "Organic Chemistry",
    concept: "Oxidation of Primary Alcohols",
    explanation: "Primary alcohol (R-CH₂OH) oxidizes to an alkanal/aldehyde (R-CHO), which readily oxidizes further into an alkanoic acid (R-COOH).",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2022,
    text: "How many Coulombs of electricity are required to deposit 0.5 mole of copper from a solution of copper(II) tetraoxosulphate(VI)? (1 Faraday = 96,500 C)",
    options: [
      { id: "A", text: "96,500 C" },
      { id: "B", text: "48,250 C" },
      { id: "C", text: "193,000 C" },
      { id: "D", text: "386,000 C" },
    ],
    correctOption: "A",
    topic: "Electrochemistry",
    concept: "Faraday's Laws of Electrolysis",
    explanation: "Electrode half-reaction: Cu²⁺ + 2e⁻ → Cu. 1 mole of Cu requires 2 Faradays. So 0.5 mole of Cu requires 0.5 × 2 = 1 Faraday = 96,500 C.",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "Calculate the pH of a 0.001 mol/dm³ solution of hydrochloric acid (HCl).",
    options: [
      { id: "A", text: "3.0" },
      { id: "B", text: "1.0" },
      { id: "C", text: "11.0" },
      { id: "D", text: "7.0" },
    ],
    correctOption: "A",
    topic: "Acids, Bases & Salts",
    concept: "pH Calculation of Strong Acids",
    explanation: "HCl is a strong monoprotic acid: [H⁺] = 0.001 M = 10⁻³ M. pH = -log₁₀[H⁺] = -log₁₀(10⁻³) = 3.0.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2020,
    text: "Under what thermodynamic conditions is a chemical reaction spontaneous at all temperatures?",
    options: [
      { id: "A", text: "ΔH < 0 and ΔS > 0" },
      { id: "B", text: "ΔH > 0 and ΔS < 0" },
      { id: "C", text: "ΔH > 0 and ΔS > 0" },
      { id: "D", text: "ΔH < 0 and ΔS < 0" },
    ],
    correctOption: "A",
    topic: "Chemical Thermodynamics",
    concept: "Gibbs Free Energy (ΔG = ΔH - TΔS)",
    explanation: "When enthalpy is negative (ΔH < 0, exothermic) and entropy is positive (ΔS > 0), ΔG = ΔH - TΔS is guaranteed negative at all temperatures T > 0.",
    difficulty: "hard",
  },
  {
    subject: "Chemistry",
    year: 2021,
    text: "Which of the following hydrocarbons will decolorize acidified potassium tetraoxomanganate(VII) or bromine water in the absence of light?",
    options: [
      { id: "A", text: "Ethene" },
      { id: "B", text: "Ethane" },
      { id: "C", text: "Methane" },
      { id: "D", text: "Propane" },
    ],
    correctOption: "A",
    topic: "Organic Chemistry",
    concept: "Test for Unsaturation in Alkenes",
    explanation: "Ethene (C₂H₄) contains a carbon-carbon double bond (C=C). It undergoes electrophilic addition, rapidly decolorizing reddish-brown bromine water.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2022,
    text: "Temporary hardness of water is caused by the presence of dissolved:",
    options: [
      { id: "A", text: "calcium hydrogen trioxocarbonate(IV)" },
      { id: "B", text: "calcium tetraoxosulphate(VI)" },
      { id: "C", text: "magnesium chloride" },
      { id: "D", text: "calcium chloride" },
    ],
    correctOption: "A",
    topic: "Water & Environmental Chemistry",
    concept: "Hardness of Water (Temporary vs Permanent)",
    explanation: "Temporary hardness is caused by soluble Ca(HCO₃)₂ and Mg(HCO₃)₂, easily removed by simple boiling. Sulphates and chlorides cause permanent hardness.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "In the industrial Hall-Héroult electrolytic extraction of aluminium, cryolite (Na₃AlF₆) is added to molten alumina primarily to:",
    options: [
      { id: "A", text: "lower the melting point and improve electrical conductivity" },
      { id: "B", text: "prevent oxidation of aluminium at the cathode" },
      { id: "C", text: "catalyze the deposition of oxygen" },
      { id: "D", text: "prevent corrosion of carbon anodes" },
    ],
    correctOption: "A",
    topic: "Metals & Metallurgy",
    concept: "Extraction of Aluminium (Cryolite Function)",
    explanation: "Pure alumina (Al₂O₃) has an excessively high melting point (~2050°C). Dissolving it in molten cryolite lowers the operating temperature to ~950°C and increases conductivity.",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2020,
    text: "Which of the following substances sublimes upon gentle heating and can be cleanly separated from common salt (NaCl)?",
    options: [
      { id: "A", text: "Ammonium chloride" },
      { id: "B", text: "Sodium carbonate" },
      { id: "C", text: "Copper(II) sulphate" },
      { id: "D", text: "Calcium chloride" },
    ],
    correctOption: "A",
    topic: "Separation Techniques",
    concept: "Sublimation",
    explanation: "Ammonium chloride (NH₄Cl) undergoes sublimation (solid converts directly to gas and re-deposits as sublimate on cooling), separating it from non-volatile NaCl.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2021,
    text: "When Uranium-238 (²³⁸₉₂U) undergoes alpha decay, what is the resulting daughter nuclide?",
    options: [
      { id: "A", text: "²³⁴₉₀Th" },
      { id: "B", text: "²³⁸₉₃Np" },
      { id: "C", text: "²³⁴₉₁Pa" },
      { id: "D", text: "²⁴²₉₄Pu" },
    ],
    correctOption: "A",
    topic: "Nuclear Chemistry",
    concept: "Alpha Decay Emission",
    explanation: "An alpha particle is a helium nucleus (⁴₂He). Alpha emission decreases mass number by 4 (238 - 4 = 234) and atomic number by 2 (92 - 2 = 90, Thorium).",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2022,
    text: "The sweet, pleasant fruity fragrance characteristic of ripe pineapples and perfumes is due to the presence of:",
    options: [
      { id: "A", text: "Esters" },
      { id: "B", text: "Alkanoic acids" },
      { id: "C", text: "Alkanols" },
      { id: "D", text: "Amines" },
    ],
    correctOption: "A",
    topic: "Organic Chemistry",
    concept: "Esters (Esterification & Odours)",
    explanation: "Esters (alkyl alkanoates) synthesized via esterification of alcohols and carboxylic acids are volatile organic compounds famous for characteristic fruity aromas.",
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "What volume of 0.5 mol/dm³ H₂SO₄ is required to neutralize completely 25.0 cm³ of 1.0 mol/dm³ NaOH solution?",
    options: [
      { id: "A", text: "12.5 cm³" },
      { id: "B", text: "25.0 cm³" },
      { id: "C", text: "50.0 cm³" },
      { id: "D", text: "6.25 cm³" },
    ],
    correctOption: "A",
    topic: "Volumetric Analysis",
    concept: "Acid-Base Titration Calculation",
    explanation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O. (CaVa)/(CbVb) = 1/2 ⇒ (0.5 × Va)/(1.0 × 25) = 1/2 ⇒ Va = 25 / (2 × 0.5) = 12.5 cm³.",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2021,
    text: "Which of the following gases is primarily responsible for the greenhouse effect and global climate warming?",
    options: [
      { id: "A", text: "Carbon(IV) oxide (CO₂)" },
      { id: "B", text: "Nitrogen (N₂)" },
      { id: "C", text: "Oxygen (O₂)" },
      { id: "D", text: "Argon (Ar)" },
    ],
    correctOption: "A",
    topic: "Environmental Chemistry",
    concept: "Greenhouse Gases & Climate Change",
    explanation: "Carbon(IV) oxide absorbs and re-emits infrared radiation emitted by the Earth's surface, trapping thermal energy in the troposphere.",
    difficulty: "easy",
  },

  // ─── 5. BIOLOGY (15 Authentic JAMB Questions) ───
  {
    subject: "Biology",
    year: 2023,
    text: "A monohybrid cross between two heterozygous tall pea plants (Tt × Tt) produces offspring with which phenotypic ratio?",
    options: [
      { id: "A", text: "3 Tall : 1 Dwarf" },
      { id: "B", text: "1 Tall : 2 Intermediate : 1 Dwarf" },
      { id: "C", text: "All Tall" },
      { id: "D", text: "1 Tall : 1 Dwarf" },
    ],
    correctOption: "A",
    topic: "Genetics & Heredity",
    concept: "Mendelian Monohybrid Cross",
    explanation: "Genotypes: 1 TT (Tall), 2 Tt (Tall), 1 tt (Dwarf). Phenotypic ratio is 3 Tall : 1 Dwarf.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2022,
    text: "Crossing over and exchange of genetic material between non-sister chromatids occurs during which specific stage of cell division?",
    options: [
      { id: "A", text: "Prophase I of Meiosis" },
      { id: "B", text: "Metaphase I of Meiosis" },
      { id: "C", text: "Prophase of Mitosis" },
      { id: "D", text: "Anaphase II of Meiosis" },
    ],
    correctOption: "A",
    topic: "Cell Division",
    concept: "Meiosis & Genetic Recombination",
    explanation: "Crossing over occurs at chiasmata during the pachytene stage of Prophase I in meiosis, generating genetic diversity.",
    difficulty: "medium",
  },
  {
    subject: "Biology",
    year: 2023,
    text: "The light-dependent stage of photosynthesis in green plant cells takes place in the:",
    options: [
      { id: "A", text: "thylakoid membranes (grana)" },
      { id: "B", text: "stroma of the chloroplast" },
      { id: "C", text: "outer mitochondrial membrane" },
      { id: "D", text: "cytoplasm" },
    ],
    correctOption: "A",
    topic: "Plant Physiology",
    concept: "Photosynthesis (Light vs Dark Reactions)",
    explanation: "Light reactions occur in the thylakoid discs (grana) containing chlorophyll, while the Calvin cycle occurs in the fluid stroma.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2021,
    text: "Which blood vessel transports freshly oxygenated blood from the lungs directly into the left atrium of the human heart?",
    options: [
      { id: "A", text: "Pulmonary vein" },
      { id: "B", text: "Pulmonary artery" },
      { id: "C", text: "Aorta" },
      { id: "D", text: "Vena cava" },
    ],
    correctOption: "A",
    topic: "Circulatory System",
    concept: "Mammalian Heart & Pulmonary Circulation",
    explanation: "The pulmonary vein is the only vein in the human body carrying oxygenated blood under normal physiological conditions, delivering it to the left atrium.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2022,
    text: "In an ecological energy pyramid, the lowest trophic level supporting all consumers is occupied by:",
    options: [
      { id: "A", text: "Primary producers (autotrophs)" },
      { id: "B", text: "Primary consumers (herbivores)" },
      { id: "C", text: "Decomposers" },
      { id: "D", text: "Apex predators" },
    ],
    correctOption: "A",
    topic: "Ecology",
    concept: "Trophic Levels & Energy Flow",
    explanation: "Autotrophs (green plants and photosynthetic bacteria) harness solar energy via photosynthesis, forming the foundational base of all ecological pyramids.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2023,
    text: "The functional microscopic filtering unit of the human mammalian kidney is the:",
    options: [
      { id: "A", text: "Nephron" },
      { id: "B", text: "Neuron" },
      { id: "C", text: "Alveolus" },
      { id: "D", text: "Glomerulus capsule only" },
    ],
    correctOption: "A",
    topic: "Excretory System",
    concept: "Structure of the Mammalian Kidney",
    explanation: "The nephron is the structural and functional microscopic unit of the kidney responsible for ultrafiltration, selective reabsorption, and urine production.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2020,
    text: "Which region of the human brain is primarily responsible for balance, posture, and motor coordination?",
    options: [
      { id: "A", text: "Cerebellum" },
      { id: "B", text: "Cerebrum" },
      { id: "C", text: "Medulla oblongata" },
      { id: "D", text: "Hypothalamus" },
    ],
    correctOption: "A",
    topic: "Nervous System & Coordination",
    concept: "Brain Anatomy & Functions",
    explanation: "The cerebellum coordinates voluntary muscular activity, equilibrium, and physical balance.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2021,
    text: "Pepsin is a digestive enzyme secreted by gastric glands that catalyzes the breakdown of:",
    options: [
      { id: "A", text: "proteins into peptones in an acidic medium" },
      { id: "B", text: "starch into maltose in an alkaline medium" },
      { id: "C", text: "lipids into fatty acids and glycerol" },
      { id: "D", text: "peptides into free amino acids" },
    ],
    correctOption: "A",
    topic: "Digestive System",
    concept: "Enzymatic Digestion in the Stomach",
    explanation: "Pepsin operates optimally in hydrochloric acid (pH ~1.5 - 2.0) in the stomach, cleaving protein polypeptide chains into shorter peptone fragments.",
    difficulty: "medium",
  },
  {
    subject: "Biology",
    year: 2022,
    text: "Jean-Baptiste Lamarck's evolutionary postulate was fundamentally built on:",
    options: [
      { id: "A", text: "the inheritance of acquired characteristics through use and disuse" },
      { id: "B", text: "natural selection and survival of the fittest" },
      { id: "C", text: "genetic mutations in germ cells" },
      { id: "D", text: "genetic drift in isolated populations" },
    ],
    correctOption: "A",
    topic: "Evolution",
    concept: "Lamarckism vs Darwinism",
    explanation: "Lamarck proposed that organisms adapt during their lifetimes through use/disuse of anatomical structures and pass these acquired traits to offspring.",
    difficulty: "medium",
  },
  {
    subject: "Biology",
    year: 2023,
    text: "Double fertilization is a hallmark reproductive feature of flowering plants (angiosperms) resulting in the formation of a diploid zygote and a:",
    options: [
      { id: "A", text: "triploid (3n) endosperm" },
      { id: "B", text: "diploid (2n) cotyledon" },
      { id: "C", text: "haploid (n) seed coat" },
      { id: "D", text: "tetraploid (4n) pericarp" },
    ],
    correctOption: "A",
    topic: "Plant Reproduction",
    concept: "Double Fertilization in Angiosperms",
    explanation: "One generative sperm fuses with the egg (zygote, 2n); the second sperm fuses with two polar nuclei to form nutritive triploid endosperm (3n).",
    difficulty: "hard",
  },
  {
    subject: "Biology",
    year: 2020,
    text: "Malaria in humans is caused by a protozoan endoparasite belonging to the genus:",
    options: [
      { id: "A", text: "Plasmodium" },
      { id: "B", text: "Trypanosoma" },
      { id: "C", text: "Entamoeba" },
      { id: "D", text: "Schistosoma" },
    ],
    correctOption: "A",
    topic: "Microorganisms & Diseases",
    concept: "Pathogen Identification (Malaria)",
    explanation: "Malaria is caused by Plasmodium species (P. falciparum, P. vivax, P. malariae, P. ovale) transmitted by the bite of infected female Anopheles mosquitoes.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2021,
    text: "Deficient secretion of insulin by the beta cells of the islets of Langerhans in the pancreas results in:",
    options: [
      { id: "A", text: "Diabetes mellitus" },
      { id: "B", text: "Diabetes insipidus" },
      { id: "C", text: "Cushing's syndrome" },
      { id: "D", text: "Goitre" },
    ],
    correctOption: "A",
    topic: "Endocrine System & Hormones",
    concept: "Pancreatic Hormones (Insulin & Glucagon)",
    explanation: "Insulin lowers blood glucose by facilitating cellular glucose uptake. Insufficiency leads to persistent hyperglycemia, characteristic of Diabetes mellitus.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2022,
    text: "The physiological translocation of manufactured organic food substances from photosynthesizing leaves to storage sinks occurs via:",
    options: [
      { id: "A", text: "phloem sieve tubes" },
      { id: "B", text: "xylem tracheids" },
      { id: "C", text: "cambium layer" },
      { id: "D", text: "pith parenchyma" },
    ],
    correctOption: "A",
    topic: "Transport in Plants",
    concept: "Phloem Translocation",
    explanation: "Xylem transports water and dissolved mineral salts upward; phloem sieve tubes transport sucrose and amino acids bidirectionally throughout the plant.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2023,
    text: "The skeletal joint that allows articulation in only a single plane, such as the human elbow and knee, is classified as a:",
    options: [
      { id: "A", text: "hinge joint" },
      { id: "B", text: "ball-and-socket joint" },
      { id: "C", text: "pivot joint" },
      { id: "D", text: "gliding joint" },
    ],
    correctOption: "A",
    topic: "Support & Movement (Skeletal System)",
    concept: "Types of Synovial Joints",
    explanation: "A hinge joint restricts movement to flexion and extension in one plane, typical of the elbow (humeroulnar joint) and knee.",
    difficulty: "easy",
  },
  {
    subject: "Biology",
    year: 2021,
    text: "Organisms classified under the Kingdom Monera are fundamentally distinguished from other living kingdoms by being:",
    options: [
      { id: "A", text: "prokaryotic, lacking a membrane-bound nucleus and organelles" },
      { id: "B", text: "eukaryotic and multicellular" },
      { id: "C", text: "strictly saprophytic with chitinous cell walls" },
      { id: "D", text: "photosynthetic with cellulose cell walls" },
    ],
    correctOption: "A",
    topic: "Classification of Living Things",
    concept: "Kingdom Monera Characteristics",
    explanation: "Monerans (bacteria and cyanobacteria) are prokaryotes; their circular DNA resides in a nucleoid region without a nuclear envelope.",
    difficulty: "easy",
  },
];

// ==========================================
// Generator: Expand Base Questions to Quotas
// ==========================================
import {
  getEnglishQuestions,
  getMathematicsQuestions,
  getPhysicsQuestions,
  getChemistryQuestions,
  getBiologyQuestions,
  getEconomicsQuestions,
} from "./seed-unique-questions";

function generateExpandedQuestions(): {
  subject: string;
  year: number;
  text: string;
  options: string;
  correctOption: string;
  topic: string;
  concept: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  isActive: boolean;
}[] {
  const allUnique = [
    ...getEnglishQuestions(),
    ...getMathematicsQuestions(),
    ...getPhysicsQuestions(),
    ...getChemistryQuestions(),
    ...getBiologyQuestions(),
    ...getEconomicsQuestions(),
  ];

  return allUnique.map((q) => ({
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
  }));
}

// ==========================================
// Main Database Seed Function
// ==========================================
async function main() {
  console.log("🚀 Starting PrepSmart comprehensive database seed...\n");

  // 1. Seed Universities & Course Requirements
  console.log("📍 Seeding Universities, Courses, and Requirements...");
  await prisma.admissionDocument.deleteMany({});
  await prisma.courseRequirement.deleteMany({});
  await prisma.university.deleteMany({});

  for (const uni of UNIVERSITIES_DATA) {
    const postUtmeRequired =
      uni.screeningType.toLowerCase().includes("post-utme") ||
      uni.screeningType.toLowerCase().includes("exam");

    const createdUniversity = await prisma.university.create({
      data: {
        slug: uni.id,
        name: uni.name,
        acronym: uni.acronym || null,
        type: uni.type,
        state: uni.state,
        city: uni.city,
        zone: uni.zone || null,
        generalCutOff: uni.generalCutOff,
        postUtmeRequired: postUtmeRequired,
        screeningType: uni.screeningType,
        annualTuitionEst: uni.annualTuitionEst || null,
        estYear: uni.estYear || null,
        website: uni.website || null,
        campusHighlights: uni.campusHighlights || null,
      },
    });

    const coursesToInsert = [];
    for (const [key, cutOff] of Object.entries(uni.departmentalCutOffs || {})) {
      const meta = COURSE_CATALOG[key] || {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        faculty: "General Faculty",
        durationYears: 4,
        oLevelRequirements:
          "5 SSCE credit passes in English Language, Mathematics, and 3 relevant discipline subjects.",
        directEntryRequirements:
          "JUPEB / ND Upper Credit in related discipline.",
      };

      coursesToInsert.push({
        universityId: createdUniversity.id,
        courseName: meta.name,
        faculty: meta.faculty,
        cutOffMark: cutOff,
        durationYears: meta.durationYears,
        oLevelRequirements: meta.oLevelRequirements,
        directEntryAccepted: true,
        directEntryRequirements: meta.directEntryRequirements,
      });
    }

    if (coursesToInsert.length > 0) {
      await prisma.courseRequirement.createMany({
        data: coursesToInsert,
      });
    }

    const documentsToInsert = BASE_DOCUMENTS.map((doc) => ({
      universityId: createdUniversity.id,
      title: doc.title,
      category: doc.category,
      isRequired: doc.isRequired,
      description: doc.description,
    }));

    await prisma.admissionDocument.createMany({
      data: documentsToInsert,
    });
  }

  // 2. Seed JAMB Mock Exam Question Bank
  console.log("\n📚 Seeding JAMB Past Questions Bank...");
  await prisma.examSessionQuestion.deleteMany({});
  await prisma.failedQuestion.deleteMany({});
  await prisma.question.deleteMany({});

  const allQuestions = generateExpandedQuestions();

  // Efficient bulk insert using createMany
  await prisma.question.createMany({
    data: allQuestions,
  });

  // Verify breakdown
  const subjectCounts = await Promise.all([
    prisma.question.count({ where: { subject: "Use of English" } }),
    prisma.question.count({ where: { subject: "Mathematics" } }),
    prisma.question.count({ where: { subject: "Physics" } }),
    prisma.question.count({ where: { subject: "Chemistry" } }),
    prisma.question.count({ where: { subject: "Biology" } }),
    prisma.question.count({ where: { subject: "Economics" } }),
  ]);

  const totalQuestions = await prisma.question.count();
  const uniCount = await prisma.university.count();
  const courseCount = await prisma.courseRequirement.count();

  console.log("\n✅ Database Seeding Successfully Completed!");
  console.log(`- Total Universities: ${uniCount}`);
  console.log(`- Total Course Requirements: ${courseCount}`);
  console.log(`- Total Questions Seeded: ${totalQuestions}`);
  console.log(`  • Use of English: ${subjectCounts[0]} questions (Quota: 60+)`);
  console.log(`  • Mathematics:    ${subjectCounts[1]} questions (Quota: 40+)`);
  console.log(`  • Physics:        ${subjectCounts[2]} questions (Quota: 40+)`);
  console.log(`  • Chemistry:      ${subjectCounts[3]} questions (Quota: 40+)`);
  console.log(`  • Biology:        ${subjectCounts[4]} questions (Quota: 40+)`);
  console.log(`  • Economics:      ${subjectCounts[5]} questions (Quota: 40+)`);
}

main()
  .catch((e) => {
    console.error("❌ Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
