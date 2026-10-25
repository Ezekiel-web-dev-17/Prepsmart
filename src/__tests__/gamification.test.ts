import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { XP_RULES, type XpEventType } from "../lib/gamification";

describe("PrepSmart Gamification & XP Rules Engine", () => {
  it("defines positive XP rewards for all user engagement events", () => {
    const requiredEvents: XpEventType[] = [
      "QUESTION_ANSWERED",
      "TOPIC_COMPLETED",
      "DAILY_STREAK",
      "DIAGNOSTIC_COMPLETED",
      "MOCK_EXAM_COMPLETED",
    ];

    for (const event of requiredEvents) {
      assert.ok(XP_RULES[event] > 0, `XP reward for ${event} should be strictly greater than 0`);
    }
  });

  it("awards 150 XP for mock exam completion and 100 for diagnostics", () => {
    assert.strictEqual(XP_RULES.MOCK_EXAM_COMPLETED, 150);
    assert.strictEqual(XP_RULES.DIAGNOSTIC_COMPLETED, 100);
    assert.strictEqual(XP_RULES.DAILY_STREAK, 25);
    assert.strictEqual(XP_RULES.TOPIC_COMPLETED, 50);
    assert.strictEqual(XP_RULES.QUESTION_ANSWERED, 5);
  });
});
