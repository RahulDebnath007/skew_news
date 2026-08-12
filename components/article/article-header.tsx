"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BookmarkIcon,
  ShareIcon,
  MoreIcon,
} from "@/components/ui/icons";

interface ArticleHeaderProps {
  title: string;
  category: string;
  country: string;
  author: string;
  publishedDate: string;
  readTime: string;
  imageUrl?: string;
}

interface SavedPost {
  id: string;
  title: string;
  imageUrl?: string;
  source?: string;
  publishedDate?: string;
}

const SAVED_STORAGE_KEY = "skew-saved-posts";
const SAVED_UPDATED_EVENT = "skew-saved-posts-updated";

function ActionButton({
  label,
  children,
  showLabel = false,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  showLabel?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-text-primary"
    >
      {children}

      {showLabel && (
        <span className="text-body-sm">
          {label}
        </span>
      )}
    </button>
  );
}

/**
 * Breadcrumb, title, byline and article actions.
 *
 * Save state is synchronized through localStorage and the
 * custom "skew-saved-posts-updated" browser event so that
 * TopBar, Home cards and Article pages can stay in sync.
 */
export function ArticleHeader({
  title,
  category,
  country,
  author,
  publishedDate,
  readTime,
  imageUrl,
}: ArticleHeaderProps) {
  const pathname = usePathname();

  const [isSaved, setIsSaved] = useState(false);

  /*
   * The article id is taken from:
   *
   * /news/[article-id]
   */
  const articleId =
    pathname?.split("/").filter(Boolean).pop() ?? "";

  /*
   * Check whether the current article exists
   * inside the saved-posts localStorage array.
   */
  function checkSavedStatus(): void {
    if (!articleId) {
      setIsSaved(false);
      return;
    }

    try {
      const raw = localStorage.getItem(
        SAVED_STORAGE_KEY,
      );

      if (!raw) {
        setIsSaved(false);
        return;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        setIsSaved(false);
        return;
      }

      const alreadySaved = parsed.some(
        (post: unknown) =>
          post &&
          typeof post === "object" &&
          "id" in post &&
          (post as { id?: unknown }).id === articleId,
      );

      setIsSaved(alreadySaved);
    } catch (error) {
      console.error(
        "Failed to check saved article status:",
        error,
      );

      setIsSaved(false);
    }
  }

  /*
   * Initial saved-state check + synchronization.
   *
   * This is important because another component may save
   * or unsave the same article while this page is open.
   */
  useEffect(() => {
    if (!articleId) return;

    checkSavedStatus();

    window.addEventListener(
      SAVED_UPDATED_EVENT,
      checkSavedStatus,
    );

    return () => {
      window.removeEventListener(
        SAVED_UPDATED_EVENT,
        checkSavedStatus,
      );
    };
  }, [articleId]);

  /*
   * Save / unsave the current article.
   */
  function handleSave(): void {
    if (!articleId) return;

    try {
      const raw = localStorage.getItem(
        SAVED_STORAGE_KEY,
      );

      let savedPosts: SavedPost[] = [];

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          savedPosts = parsed.filter(
            (post: unknown): post is SavedPost =>
              !!post &&
              typeof post === "object" &&
              "id" in post &&
              typeof (post as { id?: unknown }).id ===
                "string",
          );
        }
      }

      const alreadySaved = savedPosts.some(
        (post) => post.id === articleId,
      );

      if (alreadySaved) {
        /*
         * UNSAVE
         */
        savedPosts = savedPosts.filter(
          (post) => post.id !== articleId,
        );

        setIsSaved(false);
      } else {
        /*
         * SAVE
         */
        const newPost: SavedPost = {
  id: articleId,
  title,
  imageUrl: imageUrl || "",
  source: category,
  publishedDate,
};

        savedPosts = [
          newPost,
          ...savedPosts,
        ];

        setIsSaved(true);
      }

      /*
       * Persist the new saved state.
       */
      localStorage.setItem(
        SAVED_STORAGE_KEY,
        JSON.stringify(savedPosts),
      );

      /*
       * Notify every interested component:
       *
       * - TopBar
       * - Home cards
       * - Article pages
       */
      window.dispatchEvent(
        new Event(SAVED_UPDATED_EVENT),
      );
    } catch (error) {
      console.error(
        "Failed to update saved article:",
        error,
      );
    }
  }

  return (
    <header className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <p className="text-caption text-text-secondary">
        {category}

        <span className="mx-1">
          ·
        </span>

        {country}
      </p>

      {/* Article title */}
      <h1 className="text-h1 text-text-primary">
        {title}
      </h1>

      {/* Byline + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-body-sm text-text-secondary">
          By {author}

          <span className="mx-1.5 text-border">
            |
          </span>

          {publishedDate}

          <span className="mx-1.5 text-border">
            |
          </span>

          {readTime}
        </p>

        <div className="flex items-center gap-4">
          {/* Save / Unsave */}
          <ActionButton
            label={isSaved ? "Unsave" : "Save"}
            showLabel
            onClick={handleSave}
          >
            <BookmarkIcon />
          </ActionButton>

          {/* Share */}
          <ActionButton
            label="Share"
            showLabel
          >
            <ShareIcon />
          </ActionButton>

          {/* More options */}
          <ActionButton label="More options">
            <MoreIcon />
          </ActionButton>
        </div>
      </div>
    </header>
  );
}