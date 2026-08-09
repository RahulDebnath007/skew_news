import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/api/admin-auth";
import { runManualScrape } from "@/lib/pipeline/scrape";
import { getPostHogClient } from "@/lib/posthog-server";
import type { ScrapeOptions } from "@/lib/pipeline/types";

/**
 * POST /api/scrape
 *
 * Admin-secret protected.
 * Runs the manual scrape-to-insert pipeline synchronously
 * and returns the run summary.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function parseOptions(body: unknown): ScrapeOptions {
  if (!body || typeof body !== "object") {
    return {};
  }

  const record = body as Record<string, unknown>;

  const sources = Array.isArray(record.sources)
    ? record.sources.filter(
        (s): s is string => typeof s === "string"
      )
    : undefined;

  const limitPerSource =
    typeof record.limitPerSource === "number" &&
    Number.isFinite(record.limitPerSource)
      ? record.limitPerSource
      : undefined;

  return {
    sources,
    limitPerSource,
  };
}

export async function POST(request: Request) {
  // 1. Authenticate request
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Parse JSON request body
  let body: unknown = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // 3. Run scraping pipeline
  try {
    const summary = await runManualScrape(
      parseOptions(body)
    );

    // 4. Send analytics event
    const posthog = getPostHogClient();

    posthog.capture({
      distinctId: "skew_server",
      event: "scrape_completed",
      properties: {
        status: summary.status,
        sources_checked: summary.sourcesChecked,
        articles_inserted: summary.articlesInserted,
        articles_rejected: summary.articlesRejected,
        duplicates_skipped: summary.duplicatesSkipped,
        duration_ms: summary.durationMs,
      },
    });

    await posthog.flush();

    // 5. Return scrape summary
    return NextResponse.json(summary, {
      status: 200,
    });
  } catch (err) {
    console.error("[scrape] run failed:", err);

    return NextResponse.json(
      {
        error: "Scrape failed",
        status: "failed",
      },
      { status: 500 }
    );
  }
}