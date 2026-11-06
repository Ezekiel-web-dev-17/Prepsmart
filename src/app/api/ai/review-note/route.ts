import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface ReviewRequest {
  subject: string;
  topicSlug: string;
  topicTitle: string;
  studentNote: string;
  syllabusOutlines?: string[];
  textbookAdvice?: { textbook: string; chapters: string; focusNote: string }[];
}

interface ReviewResponse {
  score: number; // 0 - 100
  passed: boolean; // >= 60
  summary: string;
  strengths: string[];
  missingConcepts: string[];
  textbookTip: string;
  evaluatedBy: "gemini" | "heuristic";
}

// Fallback heuristic evaluator for zero-cost, offline, or unconfigured environments
function evaluateNoteHeuristically(
  note: string,
  topicTitle: string,
  subject: string,
  syllabusOutlines?: string[],
  textbookAdvice?: { textbook: string; chapters: string; focusNote: string }[]
): ReviewResponse {
  const trimmed = note.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Recommended textbook default
  const defaultTextbook =
    textbookAdvice && textbookAdvice.length > 0
      ? `${textbookAdvice[0].textbook} (${textbookAdvice[0].chapters}): ${textbookAdvice[0].focusNote}`
      : `Check standard ${subject} textbook chapters on ${topicTitle}.`;

  if (wordCount < 15) {
    return {
      score: 35,
      passed: false,
      summary:
        "Your note is too brief to demonstrate full conceptual mastery. The Feynman technique requires explaining the principle thoroughly in simple terms.",
      strengths: ["You started noting down the concept."],
      missingConcepts: [
        "Include core definitions and underlying principles.",
        "Give at least one practical example or formula application.",
      ],
      textbookTip: defaultTextbook,
      evaluatedBy: "heuristic",
    };
  }

  // Extract key vocabulary from topic and syllabus outlines
  const keyTokens: string[] = [
    ...topicTitle.toLowerCase().split(/[\s,&/-]+/),
    ...(syllabusOutlines || []).flatMap((o) => o.toLowerCase().split(/[\s,&/-]+/)),
  ].filter((w) => w.length > 3);

  const uniqueKeyTokens = Array.from(new Set(keyTokens));
  const lowerNote = trimmed.toLowerCase();

  let matchedTokens = 0;
  for (const token of uniqueKeyTokens) {
    if (lowerNote.includes(token)) {
      matchedTokens++;
    }
  }

  // Calculate score components:
  // 1. Length & depth (up to 35 pts)
  const lengthScore = Math.min(35, Math.round((wordCount / 60) * 35));
  // 2. Keyword & concept relevance (up to 40 pts)
  const keywordRatio = uniqueKeyTokens.length > 0 ? matchedTokens / Math.min(uniqueKeyTokens.length, 8) : 0.5;
  const keywordScore = Math.min(40, Math.round(keywordRatio * 40));
  // 3. Structure & sentence diversity (up to 25 pts)
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceScore = Math.min(25, sentences.length * 6);

  const totalScore = Math.min(96, Math.max(40, lengthScore + keywordScore + sentenceScore));
  const passed = totalScore >= 60;

  const strengths: string[] = [];
  if (wordCount >= 40) {
    strengths.push("Good descriptive depth and structured breakdown of the idea.");
  } else {
    strengths.push("Concise identification of key concepts.");
  }
  if (matchedTokens >= 3) {
    strengths.push(`Accurately incorporated relevant ${subject} vocabulary.`);
  }

  const missingConcepts: string[] = [];
  if (wordCount < 45) {
    missingConcepts.push("Elaborate on how this topic connects to typical JAMB calculation or reasoning questions.");
  }
  if (matchedTokens < 2) {
    missingConcepts.push(`Try mentioning specific technical terms directly related to "${topicTitle}".`);
  }
  if (missingConcepts.length === 0) {
    missingConcepts.push("Review examiner edge cases or traps where negative signs or units get inverted.");
  }

  return {
    score: totalScore,
    passed,
    summary: passed
      ? `Solid Feynman summary! You demonstrated a good foundational grasp of ${topicTitle}. You are ready for the topic drill quiz.`
      : `You have an initial grasp, but your explanation needs more detail and specific principles to pass the mastery gate (60% required).`,
    strengths,
    missingConcepts,
    textbookTip: defaultTextbook,
    evaluatedBy: "heuristic",
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    // Allow both authenticated and guest candidates to get AI evaluation
    const body = (await req.json()) as ReviewRequest;
    const { subject, topicSlug, topicTitle, studentNote, syllabusOutlines, textbookAdvice } = body;

    if (!topicTitle || !studentNote) {
      return NextResponse.json(
        { error: "topicTitle and studentNote are required." },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // If Gemini key is available, attempt real-time Gemini 2.5 Flash review
    if (geminiKey) {
      try {
        const prompt = `You are a top-tier Nigerian JAMB UTME academic tutor specializing in ${subject}.
A candidate is studying the topic "${topicTitle}" (Syllabus reference: ${topicSlug}).
Official Syllabus Outlines:
${(syllabusOutlines || []).map((o) => `• ${o}`).join("\n")}

The candidate was asked to use the Feynman Technique to write a brief summary in their own words explaining what they understand about this topic.
Here is the candidate's written note:
"""
${studentNote}
"""

Evaluate their note strictly and constructively based on:
1. Conceptual accuracy according to the JAMB syllabus.
2. Clarity of thought (explaining the "why" and "how", not just reciting keywords).
3. Presence of fundamental principles, formulas, or standard definitions.
4. Identification of any common misconceptions.

Return ONLY a valid JSON object with the following schema, and no extra markdown or codeblock ticks:
{
  "score": <number between 0 and 100>,
  "passed": <boolean: true if score >= 60, false otherwise>,
  "summary": "<2-3 sentence motivating feedback summary>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "missingConcepts": ["<key idea or formula to remember 1>", "<examiner trap or point to review 2>"],
  "textbookTip": "<specific reading advice for standard Nigerian textbooks like Anyakoha, Ababio, Oluwasanmi, Ashade, etc.>"
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3,
              },
            }),
            signal: AbortSignal.timeout(9000),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText) as ReviewResponse;
            return NextResponse.json({
              ...parsed,
              evaluatedBy: "gemini",
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini API call failed or timed out, falling back to heuristic review:", geminiErr);
      }
    }

    // Heuristic fallback
    const result = evaluateNoteHeuristically(
      studentNote,
      topicTitle,
      subject,
      syllabusOutlines,
      textbookAdvice
    );
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
