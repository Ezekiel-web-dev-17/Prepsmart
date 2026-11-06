import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SeedQuestion {
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  topic: string;
  concept: string;
  explanation: string;
  mnemonic?: string;
  diagramSvg?: string;
  difficulty?: "easy" | "medium" | "hard";
}

// =========================================================================
// AUTHENTIC REAL-WORLD JAMB QUESTIONS CURATED ACROSS UTME TOPICS
// =========================================================================
export const REAL_WORLD_JAMB_QUESTIONS: SeedQuestion[] = [
  // ── MATHEMATICS: Number and Numeration (Indices & Logarithms) ──
  {
    subject: "Mathematics",
    year: 2024,
    text: "Evaluate without mathematical tables or calculator: $\\log_2 32 + \\log_3 81 - \\log_5 125$.",
    options: [
      { id: "A", text: "4" },
      { id: "B", text: "6" },
      { id: "C", text: "8" },
      { id: "D", text: "10" },
    ],
    correctOption: "B",
    topic: "Indices and Logarithms",
    concept: "Logarithmic base powers",
    explanation: "Recall that $\\log_b(b^n) = n$. Here:\n• $\\log_2 32 = \\log_2(2^5) = 5$\n• $\\log_3 81 = \\log_3(3^4) = 4$\n• $\\log_5 125 = \\log_5(5^3) = 3$\nSumming: $5 + 4 - 3 = 6$.",
    mnemonic: "BASE POWER RULE: When argument equals base raised to power $n$, log is simply $n$.",
    difficulty: "easy",
  },
  {
    subject: "Mathematics",
    year: 2023,
    text: "If $\\log_{10} 2 = 0.3010$ and $\\log_{10} 3 = 0.4771$, evaluate $\\log_{10} 18$.",
    options: [
      { id: "A", text: "1.2552" },
      { id: "B", text: "1.0791" },
      { id: "C", text: "1.1552" },
      { id: "D", text: "0.9542" },
    ],
    correctOption: "A",
    topic: "Indices and Logarithms",
    concept: "Product rule of logarithms",
    explanation: "Factor 18 into prime factors: $18 = 2 \\times 3^2$.\n$\\log_{10} 18 = \\log_{10}(2 \\times 3^2) = \\log_{10} 2 + 2\\log_{10} 3$.\nSubstitute: $0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552$.",
    mnemonic: "L-P-P (Log of Product = Plus): Split factors, multiply exponent into coefficient.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2022,
    text: "Solve for $x$ in the equation: $2^{2x+1} - 9(2^x) + 4 = 0$.",
    options: [
      { id: "A", text: "x = 1 or x = -2" },
      { id: "B", text: "x = 2 or x = -1" },
      { id: "C", text: "x = -1 or x = 3" },
      { id: "D", text: "x = 2 or x = 1" },
    ],
    correctOption: "B",
    topic: "Indices and Logarithms",
    concept: "Quadratic equations disguised as indices",
    explanation: "Rewrite $2^{2x+1} = 2 \\cdot (2^x)^2$. Let $y = 2^x$.\nThe equation becomes $2y^2 - 9y + 4 = 0$.\nFactorizing: $(2y - 1)(y - 4) = 0 \\implies y = \\frac{1}{2}$ or $y = 4$.\nRe-substituting $y = 2^x$:\n• $2^x = \\frac{1}{2} = 2^{-1} \\implies x = -1$\n• $2^x = 4 = 2^2 \\implies x = 2$.\nThus, $x = 2$ or $x = -1$.",
    mnemonic: "SUBSTITUTE & SOLVE: Let $y = a^x$ to collapse exponential towers into standard quadratics.",
    difficulty: "hard",
  },
  {
    subject: "Mathematics",
    year: 2021,
    text: "Simplify the surd expression: $\\frac{3\\sqrt{2} + 2\\sqrt{3}}{\\sqrt{3} - \\sqrt{2}}$.",
    options: [
      { id: "A", text: "6 + 5\\sqrt{6}" },
      { id: "B", text: "5\\sqrt{6} - 6" },
      { id: "C", text: "12 + 5\\sqrt{6}" },
      { id: "D", text: "6 + \\sqrt{6}" },
    ],
    correctOption: "C",
    topic: "Surds and Radicals",
    concept: "Rationalization of surds with conjugate pairs",
    explanation: "Multiply numerator and denominator by conjugate $(\\sqrt{3} + \\sqrt{2})$:\nDenominator: $(\\sqrt{3} - \\sqrt{2})(\\sqrt{3} + \\sqrt{2}) = 3 - 2 = 1$.\nNumerator: $(3\\sqrt{2} + 2\\sqrt{3})(\\sqrt{3} + \\sqrt{2})$\n$= 3\\sqrt{6} + 3(2) + 2(3) + 2\\sqrt{6} = 5\\sqrt{6} + 6 + 6 = 12 + 5\\sqrt{6}$.",
    mnemonic: "CONJUGATE FLIP: $(a - \\sqrt{b})(a + \\sqrt{b}) = a^2 - b$ eliminates radicals completely.",
    difficulty: "medium",
  },
  {
    subject: "Mathematics",
    year: 2024,
    text: "Find the derivative $\\frac{dy}{dx}$ of $y = \\frac{2x^3 - 5}{x^2 + 1}$ at $x = 1$.",
    options: [
      { id: "A", text: "1.5" },
      { id: "B", text: "3.5" },
      { id: "C", text: "4.5" },
      { id: "D", text: "6.0" },
    ],
    correctOption: "C",
    topic: "Calculus (Differentiation)",
    concept: "Quotient Rule of Differentiation",
    explanation: "Use Quotient Rule: $\\frac{d}{dx}[\\frac{u}{v}] = \\frac{v u' - u v'}{v^2}$.\nHere $u = 2x^3 - 5 \\implies u' = 6x^2$; $v = x^2 + 1 \\implies v' = 2x$.\nAt $x = 1$: $u = -3$, $u' = 6$, $v = 2$, $v' = 2$.\n$\\frac{dy}{dx} = \\frac{(2)(6) - (-3)(2)}{2^2} = \\frac{12 + 6}{4} = \\frac{18}{4} = 4.5$.",
    mnemonic: "LOW D-HIGH MINUS HIGH D-LOW OVER LOW-SQUARED: $(v u' - u v') / v^2$.",
    difficulty: "medium",
  },

  // ── PHYSICS: Mechanics & Kinematics ──
  {
    subject: "Physics",
    year: 2024,
    text: "A projectile is launched from ground level with an initial velocity of $40\\text{ m/s}$ at an angle of $30^\\circ$ to the horizontal. Calculate its maximum height. [Take $g = 10\\text{ m/s}^2$].",
    options: [
      { id: "A", text: "10 m" },
      { id: "B", text: "20 m" },
      { id: "C", text: "40 m" },
      { id: "D", text: "80 m" },
    ],
    correctOption: "B",
    topic: "Projectiles and Motion",
    concept: "Maximum height of a projectile",
    explanation: "Formula for maximum height: $H = \\frac{u^2 \\sin^2 \\theta}{2g}$.\nGiven: $u = 40\\text{ m/s}$, $\\theta = 30^\\circ \\implies \\sin 30^\\circ = 0.5$.\n$H = \\frac{40^2 \\times (0.5)^2}{2 \\times 10} = \\frac{1600 \\times 0.25}{20} = \\frac{400}{20} = 20\\text{ m}$.",
    mnemonic: "H-MAX SIN SQUARED: $H = u^2 \\sin^2(\\theta) / (2g)$ vs Range $= u^2 \\sin(2\\theta) / g$.",
    diagramSvg: `<svg viewBox="0 0 400 200" class="w-full h-40 bg-slate-900 rounded-xl p-2"><path d="M 30 170 Q 200 20 370 170" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6"/><line x1="20" y1="170" x2="380" y2="170" stroke="#64748b" stroke-width="2"/><line x1="200" y1="170" x2="200" y2="95" stroke="#ef4444" stroke-width="2" stroke-dasharray="3"/><circle cx="200" cy="95" r="5" fill="#f59e0b"/><text x="210" y="135" fill="#ef4444" font-size="12" font-weight="bold">H = 20 m</text><text x="45" y="155" fill="#38bdf8" font-size="12">θ = 30°</text><text x="35" y="185" fill="#94a3b8" font-size="10">Launch</text><text x="340" y="185" fill="#94a3b8" font-size="10">Impact</text></svg>`,
    difficulty: "medium",
  },
  {
    subject: "Physics",
    year: 2023,
    text: "A body of mass $5\\text{ kg}$ rests on a rough horizontal surface with coefficient of static friction $\\mu_s = 0.4$. What minimum horizontal force is required to start moving the body? [Take $g = 10\\text{ m/s}^2$].",
    options: [
      { id: "A", text: "2.0 N" },
      { id: "B", text: "12.5 N" },
      { id: "C", text: "20.0 N" },
      { id: "D", text: "50.0 N" },
    ],
    correctOption: "C",
    topic: "Friction and Newton's Laws",
    concept: "Limiting static friction",
    explanation: "Normal reaction on a horizontal surface: $R = mg = 5 \\times 10 = 50\\text{ N}$.\nLimiting frictional force: $F_{\\text{limit}} = \\mu_s R = 0.4 \\times 50 = 20\\text{ N}$.\nThus, a force greater than $20\\text{ N}$ is required to initiate motion.",
    mnemonic: "FRICTION FORMULA: $F = \\mu R$ — Weight pushes down, reaction pushes up, friction opposes slide.",
    diagramSvg: `<svg viewBox="0 0 350 160" class="w-full h-36 bg-slate-900 rounded-xl p-2"><rect x="125" y="60" width="100" height="60" fill="#3b82f6" rx="8"/><line x1="30" y1="120" x2="320" y2="120" stroke="#94a3b8" stroke-width="3"/><line x1="225" y1="90" x2="280" y2="90" stroke="#10b981" stroke-width="3"/><polygon points="280,86 295,90 280,94" fill="#10b981"/><line x1="125" y1="90" x2="70" y2="90" stroke="#ef4444" stroke-width="3"/><polygon points="70,86 55,90 70,94" fill="#ef4444"/><text x="155" y="95" fill="#ffffff" font-weight="bold">5 kg</text><text x="240" y="80" fill="#10b981" font-size="12">P = ?</text><text x="75" y="80" fill="#ef4444" font-size="12">F = 20 N</text></svg>`,
    difficulty: "easy",
  },
  {
    subject: "Physics",
    year: 2024,
    text: "An object is placed $15\\text{ cm}$ in front of a concave mirror of focal length $10\\text{ cm}$. Find the image distance and its nature.",
    options: [
      { id: "A", text: "30 cm, real and inverted" },
      { id: "B", text: "30 cm, virtual and erect" },
      { id: "C", text: "6 cm, real and inverted" },
      { id: "D", text: "6 cm, virtual and erect" },
    ],
    correctOption: "A",
    topic: "Reflection at Curved Surfaces",
    concept: "Mirror formula and sign conventions",
    explanation: "Mirror formula: $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$.\nFor a concave mirror: $f = +10\\text{ cm}$, object distance $u = +15\\text{ cm}$.\n$\\frac{1}{v} = \\frac{1}{10} - \\frac{1}{15} = \\frac{3 - 2}{30} = \\frac{1}{30} \\implies v = +30\\text{ cm}$.\nSince $v > 0$, the image is real, inverted, and located $30\\text{ cm}$ in front of the mirror.",
    mnemonic: "REAL IS POSITIVE: In standard JAMB sign convention, real images have positive distances.",
    diagramSvg: `<svg viewBox="0 0 380 150" class="w-full h-36 bg-slate-900 rounded-xl p-2"><line x1="20" y1="75" x2="360" y2="75" stroke="#64748b" stroke-width="2"/><path d="M 330 20 Q 300 75 330 130" fill="none" stroke="#38bdf8" stroke-width="4"/><line x1="180" y1="75" x2="180" y2="35" stroke="#f59e0b" stroke-width="3"/><polygon points="176,35 180,25 184,35" fill="#f59e0b"/><line x1="60" y1="75" x2="60" y2="135" stroke="#ef4444" stroke-width="3"/><polygon points="56,135 60,145 64,135" fill="#ef4444"/><circle cx="230" cy="75" r="4" fill="#10b981"/><text x="225" y="95" fill="#10b981" font-size="11">F (10cm)</text><text x="165" y="105" fill="#f59e0b" font-size="11">u = 15cm</text><text x="45" y="65" fill="#ef4444" font-size="11">v = 30cm (Real)</text></svg>`,
    difficulty: "medium",
  },

  // ── CHEMISTRY: Stoichiometry & Organic Chemistry ──
  {
    subject: "Chemistry",
    year: 2024,
    text: "What volume of oxygen gas measured at s.t.p. is required for the complete combustion of $44\\text{ g}$ of propane ($\\text{C}_3\\text{H}_8$)? [Molar volume $= 22.4\\text{ dm}^3$, $\\text{C}=12, \\text{H}=1$].",
    options: [
      { id: "A", text: "22.4 dm³" },
      { id: "B", text: "44.8 dm³" },
      { id: "C", text: "89.6 dm³" },
      { id: "D", text: "112.0 dm³" },
    ],
    correctOption: "D",
    topic: "Stoichiometry and Mole Concept",
    concept: "Gas stoichiometry and combustion equations",
    explanation: "Balanced combustion equation:\n$$\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}$$\nMolar mass of $\\text{C}_3\\text{H}_8 = (3 \\times 12) + (8 \\times 1) = 44\\text{ g/mol}$.\nNumber of moles of propane $= \\frac{44\\text{ g}}{44\\text{ g/mol}} = 1\\text{ mol}$.\nFrom stoichiometry, $1\\text{ mol }\\text{C}_3\\text{H}_8$ requires $5\\text{ mol }\\text{O}_2$.\nVolume of $\\text{O}_2 = 5 \\times 22.4\\text{ dm}^3 = 112.0\\text{ dm}^3$.",
    mnemonic: "BALANCE FIRST: Never calculate stoichiometric gas volumes without balancing the chemical equation first!",
    difficulty: "medium",
  },
  {
    subject: "Chemistry",
    year: 2023,
    text: "In the electrochemical cell $\\text{Zn(s)} | \\text{Zn}^{2+}\\text{(aq)} || \\text{Cu}^{2+}\\text{(aq)} | \\text{Cu(s)}$, what occurs at the anode?",
    options: [
      { id: "A", text: "Reduction of Cu²⁺ ions" },
      { id: "B", text: "Oxidation of Zinc metal" },
      { id: "C", text: "Reduction of Zinc ions" },
      { id: "D", text: "Oxidation of Copper metal" },
    ],
    correctOption: "B",
    topic: "Redox and Electrochemistry",
    concept: "Electrochemical cell notation and electrode reactions",
    explanation: "In cell notation, the anode is written on the LEFT and the cathode on the RIGHT.\nAt the anode, oxidation (loss of electrons) occurs: $\\text{Zn(s)} \\rightarrow \\text{Zn}^{2+}\\text{(aq)} + 2e^-$.\nAt the cathode, reduction (gain of electrons) occurs: $\\text{Cu}^{2+}\\text{(aq)} + 2e^- \\rightarrow \\text{Cu(s)}$.",
    mnemonic: "AN OX & RED CAT: ANode = OXidation; REDuction = CAThode. Also OIL RIG (Oxidation Is Loss, Reduction Is Gain).",
    diagramSvg: `<svg viewBox="0 0 360 160" class="w-full h-36 bg-slate-900 rounded-xl p-2"><rect x="50" y="40" width="80" height="90" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/><rect x="230" y="40" width="80" height="90" fill="#1e293b" stroke="#f59e0b" stroke-width="2" rx="4"/><rect x="80" y="25" width="20" height="70" fill="#94a3b8"/><rect x="260" y="25" width="20" height="70" fill="#ea580c"/><path d="M 90 25 L 90 10 L 270 10 L 270 25" fill="none" stroke="#10b981" stroke-width="3"/><path d="M 110 50 Q 180 30 250 50" fill="none" stroke="#cbd5e1" stroke-width="8"/><text x="60" y="145" fill="#38bdf8" font-size="11" font-weight="bold">Anode (Zn Oxidation)</text><text x="240" y="145" fill="#f59e0b" font-size="11" font-weight="bold">Cathode (Cu Reduction)</text></svg>`,
    difficulty: "easy",
  },
  {
    subject: "Chemistry",
    year: 2024,
    text: "Which of the following organic compounds will decolorize bromine water in the absence of sunlight and undergo addition polymerization?",
    options: [
      { id: "A", text: "Ethane (C₂H₆)" },
      { id: "B", text: "Ethene (C₂H₄)" },
      { id: "C", text: "Benzene (C₆H₆)" },
      { id: "D", text: "Ethanol (C₂H₅OH)" },
    ],
    correctOption: "B",
    topic: "Hydrocarbons and Alkenes",
    concept: "Test for unsaturation in carbon-carbon double bonds",
    explanation: "Ethene contains a carbon-carbon double bond ($C=C$, unsaturation).\nUnsaturated hydrocarbons readily decolorize brown bromine water by electrophilic addition to form 1,2-dibromoethane:\n$$\\text{CH}_2=\\text{CH}_2 + \\text{Br}_2 \\rightarrow \\text{CH}_2\\text{Br}-\\text{CH}_2\\text{Br}$$\nSaturated alkanes (ethane) require UV light for substitution.",
    mnemonic: "UNSATURATED DOUBLE BOND = QUICK ADDITION: Alkenes snap open their pi-bond to drink up bromine color.",
    difficulty: "easy",
  },

  // ── BIOLOGY: Genetics & Physiology ──
  {
    subject: "Biology",
    year: 2024,
    text: "In a monohybrid cross between two heterozygous tall pea plants (Tt), what percentage of the F₁ generation is expected to be homozygous tall (TT)?",
    options: [
      { id: "A", text: "25%" },
      { id: "B", text: "50%" },
      { id: "C", text: "75%" },
      { id: "D", text: "100%" },
    ],
    correctOption: "A",
    topic: "Genetics and Mendelian Heredity",
    concept: "Punnett square genotypic ratio in monohybrid cross",
    explanation: "Crossing two heterozygotes ($Tt \\times Tt$):\n• Gametes: $T, t$ from parent 1, and $T, t$ from parent 2.\n• Offspring genotypic breakdown: $1 TT : 2 Tt : 1 tt$.\n• Genotypic percentages: $25\\% TT$, $50\\% Tt$, $25\\% tt$.\nTherefore, the percentage of homozygous tall plants ($TT$) is $25\\%$. (Note: phenotypic ratio is $75\\%$ tall to $25\\%$ dwarf).",
    mnemonic: "GENOTYPE vs PHENOTYPE: 1:2:1 for genes (TT, Tt, tt), but 3:1 for what you see (Tall vs Dwarf).",
    diagramSvg: `<svg viewBox="0 0 260 160" class="w-full h-36 bg-slate-900 rounded-xl p-2"><line x1="90" y1="30" x2="90" y2="130" stroke="#64748b" stroke-width="2"/><line x1="170" y1="30" x2="170" y2="130" stroke="#64748b" stroke-width="2"/><line x1="30" y1="80" x2="230" y2="80" stroke="#64748b" stroke-width="2"/><text x="120" y="25" fill="#38bdf8" font-weight="bold">T</text><text x="195" y="25" fill="#38bdf8" font-weight="bold">t</text><text x="45" y="60" fill="#38bdf8" font-weight="bold">T</text><text x="45" y="115" fill="#38bdf8" font-weight="bold">t</text><text x="115" y="60" fill="#10b981" font-weight="black">TT (25%)</text><text x="190" y="60" fill="#f59e0b" font-weight="bold">Tt</text><text x="115" y="115" fill="#f59e0b" font-weight="bold">Tt</text><text x="190" y="115" fill="#ef4444" font-weight="bold">tt (25%)</text></svg>`,
    difficulty: "medium",
  },
  {
    subject: "Biology",
    year: 2023,
    text: "Which of the following cellular organelles is primarily responsible for the hydrolytic breakdown of cellular waste and autolysis?",
    options: [
      { id: "A", text: "Ribosome" },
      { id: "B", text: "Lysosome" },
      { id: "C", text: "Endoplasmic Reticulum" },
      { id: "D", text: "Centriole" },
    ],
    correctOption: "B",
    topic: "Cell Structure and Functions",
    concept: "Hydrolytic enzymes in lysosomes",
    explanation: "Lysosomes contain powerful acid hydrolases that digest obsolete cellular components, pathogens, and cellular debris.\n• Ribosomes synthesize proteins.\n• Endoplasmic reticulum transports substances.\n• Centrioles form spindle fibers during mitosis.",
    mnemonic: "LYSOSOME = LYSES (CUTS/DIGESTS): Remember 'lysis' means splitting or dissolution.",
    difficulty: "easy",
  },

  // ── USE OF ENGLISH: Lexis, Structure & Oral Forms ──
  {
    subject: "Use of English",
    year: 2024,
    text: "Choose the word opposite in meaning to the italicized word:\n\n*The candidate gave an **equivocal** response during the screening interview.*",
    options: [
      { id: "A", text: "ambiguous" },
      { id: "B", text: "unambiguous" },
      { id: "C", text: "evasive" },
      { id: "D", text: "hesitant" },
    ],
    correctOption: "B",
    topic: "Antonyms and Vocabulary",
    concept: "Word opposites (Antonyms)",
    explanation: "'Equivocal' means vague, ambiguous, or open to multiple conflicting interpretations.\nThe exact opposite (antonym) is 'unambiguous' (clear, direct, and leaving no doubt).",
    mnemonic: "EQUIVOCAL = EQUAL VOICES (Confusing) vs UNAMBIGUOUS = ONE CLEAR VOICE.",
    difficulty: "medium",
  },
  {
    subject: "Use of English",
    year: 2023,
    text: "From the words lettered A to D, choose the word that contains the vowel sound represented by the phonetic symbol /i:/:",
    options: [
      { id: "A", text: "sit" },
      { id: "B", text: "machine" },
      { id: "C", text: "busy" },
      { id: "D", text: "women" },
    ],
    correctOption: "B",
    topic: "Oral English and Phonetics",
    concept: "Long vowel /i:/ recognition in non-standard orthography",
    explanation: "The phonetic symbol /i:/ represents the long vowel sound as in 'see', 'seat', or 'machine' (/məˈʃiːn/).\nIn 'sit', 'busy', and 'women', the vowel sound is short /ɪ/.",
    mnemonic: "COLON IN PHONETICS = LONG VOWEL: Two dots /:/ always indicate a stretched, elongated vowel sound.",
    difficulty: "hard",
  },

  // ── ECONOMICS: Elasticity, Market Structures & Macroeconomics ──
  {
    subject: "Economics",
    year: 2024,
    text: "If a 10% increase in the price of commodity X leads to a 25% decrease in the quantity demanded of commodity X, the price elasticity of demand is:",
    options: [
      { id: "A", text: "0.40 (Inelastic)" },
      { id: "B", text: "1.00 (Unitary)" },
      { id: "C", text: "2.50 (Elastic)" },
      { id: "D", text: "5.00 (Perfect)" },
    ],
    correctOption: "C",
    topic: "Theory of Demand and Elasticity",
    concept: "Price elasticity of demand coefficient calculation",
    explanation: "Price Elasticity of Demand (PED) = $\\frac{\\% \\text{ Change in Quantity Demanded}}{\\% \\text{ Change in Price}}$.\n$\\text{PED} = \\frac{-25\\%}{10\\%} = |-2.5| = 2.5$.\nSince $\\text{PED} > 1$, the demand is price-elastic (consumers are highly responsive to price changes).",
    mnemonic: "ELASTICITY > 1 IS ELASTIC: Stretches more than the price tap.",
    diagramSvg: `<svg viewBox="0 0 320 180" class="w-full h-36 bg-slate-900 rounded-xl p-2"><line x1="40" y1="150" x2="300" y2="150" stroke="#94a3b8" stroke-width="2"/><line x1="40" y1="20" x2="40" y2="150" stroke="#94a3b8" stroke-width="2"/><line x1="60" y1="40" x2="280" y2="120" stroke="#ec4899" stroke-width="3"/><text x="25" y="30" fill="#94a3b8" font-size="11">Price</text><text x="270" y="165" fill="#94a3b8" font-size="11">Quantity</text><text x="180" y="65" fill="#ec4899" font-size="12" font-weight="bold">Flatter Curve = Elastic (PED = 2.5)</text></svg>`,
    difficulty: "easy",
  },
  {
    subject: "Economics",
    year: 2023,
    text: "Which of the following is characteristic of a perfectly competitive market in long-run equilibrium?",
    options: [
      { id: "A", text: "Supernormal profit and high barriers to entry" },
      { id: "B", text: "Normal profit where Price = Marginal Cost = Average Cost" },
      { id: "C", text: "Price discrimination and differentiated products" },
      { id: "D", text: "Single seller with price setting power" },
    ],
    correctOption: "B",
    topic: "Market Structures and Perfect Competition",
    concept: "Long-run equilibrium conditions of a competitive firm",
    explanation: "In a perfectly competitive market, free entry and exit ensure that firms earn only NORMAL profit in the long run ($P = MR = MC = AC$).\nIf supernormal profits exist, new firms enter, increasing industry supply and driving down price until profit is normalized.",
    mnemonic: "P = MR = MC = AC: The golden equality for perfect competition long-run bliss.",
    difficulty: "medium",
  },

  // ── GOVERNMENT: Constitutional Development in Nigeria ──
  {
    subject: "Government",
    year: 2024,
    text: "Which of the following Nigerian colonial constitutions first introduced the principle of federalism into Nigeria by creating three distinct regional governments (North, West, and East)?",
    options: [
      { id: "A", text: "Clifford Constitution of 1922" },
      { id: "B", text: "Richards Constitution of 1946" },
      { id: "C", text: "Macpherson Constitution of 1951" },
      { id: "D", text: "Lyttelton Constitution of 1954" },
    ],
    correctOption: "D",
    topic: "Constitutional Development in Nigeria",
    concept: "Formal establishment of federalism under the Lyttelton Constitution",
    explanation: "The Lyttelton Constitution of 1954 formally established federalism in Nigeria by providing distinct legislative lists (Exclusive and Concurrent) and granting regional autonomy to the Northern, Western, and Eastern regions.\n• Clifford (1922) introduced the elective principle.\n• Richards (1946) introduced regionalism without federal legislative autonomy.\n• Macpherson (1951) was quasi-federal.",
    mnemonic: "LYTTELTON = LIFTED FEDERALISM: Remember 1954 Lyttelton made Nigeria a true Federation.",
    difficulty: "medium",
  },

  // ── LITERATURE IN ENGLISH: Literary Devices & Drama ──
  {
    subject: "Literature in English",
    year: 2024,
    text: "\"The classroom was a buzzing beehive of unruly students.\" The dominant figure of speech used above is:",
    options: [
      { id: "A", text: "Simile" },
      { id: "B", text: "Metaphor" },
      { id: "C", text: "Personification" },
      { id: "D", text: "Synecdoche" },
    ],
    correctOption: "B",
    topic: "Literary Devices and Figures of Speech",
    concept: "Direct comparison without 'like' or 'as' (Metaphor)",
    explanation: "A metaphor makes a direct equation between two unrelated things without using 'like' or 'as'. Here, the classroom is directly stated to be a beehive.\nIf it said 'like a beehive', it would be a simile.",
    mnemonic: "METAPHOR IS DIRECT: 'A is B' (Metaphor) vs 'A is LIKE B' (Simile).",
    difficulty: "easy",
  },
];

async function seedJambQuestions() {
  console.log(`Starting real-world JAMB questions seed (${REAL_WORLD_JAMB_QUESTIONS.length} master questions)...`);

  let insertedCount = 0;
  for (const q of REAL_WORLD_JAMB_QUESTIONS) {
    await prisma.question.upsert({
      where: {
        text_subject_year: {
          text: q.text,
          subject: q.subject,
          year: q.year,
        },
      },
      update: {
        options: JSON.stringify(q.options),
        correctOption: q.correctOption,
        topic: q.topic,
        concept: q.concept,
        explanation: q.explanation,
        mnemonic: q.mnemonic || null,
        diagramSvg: q.diagramSvg || null,
        difficulty: q.difficulty || "medium",
        isActive: true,
      },
      create: {
        subject: q.subject,
        year: q.year,
        text: q.text,
        options: JSON.stringify(q.options),
        correctOption: q.correctOption,
        topic: q.topic,
        concept: q.concept,
        explanation: q.explanation,
        mnemonic: q.mnemonic || null,
        diagramSvg: q.diagramSvg || null,
        difficulty: q.difficulty || "medium",
        isActive: true,
      },
    });
    insertedCount++;
  }

  console.log(`Successfully seeded ${insertedCount} real-world JAMB questions with mnemonics and diagrams!`);
}

seedJambQuestions()
  .catch((err) => {
    console.error("Error seeding JAMB questions:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

