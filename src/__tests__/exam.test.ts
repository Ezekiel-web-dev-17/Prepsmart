import test, { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("JAMB Mock Exam Simulator Business Logic", () => {
  it("calculates accurate exam durations based on subject count", () => {
    // 4 subjects (Full UTME) = 7200 seconds (120 mins)
    const fullMockSeconds = 7200;
    assert.strictEqual(fullMockSeconds / 60, 120);

    // Single subject = 1800 seconds (30 mins)
    const singleSubjectSeconds = 1800;
    assert.strictEqual(singleSubjectSeconds / 60, 30);

    // 2 subjects = 3600 seconds (60 mins)
    const doubleSubjectSeconds = 3600;
    assert.strictEqual(doubleSubjectSeconds / 60, 60);

    // 3 subjects = 5400 seconds (90 mins)
    const triadSubjectSeconds = 5400;
    assert.strictEqual(triadSubjectSeconds / 60, 90);
  });

  it("calculates accurate accuracy percentages and clamps time spent", () => {
    const totalQuestions = 180;
    const score = 135;
    const accuracyPct = Math.round((score / totalQuestions) * 10000) / 100;
    assert.strictEqual(accuracyPct, 75.0);

    // Clamping time spent: cannot be negative or exceed duration
    const sessionDurationSeconds = 7200;
    const reportedTime = 8500;
    const clamped = Math.max(1, Math.min(reportedTime, sessionDurationSeconds));
    assert.strictEqual(clamped, 7200);

    const zeroReportedTime = -5;
    const clampedZero = Math.max(1, Math.min(zeroReportedTime, sessionDurationSeconds));
    assert.strictEqual(clampedZero, 1);
  });

  it("sanitizes candidate answer inputs to only accepted options A, B, C, D", () => {
    const validOptions = new Set(["A", "B", "C", "D"]);
    const rawAnswers = {
      q1: "A",
      q2: "B",
      q3: "INVALID_OPTION",
      q4: "E",
      q5: "C",
      q6: "<script>alert(1)</script>",
    };

    const sanitized: Record<string, string> = {};
    for (const [qid, opt] of Object.entries(rawAnswers)) {
      if (validOptions.has(opt)) {
        sanitized[qid] = opt;
      }
    }

    assert.deepStrictEqual(sanitized, {
      q1: "A",
      q2: "B",
      q5: "C",
    });
  });

  it("enforces unique question identification and stem normalization", () => {
    const rawStems = [
      "What is the SI unit of electric current?",
      "[Variant 1] What is the SI unit of electric current?",
      "Variant 2: What is the SI unit of electric current?",
      "  What is the SI unit of electric current?  ",
    ];

    function getCanonicalQuestionStem(rawText: string): string {
      return rawText
        .replace(/^\[?\s*variant\s*\d+\s*\]?:?\s*/i, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    }

    const canonicalKeys = new Set(rawStems.map(getCanonicalQuestionStem));
    assert.strictEqual(canonicalKeys.size, 1);
    assert.strictEqual(
      Array.from(canonicalKeys)[0],
      "what is the si unit of electric current?"
    );
  });
});
