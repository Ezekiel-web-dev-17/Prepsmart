/**
 * Utilities for JAMB UTME Question Curation & Google Dorking Pipeline
 * Provides search query templates, regex parsers, and enrichment helpers
 * for authentic Nigerian past questions.
 */

export interface DorkQueryTemplate {
  subject: string;
  topic: string;
  source: string;
  dorkQuery: string;
}

export interface RawParsedQuestion {
  subject: string;
  year?: number;
  text: string;
  options: { id: string; text: string }[];
  correctOption: string;
  topic?: string;
  concept?: string;
  explanation: string;
}

// Common Google Dork templates for Nigerian examination portals
export function generateJambDorkQueries(subject: string, topic: string): DorkQueryTemplate[] {
  return [
    {
      subject,
      topic,
      source: "myschool.ng",
      dorkQuery: `site:myschool.ng/classroom/exam-questions "JAMB" "${subject}" "${topic}"`,
    },
    {
      subject,
      topic,
      source: "flashlearners.com",
      dorkQuery: `site:flashlearners.com "JAMB past questions" "${subject}" "${topic}"`,
    },
    {
      subject,
      topic,
      source: "edupadi.com",
      dorkQuery: `site:edupadi.com "JAMB" "${subject}" "${topic}" "Question"`,
    },
  ];
}

// Mnemonics & Visual Diagram Knowledge Base
export const UTME_CONCEPT_ENRICHMENTS: Record<
  string,
  { mnemonic?: string; diagramSvg?: string }
> = {
  "Indices and Logarithms": {
    mnemonic: "BASE POWER RULE: log_b(b^n) = n. When argument equals base raised to power, the log is the power.",
  },
  "Surds and Radicals": {
    mnemonic: "CONJUGATE FLIP: (a - √b)(a + √b) = a² - b eliminates square roots from denominators completely.",
  },
  Calculus: {
    mnemonic: "LOW D-HIGH MINUS HIGH D-LOW: (v u' - u v') / v² for quotient rule differentiation.",
  },
  "Kinematics and Projectiles": {
    mnemonic: "FORTY-FIVE FLIES FARTHEST: Maximum projectile range R occurs strictly at 45 degrees.",
    diagramSvg: `<svg viewBox="0 0 300 160" class="w-full max-w-[280px] h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="140" x2="280" y2="140" stroke="#64748b" stroke-width="2"/>
      <line x1="20" y1="140" x2="20" y2="20" stroke="#64748b" stroke-width="2"/>
      <path d="M 20 140 Q 150 10 280 140" stroke="#3b82f6" stroke-width="3" fill="none"/>
      <circle cx="150" cy="75" r="4" fill="#ef4444"/>
      <text x="150" y="60" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Max Height (v_y = 0)</text>
      <text x="150" y="155" text-anchor="middle" fill="#64748b" font-size="10">Range R = (u² sin 2θ) / g</text>
    </svg>`,
  },
  "Work, Energy, and Power": {
    mnemonic: "MA OVER VR: Efficiency = (Mechanical Advantage / Velocity Ratio) × 100%.",
  },
  "Waves and Optics": {
    mnemonic: "ROYGBIV: Red, Orange, Yellow, Green, Blue, Indigo, Violet (descending wavelength).",
    diagramSvg: `<svg viewBox="0 0 280 140" class="w-full max-w-[260px] h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="240" height="100" rx="8" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-dasharray="4 4"/>
      <line x1="40" y1="40" x2="140" y2="80" stroke="#eab308" stroke-width="3"/>
      <line x1="140" y1="80" x2="240" y2="110" stroke="#eab308" stroke-width="3"/>
      <line x1="140" y1="20" x2="140" y2="130" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="2 2"/>
      <text x="145" y="35" fill="#94a3b8" font-size="10">Normal</text>
      <text x="80" y="55" fill="#eab308" font-size="11" font-weight="bold">i (incident)</text>
      <text x="190" y="105" fill="#eab308" font-size="11" font-weight="bold">r (refracted)</text>
    </svg>`,
  },
  "Stoichiometry and Gas Laws": {
    mnemonic: "LIGHTER GAS LEAPS AHEAD: Graham's diffusion rate is inversely proportional to square root of molar mass.",
  },
  Electrochemistry: {
    mnemonic: "OIL RIG & AN OX RED CAT: Oxidation Is Loss (Anode), Reduction Is Gain (Cathode).",
    diagramSvg: `<svg viewBox="0 0 280 150" class="w-full max-w-[260px] h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="220" height="90" rx="8" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/>
      <rect x="60" y="20" width="16" height="80" rx="2" fill="#ef4444"/>
      <rect x="200" y="20" width="16" height="80" rx="2" fill="#10b981"/>
      <path d="M 68 20 L 68 10 L 208 10 L 208 20" stroke="#64748b" stroke-width="2"/>
      <text x="68" y="115" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">Anode (+)</text>
      <text x="208" y="115" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">Cathode (-)</text>
      <text x="140" y="75" text-anchor="middle" fill="#3b82f6" font-size="10">Electrolyte (CuSO4)</text>
    </svg>`,
  },
  "Demand and Supply": {
    mnemonic: "PRICE MOVES ALONG, OTHERS SHIFT BEYOND: Price changes slide on the curve; other factors shift the line.",
    diagramSvg: `<svg viewBox="0 0 260 150" class="w-full max-w-[240px] h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="130" x2="240" y2="130" stroke="#64748b" stroke-width="2"/>
      <line x1="30" y1="130" x2="30" y2="20" stroke="#64748b" stroke-width="2"/>
      <line x1="40" y1="30" x2="220" y2="120" stroke="#ef4444" stroke-width="2.5"/>
      <line x1="40" y1="120" x2="220" y2="30" stroke="#10b981" stroke-width="2.5"/>
      <circle cx="130" cy="75" r="4" fill="#3b82f6"/>
      <text x="225" y="125" fill="#ef4444" font-size="11" font-weight="bold">D</text>
      <text x="225" y="35" fill="#10b981" font-size="11" font-weight="bold">S</text>
      <text x="135" y="68" fill="#3b82f6" font-size="10" font-weight="bold">Equilibrium (P*, Q*)</text>
    </svg>`,
  },
};

/**
 * Enriches a raw question with a mnemonic or SVG diagram if matched by topic.
 */
export function enrichQuestionWithConceptData(topic: string) {
  return UTME_CONCEPT_ENRICHMENTS[topic] || {};
}
