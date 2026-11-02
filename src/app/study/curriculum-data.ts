import {
  mathematicsSyllabus,
  physicsSyllabus,
  chemistrySyllabus,
  biologySyllabus,
  useOfEnglishSyllabus,
} from "@/data/syllabuses";

export interface CurriculumTopic {
  topicNumber: number;
  title: string;
  section: string;
  contents: string[];
  objectives: string[];
  highYield?: boolean;
  trapAlert?: string;
  drillTopicId: string;
}

export interface CurriculumSection {
  sectionTitle: string;
  topics: CurriculumTopic[];
}

export interface SubjectCurriculum {
  id: string; // e.g. "english", "physics"
  subjectName: string; // e.g. "Use of English"
  subjectCode: string; // e.g. "ENG"
  streamId: "science" | "commercial" | "arts";
  streamName: string;
  streamBadge: string;
  totalQuestions: number;
  totalTopics: number;
  durationMinutes: number;
  targetAccuracy: string;
  overview: string;
  generalObjectives: string[];
  recommendedTexts: string[];
  examinationStructure: Array<{
    section: string;
    questionCount: number;
    description: string;
  }>;
  examinerTraps: Array<{
    title: string;
    explanation: string;
  }>;
  sections: CurriculumSection[];
}

// Helper to normalize any incoming query param
export function normalizeSubjectSlug(subjectParam?: string | null): string {
  if (!subjectParam) return "english";
  const s = subjectParam.toLowerCase().trim();
  if (s.includes("english") || s === "eng") return "english";
  if (s.includes("math") || s === "mth") return "mathematics";
  if (s.includes("physic") || s === "phy") return "physics";
  if (s.includes("chem") || s === "chm") return "chemistry";
  if (s.includes("bio")) return "biology";
  if (s.includes("econ") || s === "eco") return "economics";
  if (s.includes("com")) return "commerce";
  if (s.includes("acc")) return "accounts";
  if (s.includes("gov")) return "government";
  if (s.includes("lit")) return "literature";
  if (s.includes("geo")) return "geography";
  if (s.includes("cr")) return "crs";
  return s.replace(/\s+/g, "-");
}

export function normalizeStreamSlug(streamParam?: string | null): "science" | "commercial" | "arts" {
  if (!streamParam) return "science";
  const s = streamParam.toLowerCase().trim();
  if (s.includes("com")) return "commercial";
  if (s.includes("art")) return "arts";
  return "science";
}

// Department subjects mapping
export const STREAM_SUBJECTS_MAP: Record<
  "science" | "commercial" | "arts",
  Array<{ id: string; name: string; code: string; badge: string }>
> = {
  science: [
    { id: "english", name: "Use of English", code: "ENG", badge: "Compulsory" },
    { id: "mathematics", name: "Mathematics", code: "MTH", badge: "Core STEM" },
    { id: "physics", name: "Physics", code: "PHY", badge: "Calculation" },
    { id: "chemistry", name: "Chemistry", code: "CHM", badge: "Formulas" },
    { id: "biology", name: "Biology", code: "BIO", badge: "Diagnostic" },
  ],
  commercial: [
    { id: "english", name: "Use of English", code: "ENG", badge: "Compulsory" },
    { id: "mathematics", name: "Mathematics", code: "MTH", badge: "Analytical" },
    { id: "economics", name: "Economics", code: "ECO", badge: "Core Trade" },
    { id: "commerce", name: "Commerce", code: "COM", badge: "Business Systems" },
    { id: "accounts", name: "Principles of Accounts", code: "ACC", badge: "Financial Core" },
  ],
  arts: [
    { id: "english", name: "Use of English", code: "ENG", badge: "Compulsory" },
    { id: "literature", name: "Literature in English", code: "LIT", badge: "Prescribed Texts" },
    { id: "government", name: "Government", code: "GOV", badge: "Constitutional Core" },
    { id: "crs", name: "Christian Religious Studies", code: "CRS", badge: "Theology & Ethics" },
    { id: "economics", name: "Economics", code: "ECO", badge: "Social Sciences" },
  ],
};

// 1. Build Use of English Curriculum
function getEnglishCurriculum(stream: "science" | "commercial" | "arts"): SubjectCurriculum {
  const sections: CurriculumSection[] = [
    {
      sectionTitle: "SECTION A: Comprehension and Summary Passages",
      topics: [
        {
          topicNumber: 1,
          title: "Analytical Comprehension & Paragraph Structure",
          section: "SECTION A: Comprehension and Summary",
          highYield: true,
          trapAlert: "Beware of answers with absolute qualifiers ('always', 'never') when the passage text expresses nuanced uncertainty.",
          drillTopicId: "use-of-english",
          contents: [
            "Passage Types: Description, Narration, Exposition, and Argumentation/Persuasion",
            "Passage lengths of approximately 200 words reflecting arts, science, and social sciences",
            "Identifying topic sentences and explicit statements",
            "Deducing implied meanings, tone, author mood, and perspective",
            "Grammatical functions of underlined words, clauses, phrases, and idiomatic expressions",
          ],
          objectives: [
            "Identify main points and topic sentences in reading passages",
            "Determine implied meanings and unstated assumptions",
            "Identify grammatical functions of words, phrases, and clauses in passage context",
            "Deduce writer's intentions, tone, mood, and attitude toward the subject matter",
          ],
        },
        {
          topicNumber: 2,
          title: "Prescribed Reading Novel & Summary Synthesis",
          section: "SECTION A: Comprehension and Summary",
          highYield: true,
          trapAlert: "Questions test specific plot sequences, secondary character names, and direct quotes from the approved UTME novel.",
          drillTopicId: "use-of-english",
          contents: [
            "Official JAMB Prescribed Novel (The Life Changer by Khadija Abubakar Jalli or current approved text)",
            "Plot progression, chapter outlines, dramatic turning points",
            "Character analysis: protagonists, antagonists, character foils, motivations",
            "Thematic exploration: youth culture, university life, academic integrity, moral choices",
            "Summary synthesis: combining distinct ideas into concise summary statements",
          ],
          objectives: [
            "Synthesize ideas from passages and reading texts into a unified summary",
            "Identify major and minor themes depicted in the prescribed prose text",
            "Recall accurately key dialogues, character roles, settings, and narrative resolutions",
          ],
        },
      ],
    },
    {
      sectionTitle: "SECTION B: Lexis and Structure",
      topics: [
        {
          topicNumber: 3,
          title: "Synonyms & Antonyms (Words Nearest and Opposite in Meaning)",
          section: "SECTION B: Lexis and Structure",
          highYield: true,
          trapAlert: "Examiners place words with identical meanings in isolation that do not fit the specific register or context of the sentence.",
          drillTopicId: "use-of-english",
          contents: [
            "Synonyms: words similar in meaning within specialized registers",
            "Antonyms: words nearest in opposite meaning, negative prefixes (un-, in-, dis-, a-)",
            "Contextual connotation: positive vs pejorative shades of meaning",
            "Register classification: medical, legal, commercial, political, academic vocabulary",
          ],
          objectives: [
            "Select words or expressions nearest in meaning to underlined words in sentences",
            "Identify the most appropriate opposite in meaning in given contextual environments",
            "Distinguish between literal and figurative connotations of vocabulary items",
          ],
        },
        {
          topicNumber: 4,
          title: "Sentence Patterns, Clause Types & Conditionals",
          section: "SECTION B: Lexis and Structure",
          highYield: false,
          trapAlert: "Watch out for inversion in conditional clauses ('Had I known' vs 'If I had known').",
          drillTopicId: "use-of-english",
          contents: [
            "Sentence structures: simple, compound, complex, and compound-complex",
            "Subordinate clauses: noun clauses, adjectival/relative clauses, adverbial clauses of time/reason/condition",
            "Conditional sentences: Zero, First (probable), Second (improbable), Third (impossible) conditionals",
            "Relative pronouns: who vs whom, which, whose, that, where",
          ],
          objectives: [
            "Analyze and classify clause types and determine their syntactic functions",
            "Complete conditional sentences using appropriate tense combinations",
            "Apply relative pronouns accurately according to grammatical case",
          ],
        },
        {
          topicNumber: 5,
          title: "Grammatical Concord & Subject-Verb Agreement",
          section: "SECTION B: Lexis and Structure",
          highYield: true,
          trapAlert: "Phrases introduced by 'as well as', 'together with', or 'in addition to' do not make the subject plural.",
          drillTopicId: "use-of-english",
          contents: [
            "Subject-verb agreement: singular subjects taking singular verbs",
            "Parenthetical additions ('along with', 'as well as', 'accompanied by')",
            "Proximity rule with correlative conjunctions ('either...or', 'neither...nor', 'not only...but also')",
            "Indefinite pronouns ('everybody', 'neither of them', 'each of the boys')",
            "Collective nouns taking singular vs plural verbs depending on unified vs divided action",
            "Mandative subjunctive forms ('suggest that he go' rather than 'goes')",
          ],
          objectives: [
            "Identify correct verb forms required by complex subject constructions",
            "Apply proximity rules correctly in compound correlative structures",
            "Identify errors in subject-verb agreement across extended sentences",
          ],
        },
        {
          topicNumber: 6,
          title: "Tense, Aspect, Mood & Question Tags",
          section: "SECTION B: Lexis and Structure",
          highYield: true,
          trapAlert: "Positive statements require negative tags ('She came, didn't she?'); negative statements require positive tags ('She hardly comes, does she?').",
          drillTopicId: "use-of-english",
          contents: [
            "Present, past, future tenses; simple, continuous, perfect, perfect-continuous aspects",
            "Modal auxiliaries: can/could, will/would, shall/should, may/might, must/ought to",
            "Question tags with auxiliary verbs, semi-negatives ('barely', 'scarcely', 'hardly')",
            "Degrees of comparison: positive, comparative, superlative of irregular adjectives/adverbs",
          ],
          objectives: [
            "Supply appropriate question tags to given statements",
            "Choose correct modal auxiliaries to convey certainty, obligation, or possibility",
            "Apply correct tense sequences in reported speech and complex narration",
          ],
        },
        {
          topicNumber: 7,
          title: "Prepositions, Phrasal Verbs & Collocations",
          section: "SECTION B: Lexis and Structure",
          highYield: true,
          trapAlert: "Idiomatic prepositions cannot be guessed by direct translation from local languages (e.g. 'congratulate on', not 'congratulate for').",
          drillTopicId: "use-of-english",
          contents: [
            "Prepositions of time, place, direction, agency",
            "Fixed prepositional idioms ('at all costs', 'in spite of', 'by virtue of')",
            "Dependent prepositions with adjectives/verbs ('prefer to', 'comply with', 'accused of', 'acquitted of')",
            "High-frequency phrasal verbs with multiple meanings (give up, put out, call off, turn down)",
          ],
          objectives: [
            "Complete sentences with accurate idiomatic prepositions",
            "Interpret accurately the meaning of complex phrasal verbs in given contexts",
          ],
        },
        {
          topicNumber: 8,
          title: "Mechanics, Punctuation & Spelling Rules",
          section: "SECTION B: Lexis and Structure",
          highYield: false,
          trapAlert: "Commonly misspelled words with double consonants: 'accommodation', 'embarrassment', 'harassment', 'maintenance'.",
          drillTopicId: "use-of-english",
          contents: [
            "Punctuation: comma splices, semicolons, colons, apostrophes of possession vs contraction",
            "Direct and indirect speech punctuation",
            "Spelling rules: doubling of final consonants, -ible vs -able, -ance vs -ence",
            "Capitalization of proper nouns, titles, and acronyms",
          ],
          objectives: [
            "Detect spelling errors in commonly confused words",
            "Punctuate sentences correctly to resolve syntactic ambiguities",
          ],
        },
        {
          topicNumber: 9,
          title: "Idiomatic Expressions & Figures of Speech",
          section: "SECTION B: Lexis and Structure",
          highYield: true,
          trapAlert: "Idioms are tested literally vs figuratively. The non-literal meaning is almost always the examined answer.",
          drillTopicId: "use-of-english",
          contents: [
            "Common English idioms and proverbs",
            "Figures of speech: Metaphor, Simile, Irony, Hyperbole, Personification, Oxymoron, Euphemism",
            "Interpretation of idiomatic sentences in formal discourse",
          ],
          objectives: [
            "Interpret the exact meaning of figurative and idiomatic expressions used in sentences",
            "Identify figures of speech used in given textual contexts",
          ],
        },
      ],
    },
    {
      sectionTitle: "SECTION C: Oral Forms & Phonetics",
      topics: [
        {
          topicNumber: 10,
          title: "Vowel Sounds (Monophthongs, Diphthongs & Triphthongs)",
          section: "SECTION C: Oral Forms",
          highYield: true,
          trapAlert: "Silent letters change vowel values completely (e.g. 'plumber' has silent 'b', 'debt' has silent 'b').",
          drillTopicId: "use-of-english",
          contents: [
            "12 Pure Vowels (Monophthongs): Short vowels (/ɪ/, /e/, /æ/, /ɒ/, /ʊ/, /ʌ/, /ə/) and Long vowels (/i:/, /ɑ:/, /ɔ:/, /u:/, /ɜ:/)",
            "8 Diphthongs: /eɪ/, /aɪ/, /ɔɪ/, /əʊ/, /aʊ/, /ɪə/, /eə/, /ʊə/",
            "Vowel minimal pairs (e.g. /i:/ vs /ɪ/ in 'sheep' vs 'ship', /æ/ vs /ʌ/ in 'cat' vs 'cut')",
            "Triphthongs in glide sequences",
          ],
          objectives: [
            "Distinguish between short and long vowel phonemes",
            "Match words having identical vowel sounds despite differing orthographic spellings",
            "Identify the correct phonetic vowel in given test words",
          ],
        },
        {
          topicNumber: 11,
          title: "Consonant Sounds & Silent Letters",
          section: "SECTION C: Oral Forms",
          highYield: true,
          trapAlert: "Silent letters are tested heavily: 'debris' (silent s), 'subtle' (silent b), 'corps' (silent p and s).",
          drillTopicId: "use-of-english",
          contents: [
            "24 Consonant sounds: Plosives (/p, b, t, d, k, g/), Fricatives (/f, v, θ, ð, s, z, ʃ, ʒ, h/), Affricates (/tʃ, dʒ/), Nasals (/m, n, ŋ/), Liquids and Glides (/l, r, w, j/)",
            "Voiced vs Voiceless dental fricatives (/θ/ in 'think' vs /ð/ in 'this')",
            "Silent consonants in English words (k in 'knife', w in 'write', b in 'climb', p in 'psychology')",
          ],
          objectives: [
            "Distinguish between voiced and voiceless consonant counterparts",
            "Identify silent consonants in given word options",
            "Match words with identical consonant sounds at initial, medial, or final positions",
          ],
        },
        {
          topicNumber: 12,
          title: "Word Stress, Syllable Structure & Rhymes",
          section: "SECTION C: Oral Forms",
          highYield: true,
          trapAlert: "Two-syllable noun-verb pairs shift stress: NOUN on 1st syllable (PRE-sent, EX-port), VERB on 2nd syllable (pre-SENT, ex-PORT).",
          drillTopicId: "use-of-english",
          contents: [
            "Syllable division and consonant cluster analysis",
            "Primary stress in two-syllable nouns, verbs, and adjectives",
            "Stress rules with suffixes: -ic, -tion, -sion (stress on penultimate syllable); -ate, -fy, -ise (stress on antepenultimate syllable)",
            "Compound words: compound nouns (stress on first word) vs compound adjectives/verbs",
            "Rhyme patterns in poetry and prose",
          ],
          objectives: [
            "Identify the syllable that receives primary stress in multisyllabic words",
            "Apply grammatical stress shift rules between nouns and verbs",
            "Identify words that rhyme with given stimulus words",
          ],
        },
        {
          topicNumber: 13,
          title: "Emphatic Stress & Intonation Patterns",
          section: "SECTION C: Oral Forms",
          highYield: true,
          trapAlert: "The capitalized word is the emphatic stress. The correct answer must contradict ONLY the stressed word.",
          drillTopicId: "use-of-english",
          contents: [
            "Emphatic stress in sentence context (e.g. 'MARY bought the car' vs 'Mary BOUGHT the car')",
            "Selecting the presupposed question to which the stressed sentence is an answer",
            "Intonation: Falling tune (declaratives, commands, wh-questions)",
            "Intonation: Rising tune (polar yes/no questions, polite requests, listing items)",
          ],
          objectives: [
            "Identify the question which correctly elicits a sentence with specified emphatic stress",
            "Determine the communicative intention reflected by rising and falling intonation tunes",
          ],
        },
      ],
    },
  ];

  return {
    id: "english",
    subjectName: "Use of English",
    subjectCode: "ENG",
    streamId: stream,
    streamName:
      stream === "science"
        ? "Science & Technology"
        : stream === "commercial"
        ? "Commercial & Social Sciences"
        : "Arts & Humanities",
    streamBadge:
      stream === "science"
        ? "STEM Stream"
        : stream === "commercial"
        ? "Business Stream"
        : "Humanities Stream",
    totalQuestions: 60,
    totalTopics: 13,
    durationMinutes: 45,
    targetAccuracy: "80%+ (48/60)",
    overview:
      "The Use of English examination tests candidate competence in written and spoken Standard British English across Comprehension, Lexis, Structure, and Oral Forms. It is compulsory for all 1.9M+ UTME candidates.",
    generalObjectives: [
      "Communicate effectively in both written and spoken English.",
      "Demonstrate reading comprehension, summary extraction, and inference skills at tertiary academic levels.",
      "Apply grammatical concord, lexical precision, and sentence mechanics accurately.",
      "Distinguish English phonemes, stress placements, and intonation patterns accurately.",
    ],
    recommendedTexts: [
      "The Life Changer — Khadija Abubakar Jalli (Prescribed Reading Text)",
      "Invisible Teacher — Dele Orisawayi",
      "Round-up English: A Complete Guide — N.G. Idowu",
      "Oral English for Schools and Colleges — Sam Onuigbo",
    ],
    examinationStructure: [
      {
        section: "Section A: Comprehension & Summary",
        questionCount: 18,
        description: "1 Comprehension passage, 1 Cloze passage, and Reading Text questions",
      },
      {
        section: "Section B: Lexis & Structure",
        questionCount: 32,
        description: "Synonyms, Antonyms, Sentence Completion, Idioms, and Grammatical Concord",
      },
      {
        section: "Section C: Oral Forms",
        questionCount: 10,
        description: "Vowels, Consonants, Rhymes, Word Stress, and Emphatic Sentence Stress",
      },
    ],
    examinerTraps: [
      {
        title: "Emphatic Stress Contradiction Trap",
        explanation:
          "In emphatic stress questions, candidates frequently pick an answer that confirms the capitalized word. The correct question MUST contradict the capitalized word.",
      },
      {
        title: "False Friends in Synonyms and Antonyms",
        explanation:
          "Examiners select words that look or sound similar to the stimulus word but belong to entirely unrelated semantic categories.",
      },
      {
        title: "Parenthetical Concord Delusion",
        explanation:
          "When subjects are linked with 'as well as', 'together with', or 'along with', candidates assume a plural subject. The verb must agree ONLY with the first noun.",
      },
    ],
    sections,
  };
}

// 2. Build Mathematics Curriculum
function getMathematicsCurriculum(stream: "science" | "commercial" | "arts"): SubjectCurriculum {
  const sections: CurriculumSection[] = [];
  let topicIndex = 1;

  if (mathematicsSyllabus.sections) {
    mathematicsSyllabus.sections.forEach((sec) => {
      const secTopics: CurriculumTopic[] = sec.topics.map((t) => ({
        topicNumber: topicIndex++,
        title: t.title,
        section: sec.section,
        highYield:
          t.title.includes("Calculus") ||
          t.title.includes("Indices") ||
          t.title.includes("Matrices") ||
          t.title.includes("Trigonometry") ||
          t.title.includes("Probability"),
        trapAlert:
          t.title.includes("Surds")
            ? "Remember to rationalize denominators by multiplying by conjugate surd."
            : t.title.includes("Matrices")
            ? "Matrix multiplication is non-commutative: AB does not generally equal BA."
            : undefined,
        drillTopicId: "mathematics",
        contents: t.contents || [],
        objectives: t.objectives || [],
      }));

      sections.push({
        sectionTitle: sec.section,
        topics: secTopics,
      });
    });
  }

  return {
    id: "mathematics",
    subjectName: "Mathematics",
    subjectCode: "MTH",
    streamId: stream,
    streamName:
      stream === "science"
        ? "Science & Technology"
        : stream === "commercial"
        ? "Commercial & Social Sciences"
        : "Arts & Humanities",
    streamBadge:
      stream === "science"
        ? "STEM Stream"
        : stream === "commercial"
        ? "Business Stream"
        : "Humanities Stream",
    totalQuestions: 40,
    totalTopics: topicIndex - 1,
    durationMinutes: 40,
    targetAccuracy: "80%+ (32/40)",
    overview:
      "JAMB UTME Mathematics assesses computational, algebraic, geometric, analytical, and statistical reasoning across five major curriculum sections.",
    generalObjectives: [
      "Acquire mathematical literacy, computational speed, and problem-solving skills.",
      "Develop deductive, analytical, and spatial thinking capabilities.",
      "Apply calculus, algebraic systems, and probability to everyday real-world challenges.",
    ],
    recommendedTexts: [
      "New General Mathematics for Senior Secondary Schools 1–3 — Channon, Smith, Head",
      "Essential Mathematics for Senior Secondary Schools — A.J.S. Oluwasanmi",
      "Further Mathematics for SSS — S.A. Ilori et al.",
    ],
    examinationStructure: [
      { section: "Section I: Number and Numeration", questionCount: 8, description: "Indices, Logarithms, Surds, Bases, Sets" },
      { section: "Section II: Algebra", questionCount: 12, description: "Polynomials, Progressions, Inequalities, Matrices" },
      { section: "Section III: Geometry and Trigonometry", questionCount: 8, description: "Mensuration, Coordinate Geometry, Trigonometry" },
      { section: "Section IV: Calculus", questionCount: 6, description: "Limits, Differentiation, Definite/Indefinite Integrals" },
      { section: "Section V: Statistics", questionCount: 6, description: "Measures of Dispersion, Combinatorics, Probability" },
    ],
    examinerTraps: [
      {
        title: "Quadratic Equation Sign Inversion",
        explanation: "Candidates often confuse the signs when factorizing ax² + bx + c = 0, choosing the opposite roots.",
      },
      {
        title: "Angles of Elevation vs Depression",
        explanation: "The angle of depression is measured from the horizontal line of sight downward, NOT from the vertical tower.",
      },
    ],
    sections,
  };
}

// 3. Build Physics Curriculum
function getPhysicsCurriculum(stream: "science"): SubjectCurriculum {
  const rawTopics = physicsSyllabus.topics || [];
  
  // Categorize 40 physics topics into 5 official UTME sections
  const secMechanics = rawTopics.slice(0, 11);
  const secHeat = rawTopics.slice(11, 16);
  const secWaves = rawTopics.slice(16, 26);
  const secElectricity = rawTopics.slice(26, 35);
  const secModern = rawTopics.slice(35);

  const buildTopics = (items: typeof rawTopics, secName: string, startNum: number): CurriculumTopic[] =>
    items.map((t, idx) => ({
      topicNumber: startNum + idx,
      title: t.title,
      section: secName,
      highYield:
        t.title.includes("Motion") ||
        t.title.includes("Work") ||
        t.title.includes("Current") ||
        t.title.includes("Radioactivity") ||
        t.title.includes("Optics") ||
        t.title.includes("Sound"),
      trapAlert:
        t.title.includes("Motion") || t.title.includes("Measurements")
          ? "Watch out for unit conversions: always convert km/h to m/s (multiply by 5/18) before substituting into kinematics equations."
          : undefined,
      drillTopicId: "physics",
      contents: t.contents || [],
      objectives: t.objectives || [],
    }));

  let count = 1;
  const tMech = buildTopics(secMechanics, "SECTION I: Mechanics & Properties of Matter", count);
  count += tMech.length;
  const tHeat = buildTopics(secHeat, "SECTION II: Thermal Physics & Gas Laws", count);
  count += tHeat.length;
  const tWaves = buildTopics(secWaves, "SECTION III: Waves, Light & Optics", count);
  count += tWaves.length;
  const tElec = buildTopics(secElectricity, "SECTION IV: Electricity & Magnetism", count);
  count += tElec.length;
  const tModern = buildTopics(secModern, "SECTION V: Modern Physics & Atomic Structure", count);
  count += tModern.length;

  const sections: CurriculumSection[] = [
    { sectionTitle: "SECTION I: Mechanics & Properties of Matter", topics: tMech },
    { sectionTitle: "SECTION II: Thermal Physics & Gas Laws", topics: tHeat },
    { sectionTitle: "SECTION III: Waves, Light & Optics", topics: tWaves },
    { sectionTitle: "SECTION IV: Electricity & Magnetism", topics: tElec },
    { sectionTitle: "SECTION V: Modern Physics & Atomic Structure", topics: tModern },
  ];

  return {
    id: "physics",
    subjectName: "Physics",
    subjectCode: "PHY",
    streamId: stream,
    streamName: "Science & Technology",
    streamBadge: "STEM Stream",
    totalQuestions: 40,
    totalTopics: rawTopics.length,
    durationMinutes: 40,
    targetAccuracy: "75%+ (30/40)",
    overview:
      "JAMB Physics tests fundamental scientific laws, mathematical modeling of physical phenomena, dimensional analysis, and experimental interpretation across 5 comprehensive divisions.",
    generalObjectives: [
      "Sustain interest in physics as an empirical and quantitative discipline.",
      "Apply the principles and concepts of physics to solve everyday numerical problems.",
      "Demonstrate competency in unit analysis, graphical deduction, and theoretical reasoning.",
    ],
    recommendedTexts: [
      "New School Physics for Senior Secondary Schools — M.W. Anyakoha",
      "Senior Secondary School Physics — P.N. Okeke et al.",
      "Principles of Physics for SSS — Nelkon and Parker",
    ],
    examinationStructure: [
      { section: "Section I: Mechanics & Matter", questionCount: 14, description: "Units, Kinematics, Dynamics, Machines, Fluid Statics" },
      { section: "Section II: Thermal Physics", questionCount: 6, description: "Thermodynamics, Calorimetry, Thermal Expansion, Gas Laws" },
      { section: "Section III: Waves & Optics", questionCount: 8, description: "Wave motion, Reflection, Refraction, Optical Instruments" },
      { section: "Section IV: Electricity & Magnetism", questionCount: 8, description: "Electrostatics, DC Circuits, Magnetic Fields, Induction" },
      { section: "Section V: Modern Physics", questionCount: 4, description: "Quantum theory, Photoelectric effect, Radioactivity, X-rays" },
    ],
    examinerTraps: [
      {
        title: "Mixed Metric Units Trap",
        explanation: "JAMB sets problems mixing centimeters and meters or grams and kilograms. Always standardize to SI units first.",
      },
      {
        title: "Apparent Depth vs Real Depth",
        explanation: "Refractive index = Real Depth / Apparent Depth. Examiners frequently trick candidates into computing apparent displacement instead of depth.",
      },
    ],
    sections,
  };
}

// 4. Build Chemistry Curriculum
function getChemistryCurriculum(stream: "science"): SubjectCurriculum {
  const rawTopics = chemistrySyllabus.topics || [];
  
  // Categorize 18 chemistry topics into 4 sections
  const secPhysical = rawTopics.slice(0, 7);
  const secInorganic = rawTopics.slice(7, 13);
  const secOrganic = rawTopics.slice(13, 16);
  const secIndustrial = rawTopics.slice(16);

  const buildTopics = (items: typeof rawTopics, secName: string, startNum: number): CurriculumTopic[] =>
    items.map((t, idx) => ({
      topicNumber: startNum + idx,
      title: t.title,
      section: secName,
      highYield:
        t.title.includes("Separation") ||
        t.title.includes("Stoichiometry") ||
        t.title.includes("Acids") ||
        t.title.includes("Redox") ||
        t.title.includes("Organic") ||
        t.title.includes("Gas Laws"),
      trapAlert:
        t.title.includes("Acids") || t.title.includes("Redox")
          ? "Check oxidation states carefully: a substance oxidized acts as the reducing agent, not the oxidizing agent."
          : undefined,
      drillTopicId: "chemistry",
      contents: t.contents || [],
      objectives: t.objectives || [],
    }));

  let count = 1;
  const tPhys = buildTopics(secPhysical, "SECTION I: Physical & Theoretical Chemistry", count);
  count += tPhys.length;
  const tInorg = buildTopics(secInorganic, "SECTION II: Inorganic Chemistry & Reactions", count);
  count += tInorg.length;
  const tOrg = buildTopics(secOrganic, "SECTION III: Organic Chemistry & Functional Groups", count);
  count += tOrg.length;
  const tInd = buildTopics(secIndustrial, "SECTION IV: Environmental & Applied Chemistry", count);
  count += tInd.length;

  const sections: CurriculumSection[] = [
    { sectionTitle: "SECTION I: Physical & Theoretical Chemistry", topics: tPhys },
    { sectionTitle: "SECTION II: Inorganic Chemistry & Reactions", topics: tInorg },
    { sectionTitle: "SECTION III: Organic Chemistry & Functional Groups", topics: tOrg },
    { sectionTitle: "SECTION IV: Environmental & Applied Chemistry", topics: tInd },
  ];

  return {
    id: "chemistry",
    subjectName: "Chemistry",
    subjectCode: "CHM",
    streamId: stream,
    streamName: "Science & Technology",
    streamBadge: "STEM Stream",
    totalQuestions: 40,
    totalTopics: rawTopics.length,
    durationMinutes: 40,
    targetAccuracy: "75%+ (30/40)",
    overview:
      "JAMB Chemistry evaluates candidate understanding of atomic structure, chemical bonding, stoichiometry, periodic trends, reaction kinetics, and organic synthesis pathways.",
    generalObjectives: [
      "Understand the basic principles, theories, and laws of chemical science.",
      "Recognize the interplay between molecular structure and observable physical properties.",
      "Demonstrate proficiency in balancing equations, calculating mole ratios, and identifying functional groups.",
    ],
    recommendedTexts: [
      "New School Chemistry for Senior Secondary Schools — Osei Yaw Ababio",
      "Comprehensive Certificate Chemistry — G.N.C. Ohia et al.",
      "Understanding Chemistry for Schools and Colleges — Godwin O. Ojokuku",
    ],
    examinationStructure: [
      { section: "Section I: Physical Chemistry", questionCount: 14, description: "Atomic theory, Gas laws, Energetics, Kinetics, Equilibria" },
      { section: "Section II: Inorganic Chemistry", questionCount: 12, description: "Periodic table, Acids/Bases, Metals, Non-metals, Redox" },
      { section: "Section III: Organic Chemistry", questionCount: 10, description: "Hydrocarbons, Alkanols, Esters, Polymers, Biomolecules" },
      { section: "Section IV: Applied Chemistry", questionCount: 4, description: "Industrial processes, Pollution, Water purification" },
    ],
    examinerTraps: [
      {
        title: "Catalyst and Equilibrium Shift",
        explanation: "A catalyst speeds up both forward and backward reactions equally; it does NOT alter the position of chemical equilibrium or equilibrium constant.",
      },
      {
        title: "Oxidizing Agent vs Reduced Substance",
        explanation: "The species undergoing reduction is the oxidizing agent. Examiners construct options capitalizing on this semantic confusion.",
      },
    ],
    sections,
  };
}

// 5. Build Biology Curriculum
function getBiologyCurriculum(stream: "science"): SubjectCurriculum {
  const sections: CurriculumSection[] = [];
  let topicIndex = 1;

  if (biologySyllabus.sections) {
    biologySyllabus.sections.forEach((sec) => {
      const secTopics: CurriculumTopic[] = sec.topics.map((t) => ({
        topicNumber: topicIndex++,
        title: t.title,
        section: sec.section,
        highYield:
          t.title.includes("Living organisms") ||
          t.title.includes("Nutrition") ||
          t.title.includes("Transport") ||
          t.title.includes("Heredity") ||
          t.title.includes("Ecology"),
        trapAlert:
          t.title.includes("Heredity")
            ? "Look out for sex-linked traits (e.g. hemophilia, red-green colorblindness) where males cannot be carriers."
            : undefined,
        drillTopicId: "biology",
        contents: t.contents || [],
        objectives: t.objectives || [],
      }));

      sections.push({
        sectionTitle: sec.section,
        topics: secTopics,
      });
    });
  }

  return {
    id: "biology",
    subjectName: "Biology",
    subjectCode: "BIO",
    streamId: stream,
    streamName: "Science & Technology",
    streamBadge: "STEM Stream",
    totalQuestions: 40,
    totalTopics: topicIndex - 1,
    durationMinutes: 40,
    targetAccuracy: "80%+ (32/40)",
    overview:
      "JAMB Biology assesses comprehensive candidate knowledge of living systems, morphological adaptations, physiology, ecological dynamics, genetics, and evolutionary biology.",
    generalObjectives: [
      "Demonstrate thorough knowledge of structural and functional adaptations of plants and animals.",
      "Understand genetic inheritance, chromosomal variations, and biotechnology applications.",
      "Appreciate the interactions of living organisms within ecological communities and conservation principles.",
    ],
    recommendedTexts: [
      "Modern Biology for Senior Secondary Schools — S.T. Ramalingam",
      "Essential Biology for Senior Secondary Schools — M.C. Michael",
      "College Biology — Idodo Umeh",
    ],
    examinationStructure: [
      { section: "Section A: Variety of Organisms", questionCount: 6, description: "Classification, Cell structures, Biological adaptations" },
      { section: "Section B: Form and Functions", questionCount: 16, description: "Physiology: Nutrition, Respiration, Transport, Excretion, Reproduction" },
      { section: "Section C: Ecology", questionCount: 10, description: "Habitats, Nigerian biomes, Nutrient cycles, Population ecology" },
      { section: "Section D: Heredity and Variations", questionCount: 6, description: "Mendelian genetics, Chromosomal traits, Blood groups" },
      { section: "Section E: Evolution", questionCount: 2, description: "Theories of Lamarck and Darwin, Evidence of evolution" },
    ],
    examinerTraps: [
      {
        title: "Blood Group Genotypes vs Phenotypes",
        explanation: "Candidates frequently forget that Blood Group A can have genotypes AA or AO, and Blood Group B can have BB or BO.",
      },
      {
        title: "Photosynthesis: Light vs Dark Stage Products",
        explanation: "Oxygen is released during the photolysis of water in the light stage, NOT from carbon dioxide in the dark stage.",
      },
    ],
    sections,
  };
}

// 6. Build Economics Curriculum
function getEconomicsCurriculum(stream: "commercial" | "arts" | "science"): SubjectCurriculum {
  const sections: CurriculumSection[] = [
    {
      sectionTitle: "SECTION A: Microeconomics & Price Mechanism",
      topics: [
        {
          topicNumber: 1,
          title: "Basic Economic Concepts & Methodology",
          section: "SECTION A: Microeconomics",
          highYield: true,
          trapAlert: "Opportunity cost is the alternative foregone, NOT the financial money price paid for a commodity.",
          drillTopicId: "economics",
          contents: [
            "Definitions of Economics (Adam Smith, Alfred Marshall, Lionel Robbins)",
            "Fundamental concepts: Want, Scarcity, Choice, Scale of Preference, Opportunity Cost",
            "Production Possibility Frontier (PPF): shifts, movements, opportunity cost curves",
            "Economic systems: Free market, Command/Socialist, Mixed economy",
          ],
          objectives: [
            "Differentiate between scarcity, choice, and opportunity cost",
            "Interpret production possibility curves and calculate marginal rate of transformation",
            "Compare allocation of resources under free market vs command economies",
          ],
        },
        {
          topicNumber: 2,
          title: "Theory of Consumer Behavior & Demand",
          section: "SECTION A: Microeconomics",
          highYield: true,
          trapAlert: "A change in price causes movement along the demand curve. Non-price factors cause a shift of the entire curve.",
          drillTopicId: "economics",
          contents: [
            "Law of Demand, demand schedule and curve",
            "Types of demand: derived, composite, joint/complementary, competitive",
            "Utility theory: Total utility, marginal utility, law of diminishing marginal utility, consumer equilibrium",
            "Price elasticity of demand (PED): formulas, elastic, inelastic, unitary, cross elasticity (XED), income elasticity (YED)",
          ],
          objectives: [
            "Calculate point and arc price elasticity of demand",
            "Distinguish between shifts in demand vs movements along a demand curve",
            "Interpret positive vs negative cross and income elasticities",
          ],
        },
        {
          topicNumber: 3,
          title: "Theory of Supply & Market Equilibrium",
          section: "SECTION A: Microeconomics",
          highYield: true,
          trapAlert: "Price ceiling (maximum price) is set BELOW equilibrium to protect consumers, causing shortages.",
          drillTopicId: "economics",
          contents: [
            "Law of Supply, supply schedule and curve",
            "Types of supply: joint, competitive, composite",
            "Price elasticity of supply: determinants and calculation",
            "Market equilibrium price and quantity; effects of price controls: price floor vs price ceiling",
          ],
          objectives: [
            "Determine equilibrium price and quantity algebraically and graphically",
            "Analyze the consequences of government price fixing, subsidies, and excise taxes",
          ],
        },
        {
          topicNumber: 4,
          title: "Theory of Production & Cost Functions",
          section: "SECTION A: Microeconomics",
          highYield: true,
          trapAlert: "Marginal cost curve cuts average variable cost and average total cost curves at their lowest minimum points.",
          drillTopicId: "economics",
          contents: [
            "Factors of production: Land, Labor, Capital, Entrepreneurship",
            "Law of Diminishing Returns (Variable Proportions): TP, AP, MP curves and stages of production",
            "Cost concepts: Total Cost (TC), Fixed Cost (FC), Variable Cost (VC), Average Cost (AC), Marginal Cost (MC)",
            "Revenue concepts: Total Revenue (TR), Average Revenue (AR), Marginal Revenue (MR)",
            "Economies and Diseconomies of scale",
          ],
          objectives: [
            "Calculate TC, AC, and MC from given cost schedules",
            "Identify the profit maximization condition (MC = MR) for firms",
          ],
        },
        {
          topicNumber: 5,
          title: "Market Structures (Competition & Monopoly)",
          section: "SECTION A: Microeconomics",
          highYield: true,
          trapAlert: "Under perfect competition, price equals marginal revenue (P = MR = AR). Under monopoly, P > MR.",
          drillTopicId: "economics",
          contents: [
            "Perfect Competition: assumptions, short-run and long-run equilibrium (P = MR = MC = AC)",
            "Monopoly: sources of monopoly power, price discrimination, deadweight loss",
            "Monopolistic Competition and Oligopoly: kinked demand curve, non-price competition, cartels",
          ],
          objectives: [
            "Compare efficiency between perfect competition and monopoly",
            "Evaluate price discrimination conditions and economic welfare implications",
          ],
        },
      ],
    },
    {
      sectionTitle: "SECTION B: Macroeconomics & Monetary Policy",
      topics: [
        {
          topicNumber: 6,
          title: "National Income Accounting",
          section: "SECTION B: Macroeconomics",
          highYield: true,
          trapAlert: "Transfer payments (e.g. pensions, gifts) are EXCLUDED from national income calculations to prevent double counting.",
          drillTopicId: "economics",
          contents: [
            "Concepts: GDP, GNP, NNP, National Income, Personal Income, Disposable Income",
            "Methods of measurement: Output/Value Added, Income, Expenditure methods",
            "Circular flow of income in two, three, and four sector economies",
            "The Keynesian Multiplier: MPC, MPS, multiplier formula (k = 1 / (1 - MPC))",
          ],
          objectives: [
            "Compute national income using output, income, and expenditure approaches",
            "Calculate the investment multiplier and equilibrium national income",
          ],
        },
        {
          topicNumber: 7,
          title: "Money, Banking & Inflation",
          section: "SECTION B: Macroeconomics",
          highYield: true,
          trapAlert: "To control inflation, the central bank RAISES the cash reserve ratio, discount rate, and sells treasury bills.",
          drillTopicId: "economics",
          contents: [
            "Evolution and functions of money, qualities of good money",
            "Commercial banks: credit creation process and balance sheet",
            "Central Bank: monetary policy instruments (CRR, MPR, Open Market Operations, Moral Suasion)",
            "Inflation: demand-pull vs cost-push, measurement (CPI), causes, consequences, and remedies",
          ],
          objectives: [
            "Explain how commercial banks create credit through deposits",
            "Apply monetary and fiscal policies to stabilize inflationary or deflationary gaps",
          ],
        },
        {
          topicNumber: 8,
          title: "Public Finance, Fiscal Policy & Taxation",
          section: "SECTION B: Macroeconomics",
          highYield: false,
          trapAlert: "A progressive tax takes a higher percentage from higher income earners; a regressive tax burdens low income earners proportionally more.",
          drillTopicId: "economics",
          contents: [
            "Sources of government revenue and recurrent vs capital expenditure",
            "Principles of taxation (Adam Smith's canons of taxation)",
            "Types of taxes: direct vs indirect, progressive, regressive, proportional",
            "National debt: internal vs external debt, debt servicing burden",
          ],
          objectives: [
            "Distinguish between fiscal policy tools (taxes, government spending) and monetary tools",
            "Evaluate the economic effects of direct and indirect taxes",
          ],
        },
      ],
    },
    {
      sectionTitle: "SECTION C: International Economics & Nigerian Development",
      topics: [
        {
          topicNumber: 9,
          title: "International Trade & Balance of Payments",
          section: "SECTION C: International Economics",
          highYield: true,
          trapAlert: "Balance of Trade includes ONLY visible goods. Balance of Payments includes both visible goods AND invisible services/capital flows.",
          drillTopicId: "economics",
          contents: [
            "Theories of Absolute Advantage (Adam Smith) and Comparative Advantage (David Ricardo)",
            "Terms of Trade and Balance of Trade vs Balance of Payments",
            "Trade restrictions: Tariffs, Quotas, Embargoes, Exchange controls",
            "Devaluation vs Depreciation of domestic currency",
          ],
          objectives: [
            "Calculate terms of trade and gains from specialization",
            "Suggest policy measures to correct persistent balance of payments deficits",
          ],
        },
        {
          topicNumber: 10,
          title: "Petroleum & Structural Challenges in Nigeria",
          section: "SECTION C: Nigerian Economy",
          highYield: true,
          trapAlert: "Nigeria's mono-economy makes it highly vulnerable to global crude oil price shocks (Dutch Disease).",
          drillTopicId: "economics",
          contents: [
            "Discovery and impact of crude oil on Nigeria's agricultural sector",
            "OPEC quota, downstream vs upstream operations, deregulation",
            "Economic diversification, manufacturing deficits, and regional integration (ECOWAS, AfCFTA)",
          ],
          objectives: [
            "Examine the positive and negative contributions of petroleum to Nigeria's GDP",
            "Evaluate policies designed to achieve economic diversification in Nigeria",
          ],
        },
      ],
    },
  ];

  return {
    id: "economics",
    subjectName: "Economics",
    subjectCode: "ECO",
    streamId: stream,
    streamName:
      stream === "commercial"
        ? "Commercial & Social Sciences"
        : stream === "arts"
        ? "Arts & Humanities"
        : "Science & Technology",
    streamBadge:
      stream === "commercial"
        ? "Business Stream"
        : stream === "arts"
        ? "Humanities Stream"
        : "STEM Stream",
    totalQuestions: 40,
    totalTopics: 10,
    durationMinutes: 40,
    targetAccuracy: "80%+ (32/40)",
    overview:
      "JAMB UTME Economics assesses candidate understanding of resource allocation, market forces, national income determination, financial systems, public finance, and international economic dynamics.",
    generalObjectives: [
      "Understand basic economic concepts, principles, and analytical tools.",
      "Interpret graphical economic models, elasticity coefficients, and macroeconomic data.",
      "Analyze the structural characteristics and development challenges of the Nigerian economy.",
    ],
    recommendedTexts: [
      "Comprehensive Economics for Senior Secondary Schools — J.U. Anyaele",
      "Essential Economics for SSS — C.E. Ande",
      "Modern Economics — H.L. Ahuja",
    ],
    examinationStructure: [
      { section: "Section A: Microeconomics", questionCount: 18, description: "Demand, Supply, Elasticity, Consumer Utility, Production, Costs, Market Structures" },
      { section: "Section B: Macroeconomics", questionCount: 14, description: "National Income, Money, Banking, Inflation, Public Finance & Taxation" },
      { section: "Section C: International & Nigerian Economy", questionCount: 8, description: "International Trade, Balance of Payments, Petroleum Sector, Economic Growth" },
    ],
    examinerTraps: [
      {
        title: "Shift vs Movement in Demand Curves",
        explanation: "Changes in price cause movement along the curve. Non-price determinants (income, tastes, substitutes) shift the entire curve.",
      },
      {
        title: "Transfer Payments in National Income",
        explanation: "Pensions, scholarships, and unemployment benefits are transfer payments and are excluded from GDP calculations.",
      },
    ],
    sections,
  };
}

// 7. General Fallback for other subjects (Commerce, Accounts, Government, Literature, etc.)
function getGenericSubjectCurriculum(
  subjectSlug: string,
  stream: "science" | "commercial" | "arts"
): SubjectCurriculum {
  const isCommerce = subjectSlug.includes("com");
  const isAccounts = subjectSlug.includes("acc");
  const isGov = subjectSlug.includes("gov");
  const isLit = subjectSlug.includes("lit");

  const name = isCommerce
    ? "Commerce"
    : isAccounts
    ? "Principles of Accounts"
    : isGov
    ? "Government"
    : isLit
    ? "Literature in English"
    : subjectSlug.toUpperCase();

  const code = isCommerce
    ? "COM"
    : isAccounts
    ? "ACC"
    : isGov
    ? "GOV"
    : isLit
    ? "LIT"
    : "UTME";

  return {
    id: subjectSlug,
    subjectName: name,
    subjectCode: code,
    streamId: stream,
    streamName:
      stream === "commercial"
        ? "Commercial & Social Sciences"
        : stream === "arts"
        ? "Arts & Humanities"
        : "Science & Technology",
    streamBadge:
      stream === "commercial"
        ? "Business Stream"
        : stream === "arts"
        ? "Humanities Stream"
        : "STEM Stream",
    totalQuestions: 40,
    totalTopics: 8,
    durationMinutes: 40,
    targetAccuracy: "75%+ (30/40)",
    overview: `Official JAMB curriculum and topic breakdown for ${name}. Master core concepts, past questions, and examiner trap warnings for maximum UTME scores.`,
    generalObjectives: [
      `Demonstrate mastery of core syllabus principles and operational definitions in ${name}.`,
      "Apply analytical reasoning to solve multiple-choice CBT examination questions.",
      "Identify examiner trick questions and eliminate misleading options with speed and accuracy.",
    ],
    recommendedTexts: [
      `Senior Secondary School ${name} — Official Curriculum Text`,
      "Past UTME Question Compendium (Last 10 Years)",
    ],
    examinationStructure: [
      { section: "Foundational Theories & Definitions", questionCount: 15, description: "Core concepts, classifications, and historical development" },
      { section: "Analytical & Applied Questions", questionCount: 15, description: "Case scenarios, computations, and institutional functions" },
      { section: "Examiner Trap Questions", questionCount: 10, description: "Negative phrasing, high-yield topics, and exception-based testing" },
    ],
    examinerTraps: [
      {
        title: "Negative Phrasing Alert ('EXCEPT', 'NOT')",
        explanation: "Read question stems carefully. Underline or note negative qualifiers before examining the four option choices.",
      },
    ],
    sections: [
      {
        sectionTitle: "Section I: Core Principles & Institutional Frameworks",
        topics: [
          {
            topicNumber: 1,
            title: `Foundations of ${name}`,
            section: "Section I",
            highYield: true,
            drillTopicId: subjectSlug,
            contents: ["Definitions, historical evolution, and scope", "Fundamental principles and terminologies", "Importance to economic and civic life"],
            objectives: ["Define and classify foundational concepts", "Explain the evolution and modern practice of the discipline"],
          },
          {
            topicNumber: 2,
            title: "Structures, Functions & Operational Rules",
            section: "Section I",
            highYield: true,
            drillTopicId: subjectSlug,
            contents: ["Key institutional bodies and legal frameworks", "Standard operating procedures and regulations"],
            objectives: ["Identify functions of regulatory and executive institutions", "Apply operational guidelines to real-world scenarios"],
          },
        ],
      },
      {
        sectionTitle: "Section II: Advanced Topics & Examination Blueprints",
        topics: [
          {
            topicNumber: 3,
            title: "Analytical Problem Solving & Contemporary Issues",
            section: "Section II",
            highYield: true,
            drillTopicId: subjectSlug,
            contents: ["Contemporary trends in Nigeria and globally", "Comparative evaluation of models and systems"],
            objectives: ["Evaluate alternative systemic models", "Solve multi-tier multiple-choice problems"],
          },
        ],
      },
    ],
  };
}

// Main Selector Function
export function getSubjectCurriculum(
  streamParam?: string | null,
  subjectParam?: string | null
): SubjectCurriculum {
  const stream = normalizeStreamSlug(streamParam);
  const subjectSlug = normalizeSubjectSlug(subjectParam);

  if (subjectSlug === "english") {
    return getEnglishCurriculum(stream);
  }
  if (subjectSlug === "mathematics") {
    return getMathematicsCurriculum(stream);
  }
  if (subjectSlug === "physics") {
    return getPhysicsCurriculum("science");
  }
  if (subjectSlug === "chemistry") {
    return getChemistryCurriculum("science");
  }
  if (subjectSlug === "biology") {
    return getBiologyCurriculum("science");
  }
  if (subjectSlug === "economics") {
    return getEconomicsCurriculum(stream);
  }

  return getGenericSubjectCurriculum(subjectSlug, stream);
}

