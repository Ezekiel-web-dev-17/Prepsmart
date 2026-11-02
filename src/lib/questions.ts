/**
 * Utility for shuffling question options dynamically.
 * Solves the "Option A" bug by ensuring options are randomized while
 * maintaining absolute accuracy of the correctOption identifier.
 */

export interface OptionItem {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
}

export interface ShufflableQuestion {
  id?: string;
  options: string | OptionItem[];
  correctOption?: string;
  [key: string]: unknown;
}

const LETTERS = ["A", "B", "C", "D"];

/**
 * Deterministic PRNG using a xorshift32-style hash (far better avalanche than
 * the old LCG) so seeds that differ by one character produce wildly different
 * streams.  The input seed is first hashed to a 32-bit integer via a
 * MurmurHash-inspired mix, then each call advances the state with xorshift32.
 */
function createDeterministicRandom(seed: string) {
  // Mix seed string into a 32-bit state with better avalanche than a simple
  // polynomial hash (the old hash << 5 trick collapsed similar seeds).
  let h = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) | 0; // FNV prime multiply
  }
  // Final avalanche mix so even a single bit difference fans out across all bits
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b) | 0;
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35) | 0;
  h ^= h >>> 16;
  // State must be non-zero for xorshift32
  let state = h || 0xdeadbeef;
  return function (): number {
    // xorshift32 — period 2^32-1, passes all basic randomness tests
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000; // Unsigned float in [0, 1)
  };
}

/**
 * Dynamically shuffles the options array for every question on the server
 * before sending it to the client. Ensures correctOption remains accurate
 * regardless of its new position.
 *
 * @param question - The question object containing options and correctOption
 * @param seed - Optional deterministic seed (e.g. sessionToken + questionId) for mock exams
 * @returns A cloned question with randomized options and updated correctOption
 */
export function shuffleOptions<T extends ShufflableQuestion>(
  question: T,
  seed?: string
): T {
  // 1. Parse options array
  let parsedOptions: OptionItem[] = [];
  const isString = typeof question.options === "string";

  if (isString) {
    try {
      parsedOptions = JSON.parse(question.options as string);
    } catch {
      parsedOptions = [];
    }
  } else if (Array.isArray(question.options)) {
    parsedOptions = [...question.options];
  }

  if (parsedOptions.length === 0) {
    return { ...question };
  }

  // 2. Identify the text of the correct option prior to shuffling
  const originalCorrectLetter = question.correctOption;
  const correctOptionItem = originalCorrectLetter
    ? parsedOptions.find((opt) => opt.id === originalCorrectLetter)
    : null;
  const correctText = correctOptionItem ? correctOptionItem.text : null;

  // 3. Shuffle options using Fisher-Yates (deterministic if seed provided, random otherwise)
  const rng = seed ? createDeterministicRandom(seed) : Math.random;
  const shuffled = [...parsedOptions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 4. Re-assign standard option IDs [A, B, C, D] in new display order
  let newCorrectOption = originalCorrectLetter;
  const finalOptions: OptionItem[] = shuffled.map((opt, index) => {
    const newLetter = LETTERS[index] || opt.id;
    // If this option was originally the correct answer, update correctOption to new position
    if (
      (originalCorrectLetter && opt.id === originalCorrectLetter) ||
      (correctText !== null && opt.text === correctText)
    ) {
      newCorrectOption = newLetter;
    }
    return {
      id: newLetter,
      text: opt.text,
    };
  });

  return {
    ...question,
    options: isString ? JSON.stringify(finalOptions) : finalOptions,
    ...(question.correctOption !== undefined
      ? { correctOption: newCorrectOption }
      : {}),
  };
}
