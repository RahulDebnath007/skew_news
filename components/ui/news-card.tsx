"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BiasMeter } from "@/components/ui/bias-meter";
import type { NewsArticleCard } from "@/lib/types";

const SAVED_POSTS_KEY = "skew-saved-posts";

interface SavedPost {
  id: string;
  title: string;
  imageUrl: string;
  source?: string;
  publishedDate?: string;
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

interface NewsCardProps {
  article: NewsArticleCard;
  className?: string;
}

const FRAMING_TEXT: Record<
  NonNullable<NewsArticleCard["biasLabel"]>,
  string
> = {
  left: "Left",
  center: "Center",
  right: "Right",
  mixed: "Mixed",
  unclear: "Unclear",
};

function isValidSavedPost(post: unknown): post is SavedPost {
  if (!post || typeof post !== "object") {
    return false;
  }

  const item = post as Partial<SavedPost>;

  return (
    typeof item.id === "string" &&
    item.id.trim() !== "" &&
    item.id !== "undefined" &&
    item.id !== "null" &&
    typeof item.title === "string" &&
    item.title.trim() !== "" &&
    typeof item.imageUrl === "string" &&
    item.imageUrl.trim() !== ""
  );
}

/** Vertical home-grid card with save/bookmark support. */
export function NewsCard({
  article,
  className,
}: NewsCardProps) {
  const {
    id,
    title,
    category,
    country,
    imageUrl,
    bias,
    sources,
    source,
    publishedDate,
    sentimentLabel,
    biasLabel,
    confidence,
  } = article;

  const [isSaved, setIsSaved] = useState(false);

  const metaTop = source
    ? [source, publishedDate]
        .filter(Boolean)
        .join(" · ")
    : `${category} · ${country}`;

  const framingParts = [
    biasLabel && FRAMING_TEXT[biasLabel],
    sentimentLabel &&
      sentimentLabel.charAt(0).toUpperCase() +
        sentimentLabel.slice(1),
    typeof confidence === "number" &&
      `${Math.round(confidence * 100)}%`,
  ].filter(Boolean);

  /**
   * Load this article's saved state.
   * Also cleans old/invalid saved data.
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(
        SAVED_POSTS_KEY,
      );

      if (!raw) {
        setIsSaved(false);
        return;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        localStorage.removeItem(SAVED_POSTS_KEY);
        setIsSaved(false);
        return;
      }

      const validPosts = parsed.filter(
        isValidSavedPost,
      );

      // Automatically remove old blank/corrupted entries.
      if (validPosts.length !== parsed.length) {
        localStorage.setItem(
          SAVED_POSTS_KEY,
          JSON.stringify(validPosts),
        );
      }

      setIsSaved(
        validPosts.some(
          (post) => post.id === String(id),
        ),
      );
    } catch {
      localStorage.removeItem(SAVED_POSTS_KEY);
      setIsSaved(false);
    }
  }, [id]);

  /**
   * Track article click.
   */
  function handleClick() {
    posthog.capture("article_clicked", {
      article_id: id,
      category,
      country,
      bias_label: biasLabel,
      sentiment_label: sentimentLabel,
      source_count: sources,
    });
  }

  /**
   * Save / unsave article.
   */
  function handleSave(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const raw = localStorage.getItem(
        SAVED_POSTS_KEY,
      );

      let parsed: unknown = [];

      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = [];
        }
      }

      // Only keep valid saved posts.
      const savedPosts: SavedPost[] =
        Array.isArray(parsed)
          ? parsed.filter(isValidSavedPost)
          : [];

      const articleId = String(id);

      const alreadySaved = savedPosts.some(
        (post) => post.id === articleId,
      );

      let updatedPosts: SavedPost[];

      if (alreadySaved) {
        // Remove article.
        updatedPosts = savedPosts.filter(
          (post) => post.id !== articleId,
        );

        setIsSaved(false);

        posthog.capture("article_unsaved", {
          article_id: id,
        });
      } else {
        // Save article.
        const newPost: SavedPost = {
          id: articleId,
          title,
          imageUrl,
          source: source || undefined,
          publishedDate:
            publishedDate || undefined,
        };

        updatedPosts = [
          ...savedPosts,
          newPost,
        ];

        setIsSaved(true);

        posthog.capture("article_saved", {
          article_id: id,
        });
      }

      localStorage.setItem(
        SAVED_POSTS_KEY,
        JSON.stringify(updatedPosts),
      );

      // Tell TopBar to refresh immediately.
      window.dispatchEvent(
        new Event("skew-saved-posts-updated"),
      );
    } catch (error) {
      console.error(
        "Failed to update saved posts:",
        error,
      );
    }
  }

  return (
    <Link
      href={`/news/${id}`}
      onClick={handleClick}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-bg-primary p-4 shadow-sm",
        "transition-shadow hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-surface">
        {/* Article image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={
            isSaved
              ? "Remove from saved posts"
              : "Save post"
          }
          title={
            isSaved
              ? "Remove from saved posts"
              : "Save post"
          }
          className={cn(
            "absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full",
            "bg-bg-primary/90 text-text-secondary shadow-sm",
            "transition-all hover:scale-105 hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
            isSaved && "text-accent",
          )}
        >
          <BookmarkIcon filled={isSaved} />
        </button>

        {/* Info */}
        <span className="absolute right-2 top-2 rounded-full bg-bg-primary/90 p-1 text-text-secondary shadow-sm">
          <InfoIcon />
        </span>
      </div>

      {/* Source / date */}
      <p className="text-caption text-text-secondary">
        {metaTop}
      </p>

      {/* Title */}
      <h3 className="text-h4 font-semibold text-text-primary">
        {title}
      </h3>

      {/* Bias */}
      <BiasMeter
        left={bias.left}
        center={bias.center}
        right={bias.right}
        compact
        className="mt-auto"
      />

      {/* Framing */}
      <p className="text-caption text-text-secondary">
        {source
          ? framingParts.join(" · ")
          : `${sources} ${
              sources === 1
                ? "source"
                : "sources"
            }`}
      </p>
    </Link>
  );
}