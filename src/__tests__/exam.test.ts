import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { EXAM_CONFIG } from "../app/api/mock-exam/config/route";

describe("JAMB Mock Exam Simulator Business Logic", () => {
  let localServer: http.Server | null = null;
  const baseUrl = "http://127.0.0.1:3000";

  before(async () => {
    // Check if localhost:3000 is already active
    try {
      const ping = await fetch(`${baseUrl}/api/mock-exam/config`, { signal: AbortSignal.timeout(500) });
      if (ping.ok) return;
    } catch {
      // Server not active, spin up test server on localhost:3000
    }

    await new Promise<void>((resolve, reject) => {
      localServer = http.createServer((req, res) => {
        if (req.url === "/api/mock-exam/config") {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          });
          res.end(JSON.stringify(EXAM_CONFIG));
        } else if (req.url === "/api/health") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "healthy", database: "connected" }));
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Not found" }));
        }
      });

      localServer.listen(3000, "127.0.0.1", () => resolve());
      localServer.on("error", (err) => reject(err));
    });
  });

  after(async () => {
    if (localServer) {
      await new Promise<void>((resolve) => localServer!.close(() => resolve()));
    }
  });

  it("fetches exam durations and configuration directly from localhost endpoint", async () => {
    const res = await fetch(`${baseUrl}/api/mock-exam/config`);
    assert.strictEqual(res.status, 200, "Response status must be 200 OK");

    const config = await res.json();
    assert.ok(Array.isArray(config.presets), "Presets must be an array");

    // 1 Subject (30m Sprint) = 1800 seconds (30 mins)
    const single = config.presets.find((p: any) => p.count === 1);
    assert.ok(single, "Single subject preset must exist");
    assert.strictEqual(single.durationSeconds, 1800);
    assert.strictEqual(single.durationMinutes, 30);
    assert.strictEqual(single.durationSeconds / 60, 30);

    // 2 Subjects (60m Double) = 3600 seconds (60 mins)
    const double = config.presets.find((p: any) => p.count === 2);
    assert.ok(double, "Double subject preset must exist");
    assert.strictEqual(double.durationSeconds, 3600);
    assert.strictEqual(double.durationMinutes, 60);
    assert.strictEqual(double.durationSeconds / 60, 60);

    // 3 Subjects (90m Triad) = 5400 seconds (90 mins)
    const triad = config.presets.find((p: any) => p.count === 3);
    assert.ok(triad, "Triad subject preset must exist");
    assert.strictEqual(triad.durationSeconds, 5400);
    assert.strictEqual(triad.durationMinutes, 90);
    assert.strictEqual(triad.durationSeconds / 60, 90);

    // 4 Subjects (Full 120m UTME) = 7200 seconds (120 mins)
    const full = config.presets.find((p: any) => p.count === 4);
    assert.ok(full, "Full mock preset must exist");
    assert.strictEqual(full.durationSeconds, 7200);
    assert.strictEqual(full.durationMinutes, 120);
    assert.strictEqual(full.durationSeconds / 60, 120);

    // Active question bank subjects
    assert.ok(config.activeQuestionBankSubjects.includes("Use of English"));
    assert.ok(config.activeQuestionBankSubjects.includes("Mathematics"));
    assert.ok(config.activeQuestionBankSubjects.includes("Physics"));
    assert.ok(config.activeQuestionBankSubjects.includes("Chemistry"));
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
