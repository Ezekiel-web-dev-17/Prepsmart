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
  evaluatedBy: "gemini" | "openai" | "groq" | "heuristic";
  modelName?: string;
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

function parseAiJsonResponse(raw: string): ReviewResponse {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
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

    // 1. Check for Google Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      // Try Gemini 2.0 Flash first, fallback to Gemini 1.5 Flash
      const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
      for (const model of models) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
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
              const parsed = parseAiJsonResponse(rawText);
              return NextResponse.json({
                ...parsed,
                evaluatedBy: "gemini",
                modelName: `Google Gemini (${model})`,
              });
            }
          }
        } catch (geminiErr) {
          console.warn(`Gemini (${model}) API call failed:`, geminiErr);
        }
      }
    }

    // 2. Check for OpenAI API key
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content:
                  "You are a top-tier Nigerian JAMB UTME academic tutor. You evaluate student notes according to the official JAMB syllabus and return pure JSON.",
              },
              { role: "user", content: prompt },
            ],
          }),
          signal: AbortSignal.timeout(9000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = parseAiJsonResponse(content);
            return NextResponse.json({
              ...parsed,
              evaluatedBy: "openai",
              modelName: "OpenAI (gpt-4o-mini)",
            });
          }
        }
      } catch (openaiErr) {
        console.warn("OpenAI API call failed:", openaiErr);
      }
    }

    // 3. Check for Groq API key (Ultra-fast Llama 3)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content:
                  "You are a top-tier Nigerian JAMB UTME academic tutor. Return pure JSON adhering to the specified schema.",
              },
              { role: "user", content: prompt },
            ],
          }),
          signal: AbortSignal.timeout(9000),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = parseAiJsonResponse(content);
            return NextResponse.json({
              ...parsed,
              evaluatedBy: "groq",
              modelName: "Groq (Llama 3.3 70B)",
            });
          }
        }
      } catch (groqErr) {
        console.warn("Groq API call failed:", groqErr);
      }
    }

    // 4. Heuristic Fallback Engine (when no external AI API key is configured or network is offline)
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

