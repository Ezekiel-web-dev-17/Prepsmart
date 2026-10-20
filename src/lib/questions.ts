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
 * Simple pseudo-random hash generator for deterministic session shuffling
 */
function createDeterministicRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return function () {
    hash = (hash * 9301 + 49297) % 233280;
    return Math.abs(hash / 233280);
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
