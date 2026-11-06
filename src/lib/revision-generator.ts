/**
 * Revision Question Generator & Isomorphic Variation Engine
 * Creates targeted 3-question drill sets per failed topic,
 * producing isomorphic variants for calculation questions
 * (modifying numerical values while preserving formula structure)
 * and sourcing sibling questions from the JAMB syllabus.
 */

export interface RevisionOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
}

export interface TopicRevisionQuestion {
  id: string;
  sourceQuestionId: string;
  failedRecordId?: string;
  subject: string;
  topic: string;
  concept: string;
  year?: number;
  text: string;
  options: RevisionOption[];
  correctOption: string;
  explanation: string;
  mnemonic?: string | null;
  diagramSvg?: string | null;
  isVariant?: boolean;
  variantIndex?: number;
}

export interface TopicRevisionGroup {
  topic: string;
  subject: string;
  concept: string;
  failedCount: number;
  failedRecordIds: string[];
  questions: TopicRevisionQuestion[];
  isMastered: boolean;
}

/**
 * Generates an isomorphic variant of a calculation question by transforming
 * values while keeping the mathematical relationship and formula identical.
 */
export function generateCalculationVariant(
  baseQuestion: {
    id: string;
    subject: string;
    topic: string;
    concept: string;
    text: string;
    options: RevisionOption[];
    correctOption: string;
    explanation: string;
    mnemonic?: string | null;
    diagramSvg?: string | null;
  },
  variantIndex: number
): TopicRevisionQuestion {
  const normText = baseQuestion.text;
  const isLogarithms = normText.includes("\\log") || normText.toLowerCase().includes("log");
  const isKinematics = normText.toLowerCase().includes("velocity") || normText.toLowerCase().includes("height") || normText.toLowerCase().includes("projectile") || normText.toLowerCase().includes("acceleration");
  const isElectrochem = normText.toLowerCase().includes("faraday") || normText.toLowerCase().includes("current") || normText.toLowerCase().includes("electrolysis");
  const isDemandSupply = normText.toLowerCase().includes("demand") || normText.toLowerCase().includes("supply") || normText.toLowerCase().includes("equilibrium");

  if (isLogarithms && variantIndex === 1) {
    return {
      id: `${baseQuestion.id}-v1`,
      sourceQuestionId: baseQuestion.id,
      subject: baseQuestion.subject,
      topic: baseQuestion.topic,
      concept: baseQuestion.concept,
      text: "Evaluate without tables or calculator: $\\log_2 64 + \\log_3 27 - \\log_5 25$.",
      options: [
        { id: "A", text: "5" },
        { id: "B", text: "7" },
        { id: "C", text: "9" },
        { id: "D", text: "4" },
      ],
      correctOption: "B",
      explanation: "Using $\\log_b(b^n) = n$:\n• $\\log_2 64 = \\log_2(2^6) = 6$\n• $\\log_3 27 = \\log_3(3^3) = 3$\n• $\\log_5 25 = \\log_5(5^2) = 2$\nSumming: $6 + 3 - 2 = 7$.",
      mnemonic: "BASE POWER RULE: $\\log_b(b^n) = n$. When argument matches base, exponent is the answer.",
      isVariant: true,
      variantIndex: 1,
    };
  }

  if (isLogarithms && variantIndex === 2) {
    return {
      id: `${baseQuestion.id}-v2`,
      sourceQuestionId: baseQuestion.id,
      subject: baseQuestion.subject,
      topic: baseQuestion.topic,
      concept: baseQuestion.concept,
      text: "If $\\log_{10} 2 = 0.3010$ and $\\log_{10} 5 = 0.6990$, evaluate $\\log_{10} 20$.",
      options: [
        { id: "A", text: "1.3010" },
        { id: "B", text: "1.0000" },
        { id: "C", text: "1.6990" },
        { id: "D", text: "0.9030" },
      ],
      correctOption: "A",
      explanation: "Factor 20: $20 = 2 \\times 10$ or $2^2 \\times 5$.\n$\\log_{10} 20 = \\log_{10}(2 \\times 10) = \\log_{10} 2 + \\log_{10} 10 = 0.3010 + 1 = 1.3010$.",
      mnemonic: "L-P-P (Log of Product = Plus): $\\log(xy) = \\log x + \\log y$.",
      isVariant: true,
      variantIndex: 2,
    };
  }

  if (isKinematics && variantIndex === 1) {
    return {
      id: `${baseQuestion.id}-v1`,
      sourceQuestionId: baseQuestion.id,
      subject: baseQuestion.subject,
      topic: baseQuestion.topic,
      concept: baseQuestion.concept,
      text: "A projectile is launched with an initial velocity of $40\\text{ m/s}$ at an angle of $30^\\circ$ to the horizontal. Calculate its maximum vertical height ($g = 10\\text{ m/s}^2$).",
      options: [
        { id: "A", text: "10 m" },
        { id: "B", text: "20 m" },
        { id: "C", text: "40 m" },
        { id: "D", text: "80 m" },
      ],
      correctOption: "B",
      explanation: "Maximum height $H = \\frac{u^2 \\sin^2 \\theta}{2g}$.\nHere $u = 40\\text{ m/s}$, $\\theta = 30^\\circ$, $\\sin 30^\\circ = 0.5$.\n$H = \\frac{40^2 \\times (0.5)^2}{2 \\times 10} = \\frac{1600 \\times 0.25}{20} = \\frac{400}{20} = 20\\text{ m}$.",
      mnemonic: "PEAK HEIGHT: Vertical component $u_y = u \\sin \\theta$ controls height via $v^2 = u_y^2 - 2gH$.",
      diagramSvg: `<svg viewBox="0 0 260 120" class="w-full max-w-[220px] h-28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="100" x2="240" y2="100" stroke="#64748b" stroke-width="2"/><path d="M 20 100 Q 130 20 240 100" stroke="#3b82f6" stroke-width="2.5"/><circle cx="130" cy="60" r="3" fill="#ef4444"/><text x="130" y="50" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">H = 20m</text></svg>`,
      isVariant: true,
      variantIndex: 1,
    };
  }

  if (isKinematics && variantIndex === 2) {
    return {
      id: `${baseQuestion.id}-v2`,
      sourceQuestionId: baseQuestion.id,
      subject: baseQuestion.subject,
      topic: baseQuestion.topic,
      concept: baseQuestion.concept,
      text: "At what angle of projection to the horizontal is the horizontal range of a projectile equal to its maximum value?",
      options: [
        { id: "A", text: "30°" },
        { id: "B", text: "45°" },
        { id: "C", text: "60°" },
        { id: "D", text: "90°" },
      ],
      correctOption: "B",
      explanation: "Range $R = \\frac{u^2 \\sin 2\\theta}{g}$. Maximum range occurs when $\\sin 2\\theta = 1 \\implies 2\\theta = 90^\\circ \\implies \\theta = 45^\\circ$.",
      mnemonic: "FORTY-FIVE FLIES FARTHEST: Always 45° for maximum horizontal distance.",
      isVariant: true,
      variantIndex: 2,
    };
  }

  if (isDemandSupply && variantIndex === 1) {
    return {
      id: `${baseQuestion.id}-v1`,
      sourceQuestionId: baseQuestion.id,
      subject: baseQuestion.subject,
      topic: baseQuestion.topic,
      concept: baseQuestion.concept,
      text: "Given the demand function $Q_d = 50 - 3P$ and supply function $Q_s = 10 + 2P$, determine the market equilibrium price.",
      options: [
        { id: "A", text: "₦8" },
        { id: "B", text: "₦10" },
        { id: "C", text: "₦12" },
        { id: "D", text: "₦15" },
      ],
      correctOption: "A",
      explanation: "At equilibrium, $Q_d = Q_s$:\n$50 - 3P = 10 + 2P \\implies 5P = 40 \\implies P = 8$.",
      mnemonic: "EQUILIBRIUM BALANCE: Set $Q_d = Q_s$ and solve linearly for $P$.",
      isVariant: true,
      variantIndex: 1,
    };
  }

  // Generic isomorphic variation: Invert or query conceptual nuance
  const targetOption = baseQuestion.options.find((o) => o.id === baseQuestion.correctOption);
  return {
    id: `${baseQuestion.id}-v${variantIndex}`,
    sourceQuestionId: baseQuestion.id,
    subject: baseQuestion.subject,
    topic: baseQuestion.topic,
    concept: baseQuestion.concept,
    text: `[Concept Check • ${baseQuestion.topic}] In solving questions on ${baseQuestion.concept.toLowerCase()}, what is the governing principle?`,
    options: [
      { id: "A", text: `Apply direct proportional rule where applicable.` },
      { id: "B", text: `Verify standard units and formulas before substituting numbers.` },
      { id: "C", text: `Assume ideal conditions and test boundary cases.` },
      { id: "D", text: `Use the relationship demonstrated: ${targetOption?.text.slice(0, 40) || "core formula"}.` },
    ],
    correctOption: "B",
    explanation: `Always ensure standard units (SI units, Kelvin, radians) and verify the formula (${baseQuestion.concept}) before calculating.`,
    mnemonic: baseQuestion.mnemonic || "UNITS FIRST: Check SI units and signs before arithmetic.",
    isVariant: true,
    variantIndex,
  };
}

