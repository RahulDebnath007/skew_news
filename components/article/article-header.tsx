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
      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
    >
      {children}
      {showLabel && <span className="text-body-sm">{label}</span>}
    </button>
  );
}

/** Breadcrumb, title, and byline row with functional save/share actions. */
export function ArticleHeader({
  title,
  category,
  country,
  author,
  publishedDate,
  readTime,
}: ArticleHeaderProps) {
  const pathname = usePathname();

  const [isSaved, setIsSaved] = useState(false);

  /*
   * The article ID is already present in the news detail URL:
   * /news/[article-id]
   */
  const articleId =
    pathname?.split("/").filter(Boolean).pop() ?? "";

  /*
   * Check whether this article is already saved.
   */
  useEffect(() => {
    if (!articleId) return;

    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);

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
    } catch {
      setIsSaved(false);
    }
  }, [articleId]);

  /*
   * Save / unsave the current article.
   *
   * This uses the exact same localStorage key and custom event
   * that TopBar already uses.
   */
  function handleSave(): void {
    if (!articleId) return;

    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);

      let savedPosts: SavedPost[] = [];

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          savedPosts = parsed.filter(
            (post: unknown): post is SavedPost =>
              !!post &&
              typeof post === "object" &&
              "id" in post &&
              typeof (post as { id?: unknown }).id === "string",
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
          source: category,
          publishedDate,
        };

        savedPosts = [newPost, ...savedPosts];

        setIsSaved(true);
      }

      localStorage.setItem(
        SAVED_STORAGE_KEY,
        JSON.stringify(savedPosts),
      );

      /*
       * Tell TopBar to immediately refresh its saved count.
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
      <p className="text-caption text-text-secondary">
        {category} <span className="mx-1">·</span> {country}
      </p>

      <h1 className="text-h1 text-text-primary">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-body-sm text-text-secondary">
          By {author}{" "}
          <span className="mx-1.5 text-border">|</span>{" "}
          {publishedDate}{" "}
          <span className="mx-1.5 text-border">|</span>{" "}
          {readTime}
        </p>

        <div className="flex items-center gap-4">
          <ActionButton
            label={isSaved ? "Unsave" : "Save"}
            showLabel
            onClick={handleSave}
          >
            <BookmarkIcon />
          </ActionButton>

          <ActionButton
            label="Share"
            showLabel
          >
            <ShareIcon />
          </ActionButton>

          <ActionButton label="More options">
            <MoreIcon />
          </ActionButton>
        </div>
      </div>
    </header>
  );
}