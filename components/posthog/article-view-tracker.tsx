"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface ArticleViewTrackerProps {
  articleId: string;
  category: string;
  country: string;
  biasLabel: string | null;
  sentimentLabel: string | null;
  sourceCount: number;
}

export function ArticleViewTracker({
  articleId,
  category,
  country,
  biasLabel,
  sentimentLabel,
  sourceCount,
}: ArticleViewTrackerProps) {
  useEffect(() => {
    posthog.capture("article_viewed", {
      article_id: articleId,
      category,
      country,
      bias_label: biasLabel,
      sentiment_label: sentimentLabel,
      source_count: sourceCount,
    });
  }, [articleId, category, country, biasLabel, sentimentLabel, sourceCount]);

  return null;
}
