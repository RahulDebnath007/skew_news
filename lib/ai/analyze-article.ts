import "server-only";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import type { Article } from "@/lib/supabase/types";
import { analysisSchema, type AnalysisOutput } from "./schema";

/**
 * AI analysis layer.
 *
 * Uses Google Gemini through the Vercel AI SDK with the existing
 * Zod schema for structured and validated output.
 *
 * Server-only — never reaches browser code.
 *
 * Retry-once-then-fail is handled by the orchestrator
 * (lib/pipeline/analyze.ts).
 */

/**
 * Analysis model.
 *
 * Gemini 2.5 Flash is a good fit for article summarization,
 * sentiment analysis, and structured JSON output.
 */
export const ANALYSIS_MODEL = "gemini-3.1-flash-lite";

/**
 * Cap article text sent to the model to bound tokens/cost
 * on long pages.
 */
const MAX_TEXT_CHARS = 12_000;

const SYSTEM_PROMPT = [
  "You are a neutral media-analysis assistant for a news transparency product.",
  "Analyze the single article you are given and return structured analysis.",
  "",
  "Rules:",
  "- Write a neutral, factual summary with no opinion or spin.",
  "- Estimate political framing from the ARTICLE TEXT EVIDENCE ONLY.",
  "  Never infer framing from the source name or your prior knowledge of it.",
  "- leftPercentage, centerPercentage and rightPercentage are each 0–100 and",
  "  should together represent the full framing split (aim for a sum of 100).",
  "- politicalFramingLabel must match the strongest percentage, UNLESS confidence",
  "  is low or the percentages are close — then prefer 'mixed' or 'unclear'.",
  "- If evidence is weak, use 'unclear' and keep confidence low.",
  "- loadedTerms are emotionally charged or slanted words actually present in the text.",
  "- The framing is AI-estimated, not objective truth; say so in the disclaimer.",
].join("\n");

/**
 * Result of analyzing one article. Never throws.
 */
export type AnalyzeArticleResult =
  | { ok: true; output: AnalysisOutput }
  | { ok: false; error: string };

function buildPrompt(article: Article): string {
  const body = article.raw_text.slice(0, MAX_TEXT_CHARS);

  return [
    `TITLE: ${article.title}`,
    `PUBLISHED: ${article.published_at}`,
    "",
    "ARTICLE TEXT:",
    body,
  ].join("\n");
}

/**
 * Run one AI analysis pass.
 *
 * Returns validated output or a typed failure.
 */
export async function analyzeArticle(
  article: Article,
): Promise<AnalyzeArticleResult> {
  try {
    const { object } = await generateObject({
      model: google(ANALYSIS_MODEL),
      schema: analysisSchema,
      system: SYSTEM_PROMPT,
      prompt: buildPrompt(article),
    });

    return {
      ok: true,
      output: object,
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "unknown AI error",
    };
  }
}