"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

interface SavedPost {
  id: string;
  title: string;
  imageUrl?: string;
  source?: string;
  publishedDate?: string;
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
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" />
    </svg>
  );
}

/**
 * Full-width utility bar.
 *
 * Features:
 * - Light / Dark / Auto theme
 * - Dynamic date
 * - Responsive date on mobile
 * - Responsive location text
 * - Saved Posts dropdown
 */
export function TopBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentDate, setCurrentDate] = useState("");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedOpen, setSavedOpen] = useState(false);

  /*
   * ------------------------------------------------------------
   * THEME
   * ------------------------------------------------------------
   */

  function applyTheme(selectedTheme: Theme) {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.toggle("dark", prefersDark);
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("skew-theme");

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

  function handleThemeChange(selectedTheme: Theme) {
    setTheme(selectedTheme);
    localStorage.setItem("skew-theme", selectedTheme);
    applyTheme(selectedTheme);
  }

  /*
   * ------------------------------------------------------------
   * DATE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    function updateDate() {
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date());

      setCurrentDate(formattedDate);
    }

    updateDate();

    // Check every minute so the date changes automatically at midnight.
    const interval = setInterval(
      updateDate,
      60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  /*
   * ------------------------------------------------------------
   * SAVED POSTS
   * ------------------------------------------------------------
   */

  function loadSavedPosts() {
    try {
      const stored = localStorage.getItem(
        "skew-saved-posts",
      );

      if (!stored) {
        setSavedPosts([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        setSavedPosts([]);
        return;
      }

      /*
       * Remove invalid / blank saved entries.
       */
      const validPosts = parsed.filter(
        (post): post is SavedPost =>
          post &&
          typeof post === "object" &&
          typeof post.id === "string" &&
          post.id.trim() !== "" &&
          typeof post.title === "string" &&
          post.title.trim() !== "",
      );

      setSavedPosts(validPosts);
    } catch {
      setSavedPosts([]);
    }
  }

  useEffect(() => {
    loadSavedPosts();

    /*
     * Update when another tab changes localStorage.
     */
    function handleStorage(event: StorageEvent) {
      if (event.key === "skew-saved-posts") {
        loadSavedPosts();
      }
    }

    /*
     * Update immediately when the bookmark component
     * dispatches this custom event.
     */
    function handleSavedPostsChanged() {
      loadSavedPosts();
    }

    window.addEventListener(
      "storage",
      handleStorage,
    );

    window.addEventListener(
      "saved-posts-changed",
      handleSavedPostsChanged,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage,
      );

      window.removeEventListener(
        "saved-posts-changed",
        handleSavedPostsChanged,
      );
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div className="w-full bg-topbar-bg text-text-secondary">
      <div className="mx-auto flex h-10 max-w-(--container-app) items-center justify-between px-4 sm:px-6 text-caption">

        {/* ======================================================
            LEFT SIDE
           ====================================================== */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">

          {/* Browser Extension */}
          <span className="hidden sm:inline hover:text-white">
            Browser Extension
          </span>

          {/* Mobile label */}
          <span className="inline sm:hidden hover:text-white">
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

        {/* ======================================================
            RIGHT SIDE
           ====================================================== */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Full date on desktop */}
          <span className="hidden lg:inline whitespace-nowrap">
            {currentDate}
          </span>

          {/* Short date on mobile/tablet */}
          <span className="inline lg:hidden whitespace-nowrap">
            {currentDate
              ? new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(new Date())
              : ""}
          </span>

          <span className="text-border">
            |
          </span>

          {/* Location */}
          <span className="whitespace-nowrap hover:text-white">
            <span className="hidden sm:inline">
              Set Location
            </span>

            <span className="inline sm:hidden">
              Location
            </span>
          </span>

          <span className="hidden sm:inline text-border">
            |
          </span>

          {/* ==================================================
              SAVED POSTS
             ================================================== */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setSavedOpen((current) => !current)
              }
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-white"
              aria-expanded={savedOpen}
              aria-label="Saved posts"
            >
              <BookmarkIcon />

              <span className="hidden sm:inline">
                Saved
              </span>

              {savedPosts.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-black">
                  {savedPosts.length}
                </span>
              )}

              <ChevronDownIcon />
            </button>

            {/* ==================================================
                SAVED POSTS DROPDOWN
               ================================================== */}

            {savedOpen && (
              <div className="absolute right-0 top-7 z-50 w-[280px] overflow-hidden rounded-lg border border-border bg-bg-primary shadow-lg">

                {/* Header */}
                <div className="border-b border-border px-4 py-3">
                  <h3 className="text-body-md font-semibold text-text-primary">
                    Saved Posts
                  </h3>

                  <p className="mt-1 text-caption text-text-secondary">
                    Articles you saved to read later.
                  </p>
                </div>

                {/* Empty state */}
                {savedPosts.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <BookmarkIcon />

                    <p className="mt-2 text-body-sm text-text-secondary">
                      No saved posts yet.
                    </p>

                    <p className="mt-1 text-caption text-text-secondary">
                      Bookmark an article to save it here.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto">

                    {savedPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/news/${post.id}`}
                        onClick={() =>
                          setSavedOpen(false)
                        }
                        className="flex gap-3 border-b border-border p-3 transition hover:bg-surface"
                      >
                        {/* Image */}
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-surface">

                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-text-secondary">
                              <BookmarkIcon />
                            </div>
                          )}

                        </div>

                        {/* Content */}
                        <div className="min-w-0">

                          <p className="line-clamp-2 text-body-sm font-medium text-text-primary">
                            {post.title}
                          </p>

                          {(post.source ||
                            post.publishedDate) && (
                            <p className="mt-1 line-clamp-1 text-caption text-text-secondary">
                              {[
                                post.source,
                                post.publishedDate,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}

                        </div>
                      </Link>
                    ))}

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