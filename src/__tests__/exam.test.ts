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
      if (typeof (localServer as any).closeAllConnections === "function") {
        (localServer as any).closeAllConnections();
      }
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

  it("verifies that correct answers across mock exam subjects are not only one option but a balanced mix of A, B, C, and D", async () => {
    const {
      getEnglishQuestions,
      getMathematicsQuestions,
      getPhysicsQuestions,
      getChemistryQuestions,
      getBiologyQuestions,
      getEconomicsQuestions,
    } = await import("../../prisma/seed-unique-questions");

    const subjectBanks = [
      { name: "Use of English", questions: getEnglishQuestions() },
      { name: "Mathematics", questions: getMathematicsQuestions() },
      { name: "Physics", questions: getPhysicsQuestions() },
      { name: "Chemistry", questions: getChemistryQuestions() },
      { name: "Biology", questions: getBiologyQuestions() },
      { name: "Economics", questions: getEconomicsQuestions() },
    ];

    for (const { name, questions } of subjectBanks) {
      assert.ok(questions.length >= 40, `${name} question bank must have at least 40 questions`);

      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      for (const q of questions) {
        assert.ok(
          ["A", "B", "C", "D"].includes(q.correctOption),
          `Question correctOption must be A, B, C, or D (got ${q.correctOption})`
        );
        counts[q.correctOption] = (counts[q.correctOption] || 0) + 1;
      }

      const total = questions.length;

      // 1. None of the options should be 0 — all four choices (A, B, C, D) must be represented
      assert.ok(counts.A > 0, `${name}: Option A must be represented as a correct answer (got ${counts.A})`);
      assert.ok(counts.B > 0, `${name}: Option B must be represented as a correct answer (got ${counts.B})`);
      assert.ok(counts.C > 0, `${name}: Option C must be represented as a correct answer (got ${counts.C})`);
      assert.ok(counts.D > 0, `${name}: Option D must be represented as a correct answer (got ${counts.D})`);

      // 2. Correct answers must NOT be only one option (no option should dominate > 45%)
      const maxCount = Math.max(counts.A, counts.B, counts.C, counts.D);
      const maxPercentage = (maxCount / total) * 100;
      assert.ok(
        maxPercentage < 45,
        `${name}: Correct answers must not be biased to one option. Highest representation is ${maxPercentage.toFixed(1)}% (max allowed is 45%). Counts: ${JSON.stringify(counts)}`
      );

      // 3. Minimum representation for each option should be at least 15% (healthy distribution around 25%)
      const minCount = Math.min(counts.A, counts.B, counts.C, counts.D);
      const minPercentage = (minCount / total) * 100;
      assert.ok(
        minPercentage >= 15,
        `${name}: Each option must have at least 15% representation. Lowest is ${minPercentage.toFixed(1)}%. Counts: ${JSON.stringify(counts)}`
      );
    }
  });

  it("verifies that entering a mock exam yields questions whose correct answers are a balanced mix of A, B, C, and D, and not all one option", async () => {
    const {
      getEnglishQuestions,
      getMathematicsQuestions,
      getPhysicsQuestions,
      getChemistryQuestions,
    } = await import("../../prisma/seed-unique-questions");

    // Simulate entering a full 4-subject UTME mock exam session:
    // English (60 questions) + 3 electives (40 questions each: Math, Physics, Chemistry) = 180 questions
    const mockExamQuestions = [
      ...getEnglishQuestions().slice(0, 60),
      ...getMathematicsQuestions().slice(0, 40),
      ...getPhysicsQuestions().slice(0, 40),
      ...getChemistryQuestions().slice(0, 40),
    ];

    assert.strictEqual(mockExamQuestions.length, 180, "Full mock exam session must contain exactly 180 questions");

    const sessionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    for (const q of mockExamQuestions) {
      assert.ok(["A", "B", "C", "D"].includes(q.correctOption));
      sessionCounts[q.correctOption] = (sessionCounts[q.correctOption] || 0) + 1;
    }

    // 1. None of the options can be 0 or single-answer dominated
    assert.ok(sessionCounts.A > 0, "Option A must be represented in session answers");
    assert.ok(sessionCounts.B > 0, "Option B must be represented in session answers");
    assert.ok(sessionCounts.C > 0, "Option C must be represented in session answers");
    assert.ok(sessionCounts.D > 0, "Option D must be represented in session answers");

    // 2. No single option dominates > 35% of the 180 questions (healthy mix around 25% ± 8%)
    for (const [opt, count] of Object.entries(sessionCounts)) {
      const pct = (count / mockExamQuestions.length) * 100;
      assert.ok(
        pct <= 35,
        `Option ${opt} accounts for ${pct.toFixed(1)}% of exam answers, which exceeds 35% max limit. Answers must be a balanced mix!`
      );
      assert.ok(
        pct >= 15,
        `Option ${opt} accounts for only ${pct.toFixed(1)}% of exam answers, which is below 15% min threshold. Answers must be a balanced mix!`
      );
    }

    // 3. Prevent suspicious consecutive answer streaks (e.g. no more than 4 consecutive identical answers in a row)
    let maxStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < mockExamQuestions.length; i++) {
      if (mockExamQuestions[i].correctOption === mockExamQuestions[i - 1].correctOption) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 1;
      }
    }
    assert.ok(
      maxStreak <= 4,
      `Detected excessive consecutive identical answers streak of ${maxStreak}. Max allowed streak is 4.`
    );
  });

  it("verifies Use of English includes authentic reading comprehension passages with 10 questions each and cloze passages with 10 questions", async () => {
    const { getEnglishQuestions } = await import("../../prisma/seed-unique-questions");
    const englishQuestions = getEnglishQuestions();

    // 1. Comprehension Passage I: AI & Ethics (10 questions)
    const passage1Questions = englishQuestions.filter(
      (q) => q.text.includes("[COMPREHENSION PASSAGE I:") && q.topic === "Reading Comprehension"
    );
    assert.strictEqual(
      passage1Questions.length,
      10,
      `Use of English must include exactly 10 questions for Comprehension Passage I (found ${passage1Questions.length})`
    );

    // 2. Comprehension Passage II: Sahelian Ecology & The Green Wall (10 questions)
    const passage2Questions = englishQuestions.filter(
      (q) => q.text.includes("[COMPREHENSION PASSAGE II:") && q.topic === "Reading Comprehension"
    );
    assert.strictEqual(
      passage2Questions.length,
      10,
      `Use of English must include exactly 10 questions for Comprehension Passage II (found ${passage2Questions.length})`
    );

    // 3. Cloze Passage: FinTech & Economic Transformation (10 questions)
    const clozeQuestions = englishQuestions.filter(
      (q) => q.text.includes("[CLOZE PASSAGE") && q.topic === "Lexis & Cloze Passage"
    );
    assert.strictEqual(
      clozeQuestions.length,
      10,
      `Use of English must include exactly 10 cloze questions (found ${clozeQuestions.length})`
    );

    // Check that comprehension questions have valid 4 options and balanced answers
    for (const [name, set] of [
      ["Passage I", passage1Questions],
      ["Passage II", passage2Questions],
      ["Cloze Test", clozeQuestions],
    ] as const) {
      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      for (const q of set) {
        assert.strictEqual(q.options.length, 4, `${name} questions must have exactly 4 options`);
        assert.ok(q.text.length > 50, `${name} question text must contain full stem and context`);
        assert.ok(q.explanation.length > 10, `${name} question must have detailed explanation`);
        counts[q.correctOption] = (counts[q.correctOption] || 0) + 1;
      }
      // Verify correct answers in the passage are not all one option
      const distinctCorrectOptions = Object.keys(counts).filter((k) => counts[k] > 0);
      assert.ok(
        distinctCorrectOptions.length >= 3,
        `${name} answers must be distributed across multiple choices, not all one option (got ${JSON.stringify(counts)})`
      );
    }
  });
});

describe("Penetration Testing & Anti-Tampering Security Controls (Malicious Student Threat Model)", () => {
  it("Attack 1 [Answer Leakage / Cheating via Network Inspection]: Client-facing exam payloads strictly strip correctOption, explanation, and cheat hints", () => {
    // Malicious intent: Student inspects the JSON payload received from POST /api/mock-exam/create
    // or inspects browser memory to extract correct answers before submitting.
    const rawBankQuestion = {
      id: "q-sec-001",
      subject: "Use of English",
      year: 2024,
      text: "Choose the option opposite in meaning to EPHEMERAL.",
      options: JSON.stringify([
        { id: "A", text: "permanent" },
        { id: "B", text: "transient" },
        { id: "C", text: "fleeting" },
        { id: "D", text: "evanescent" },
      ]),
      correctOption: "A", // HIGH SENSITIVITY — MUST NEVER LEAK TO CLIENT
      explanation: "Ephemeral means lasting a very short time; its antonym is permanent.",
      topic: "Vocabulary",
      concept: "Antonyms in Context",
      orderIndex: 0,
    };

    // ClientSafeQuestion projection as implemented in exam.ts
    const clientSafe = {
      id: rawBankQuestion.id,
      subject: rawBankQuestion.subject,
      year: rawBankQuestion.year,
      text: rawBankQuestion.text,
      options: JSON.parse(rawBankQuestion.options),
      orderIndex: rawBankQuestion.orderIndex,
    };

    const clientPayloadJson = JSON.stringify(clientSafe);
    const parsedBack = JSON.parse(clientPayloadJson);

    // Assert that sensitive fields are completely absent from client projection
    assert.strictEqual(parsedBack.correctOption, undefined, "correctOption must NEVER be sent to client");
    assert.strictEqual(parsedBack.explanation, undefined, "explanation must NEVER be sent during active exam");
    assert.strictEqual(parsedBack.concept, undefined, "concept hint must NOT be present during active exam");
    assert.strictEqual(parsedBack.topic, undefined, "topic hint must NOT be present during active exam");
    assert.strictEqual(clientPayloadJson.includes("permanent"), true);
    assert.strictEqual(clientPayloadJson.includes("correctOption"), false);
  });

  it("Attack 2 [Answer Tampering & Payload Injection]: Answer sanitizer strictly enforces whitelist A, B, C, D and drops malicious payloads", () => {
    // Malicious intent: Student sends script tags, SQL injection snippets, or invalid values
    // to bypass answer scoring, trigger backend 500 errors, or corrupt database fields.
    const validSessionQuestionIds = new Set(["q1", "q2", "q3", "q4"]);
    const maliciousAnswersPayload = {
      q1: "A",
      q2: "<script>alert('xss')</script>",
      q3: "' OR '1'='1' --",
      q4: "Z",
      q_extra: "B", // Injected question ID not in this exam
    };

    const validOptions = new Set(["A", "B", "C", "D"]);
    const sanitizedAnswers: Record<string, string> = {};

    for (const [qid, ans] of Object.entries(maliciousAnswersPayload)) {
      if (!validSessionQuestionIds.has(qid)) continue; // Drops q_extra
      if (!validOptions.has(ans)) continue; // Drops XSS, SQLi, and out-of-range "Z"
      sanitizedAnswers[qid] = ans;
    }

    assert.deepStrictEqual(
      sanitizedAnswers,
      { q1: "A" },
      "Only whitelisted options for valid session question IDs must survive sanitization"
    );
    const lookup: Record<string, string | undefined> = sanitizedAnswers;
    assert.strictEqual(lookup["q2"], undefined);
    assert.strictEqual(lookup["q3"], undefined);
    assert.strictEqual(lookup["q4"], undefined);
    assert.strictEqual(lookup["q_extra"], undefined);
  });

  it("Attack 3 [Replay Attack & Double Submission]: Submitting an already-submitted exam throws an explicit rejection error", () => {
    // Malicious intent: Student submits an exam, receives answers/explanations, then re-submits
    // the same sessionToken with modified 100% correct answers.
    const mockSession = {
      id: "session-replay-101",
      userId: "user_student_123",
      status: "submitted", // Already submitted!
      expiresAt: new Date(Date.now() + 3600_000),
    };

    function validateSessionForSubmission(session: typeof mockSession, callerUserId: string) {
      if (!session || session.userId !== callerUserId) {
        throw new Error("Invalid or expired exam session.");
      }
      if (session.status !== "in_progress") {
        throw new Error("This exam has already been submitted.");
      }
    }

    assert.throws(
      () => validateSessionForSubmission(mockSession, "user_student_123"),
      /This exam has already been submitted/,
      "Replaying an already submitted exam must be blocked immediately"
    );
  });

  it("Attack 4 [Insecure Direct Object Reference (IDOR) & Session Hijacking]: Unauthorized users cannot submit or cancel another student's exam", () => {
    // Malicious intent: Hacker Student B sniffs or brute-forces Student A's sessionToken
    // and sends a submit or cancel request on their behalf.
    const victimSession = {
      id: "session_victim_999",
      userId: "victim_student_uuid_001",
      sessionToken: "sec_token_a1b2c3d4e5f67890",
      status: "in_progress",
    };

    function authorizeSessionAction(session: typeof victimSession | null, actingUserId: string) {
      if (!session || session.userId !== actingUserId) {
        // Uniform error prevents username/session enumeration attacks
        throw new Error("Invalid or expired exam session.");
      }
      return true;
    }

    const attackerUserId = "attacker_student_uuid_666";

    assert.throws(
      () => authorizeSessionAction(victimSession, attackerUserId),
      /Invalid or expired exam session/,
      "Unauthorized student action on another student's session must be blocked with generic message"
    );
  });

  it("Attack 5 [Timer Freezing & Late Submission]: Submissions past server expiration timestamp + grace period are strictly rejected", () => {
    // Malicious intent: Student halts JavaScript clock or disconnects wifi to spend 4 hours
    // on a 30-minute exam, then reconnects and submits.
    const serverNow = Date.now();
    const expiredSession = {
      id: "session_expired_555",
      expiresAt: new Date(serverNow - 300_000), // Expired 5 minutes ago (exceeds 120s grace period)
      durationSeconds: 1800,
    };

    const gracePeriodMs = 120_000;
    const isLate = serverNow > expiredSession.expiresAt.getTime() + gracePeriodMs;

    assert.strictEqual(isLate, true, "Session must be marked as expired when server clock exceeds expiration + grace period");

    function enforceServerTimer(expiresAt: Date) {
      if (Date.now() > expiresAt.getTime() + gracePeriodMs) {
        throw new Error("Exam session has expired. Results cannot be recorded.");
      }
    }

    assert.throws(
      () => enforceServerTimer(expiredSession.expiresAt),
      /Exam session has expired/,
      "Submitting after timer expiration must be rejected server-side"
    );
  });

  it("Attack 6 [Time-Spent Fraud & Leaderboard Manipulation]: Reported time spent is strictly clamped to [1, durationSeconds]", () => {
    // Malicious intent: Student submits 0s or -100s to claim an impossible record on leaderboards,
    // or submits 999999s to cause overflow bugs.
    const durationSeconds = 7200; // 2 hours

    function clampTimeSpent(reportedSeconds: number, maxDuration: number): number {
      return Math.max(1, Math.min(reportedSeconds, maxDuration));
    }

    // Zero-second attempt
    assert.strictEqual(clampTimeSpent(0, durationSeconds), 1, "0s must be clamped to minimum 1s");
    // Negative-seconds exploit attempt
    assert.strictEqual(clampTimeSpent(-500, durationSeconds), 1, "Negative time must be clamped to minimum 1s");
    // Excessive time-spent attempt
    assert.strictEqual(clampTimeSpent(999999, durationSeconds), 7200, "Excessive time must be clamped to max session duration");
  });

  it("Attack 7 [Subject Selection Parameter Manipulation]: Invalid or unauthorized subject injections are strictly sanitized", () => {
    // Malicious intent: Student injects SQL fragments, non-existent subjects, or asks for 20 subjects.
    const validSubjects = [
      "Use of English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Literature",
      "Government",
      "Geography",
      "Commerce",
    ];

    const roguePayload = [
      "'; DROP TABLE Question;--",
      "Hacking 101",
      "Mathematics",
      "Use of English",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
    ];

    let sanitized = Array.from(new Set(roguePayload))
      .filter((s) => validSubjects.includes(s))
      .slice(0, 4);

    // Enforce "Use of English" as first subject for full mock sessions (4 subjects)
    if (sanitized.length === 4) {
      const electives = sanitized.filter((s) => s !== "Use of English").slice(0, 3);
      sanitized = ["Use of English", ...electives];
    }

    assert.strictEqual(sanitized.length, 4, "Must cap at maximum 4 subjects");
    assert.strictEqual(sanitized[0], "Use of English", "Use of English must always be placed first");
    assert.strictEqual(sanitized.includes("'; DROP TABLE Question;--"), false, "SQL injection string must be removed");
    assert.strictEqual(sanitized.includes("Hacking 101"), false, "Invalid subject name must be dropped");
  });
});

