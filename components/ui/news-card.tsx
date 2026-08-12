"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BiasMeter } from "@/components/ui/bias-meter";
import type { NewsArticleCard } from "@/lib/types";

const SAVED_POSTS_KEY = "skew-saved-posts";
const SAVED_UPDATED_EVENT = "skew-saved-posts-updated";

interface SavedPost {
  id: string;
  title: string;
  imageUrl?: string;
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

  /*
   * IMPORTANT:
   * imageUrl is optional because articles saved from
   * the ArticleHeader may not contain an imageUrl.
   */
  return (
    typeof item.id === "string" &&
    item.id.trim() !== "" &&
    item.id !== "undefined" &&
    item.id !== "null" &&
    typeof item.title === "string" &&
    item.title.trim() !== ""
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
   * Read the current saved state from localStorage.
   */
  function syncSavedState(): void {
    try {
      const raw = localStorage.getItem(SAVED_POSTS_KEY);

      if (!raw) {
        setIsSaved(false);
        return;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        setIsSaved(false);
        return;
      }

      const validPosts = parsed.filter(isValidSavedPost);

      setIsSaved(
        validPosts.some(
          (post) => post.id === String(id),
        ),
      );
    } catch {
      setIsSaved(false);
    }
  }

  /**
   * Initial saved-state check.
   *
   * Also listens for saves/unsaves performed from:
   * - ArticleHeader
   * - TopBar
   * - another NewsCard
   */
  useEffect(() => {
    syncSavedState();

    function handleSavedPostsUpdated(): void {
      syncSavedState();
    }

    window.addEventListener(
      SAVED_UPDATED_EVENT,
      handleSavedPostsUpdated,
    );

    return () => {
      window.removeEventListener(
        SAVED_UPDATED_EVENT,
        handleSavedPostsUpdated,
      );
    };
  }, [id]);

  /**
   * Track article click.
   */
  function handleClick(): void {
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
  ): void {
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

      /*
       * Keep all valid saved posts.
       *
       * imageUrl is optional so that posts saved from
       * ArticleHeader are preserved.
       */
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
        /*
         * UNSAVE
         */
        updatedPosts = savedPosts.filter(
          (post) => post.id !== articleId,
        );

        setIsSaved(false);

        posthog.capture("article_unsaved", {
          article_id: id,
        });
      } else {
        /*
         * SAVE
         */
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

      /*
       * Save the updated list.
       */
      localStorage.setItem(
        SAVED_POSTS_KEY,
        JSON.stringify(updatedPosts),
      );

      /*
       * Notify every component that uses saved posts.
       */
      window.dispatchEvent(
        new Event(SAVED_UPDATED_EVENT),
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