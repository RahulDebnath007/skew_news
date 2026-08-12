"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SAVED_POSTS_KEY = "skew-saved-posts";

interface SavedPost {
  id: string;
  title: string;
  imageUrl: string;
  source?: string;
  publishedDate?: string;
}

function isValidSavedPost(
  post: unknown,
): post is SavedPost {
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

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
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

/**
 * Full-width utility bar.
 *
 * Features:
 * - Light / Dark / Auto theme
 * - Dynamic date
 * - Saved posts
 * - Automatic cleanup of invalid saved posts
 */
export function TopBar() {
  const [theme, setTheme] = useState<
    "light" | "dark" | "auto"
  >("light");

  const [currentDate, setCurrentDate] =
    useState("");

  const [savedPosts, setSavedPosts] = useState<
    SavedPost[]
  >([]);

  const [savedOpen, setSavedOpen] =
    useState(false);

  const savedRef =
    useRef<HTMLDivElement>(null);

  /**
   * Apply theme.
   */
  function applyTheme(
    selectedTheme: "light" | "dark" | "auto",
  ) {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.toggle(
        "dark",
        prefersDark,
      );
    }
  }

  /**
   * Load saved theme.
   */
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("skew-theme");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "auto"
    ) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("light");
    }
  }, []);

  /**
   * Change theme.
   */
  function handleThemeChange(
    selectedTheme: "light" | "dark" | "auto",
  ) {
    setTheme(selectedTheme);

    localStorage.setItem(
      "skew-theme",
      selectedTheme,
    );

    applyTheme(selectedTheme);
  }

  /**
   * Dynamic date.
   */
  useEffect(() => {
    function updateDate() {
      const formattedDate =
        new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date());

      setCurrentDate(formattedDate);
    }

    updateDate();

    const interval = setInterval(
      updateDate,
      60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  /**
   * Load and clean saved posts.
   */
  useEffect(() => {
    function loadSavedPosts() {
      try {
        const raw = localStorage.getItem(
          SAVED_POSTS_KEY,
        );

        // Nothing has ever been saved.
        if (!raw) {
          setSavedPosts([]);
          return;
        }

        const parsed: unknown = JSON.parse(raw);

        // Invalid storage format.
        if (!Array.isArray(parsed)) {
          localStorage.removeItem(
            SAVED_POSTS_KEY,
          );

          setSavedPosts([]);
          return;
        }

        // Keep ONLY valid saved articles.
        const validPosts = parsed.filter(
          isValidSavedPost,
        );

        // Clean corrupted/blank old data.
        if (
          validPosts.length !== parsed.length
        ) {
          if (validPosts.length === 0) {
            localStorage.removeItem(
              SAVED_POSTS_KEY,
            );
          } else {
            localStorage.setItem(
              SAVED_POSTS_KEY,
              JSON.stringify(validPosts),
            );
          }
        }

        setSavedPosts(validPosts);
      } catch {
        localStorage.removeItem(
          SAVED_POSTS_KEY,
        );

        setSavedPosts([]);
      }
    }

    // Load immediately.
    loadSavedPosts();

    // Update when NewsCard saves/unsaves.
    window.addEventListener(
      "skew-saved-posts-updated",
      loadSavedPosts,
    );

    return () => {
      window.removeEventListener(
        "skew-saved-posts-updated",
        loadSavedPosts,
      );
    };
  }, []);

  /**
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target = event.target as Node;

      if (
        savedRef.current &&
        !savedRef.current.contains(target)
      ) {
        setSavedOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div className="w-full bg-topbar-bg text-text-secondary">
      <div className="mx-auto flex h-10 max-w-(--container-app) items-center justify-between px-6 text-caption">

        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-5">

          <span className="hover:text-white">
            Browser Extension
          </span>

          {/* Theme */}
          <span className="hidden items-center gap-2 md:flex">
            <span>Theme:</span>

            <button
              type="button"
              onClick={() =>
                handleThemeChange("light")
              }
              className={
                theme === "light"
                  ? "font-semibold text-white"
                  : "hover:text-white"
              }
            >
              Light
            </button>

            <button
              type="button"
              onClick={() =>
                handleThemeChange("dark")
              }
              className={
                theme === "dark"
                  ? "font-semibold text-white"
                  : "hover:text-white"
              }
            >
              Dark
            </button>

            <button
              type="button"
              onClick={() =>
                handleThemeChange("auto")
              }
              className={
                theme === "auto"
                  ? "font-semibold text-white"
                  : "hover:text-white"
              }
            >
              Auto
            </button>
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex min-w-0 items-center gap-4">

          {/* Date */}
          <span className="hidden lg:inline">
            {currentDate}
          </span>

          <span className="hidden text-border lg:inline">
            |
          </span>

          {/* Location */}
          <span className="hidden hover:text-white sm:inline">
            Set Location
          </span>

          <span className="hidden text-border sm:inline">
            |
          </span>

          {/* SAVED */}
          <div
            ref={savedRef}
            className="relative shrink-0"
          >
            <button
              type="button"
              onClick={() =>
                setSavedOpen(
                  (open) => !open,
                )
              }
              className="flex items-center gap-1.5 hover:text-white"
              aria-expanded={savedOpen}
              aria-haspopup="menu"
            >
              <BookmarkIcon />

              <span>Saved</span>

              {/* Show count ONLY when there are valid saved posts */}
              {savedPosts.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-black">
                  {savedPosts.length}
                </span>
              )}

              <ChevronDownIcon />
            </button>

            {/* DROPDOWN */}
            {savedOpen && (
              <div className="absolute right-0 top-7 z-50 w-80 overflow-hidden rounded-lg border border-border bg-bg-primary text-text-primary shadow-lg">

                {/* Header */}
                <div className="border-b border-border px-4 py-3">
                  <p className="text-body-sm font-semibold">
                    Saved Posts
                  </p>

                  <p className="mt-1 text-caption text-text-secondary">
                    Articles you saved to read later.
                  </p>
                </div>

                {/* EMPTY STATE */}
                {savedPosts.length === 0 ? (
                  <div className="px-4 py-8 text-center">

                    <div className="mb-3 flex justify-center text-text-secondary">
                      <BookmarkIcon />
                    </div>

                    <p className="text-body-sm font-medium">
                      No saved posts yet
                    </p>

                    <p className="mt-1 text-caption text-text-secondary">
                      Click the bookmark icon on an
                      article to save it.
                    </p>
                  </div>
                ) : (
                  /* SAVED POSTS */
                  <div className="max-h-96 overflow-y-auto">
                    {savedPosts.map(
                      (post) => (
                        <Link
                          key={post.id}
                          href={`/news/${post.id}`}
                          onClick={() =>
                            setSavedOpen(false)
                          }
                          className="flex gap-3 border-b border-border p-3 transition hover:bg-bg-secondary"
                        >
                          {/* Image */}
                          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={post.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Information */}
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-body-sm font-medium">
                              {post.title}
                            </p>

                            {(post.source ||
                              post.publishedDate) && (
                              <p className="mt-1 truncate text-caption text-text-secondary">
                                {[
                                  post.source,
                                  post.publishedDate,
                                ]
                                  .filter(Boolean)
                                  .join(
                                    " · ",
                                  )}
                              </p>
                            )}
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}