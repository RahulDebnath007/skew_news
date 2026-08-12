"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark" | "auto";

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
}

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
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
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
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
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
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
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
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function XIcon() {
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
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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
 * - Responsive theme control
 * - Dynamic date
 * - Searchable location selector
 * - Saved posts dropdown
 * - Saved count only appears when count > 0
 */
export function TopBar() {
  const [theme, setTheme] = useState<Theme>("light");

  const [currentDate, setCurrentDate] = useState("");

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [themeOpen, setThemeOpen] = useState(false);

  const [savedOpen, setSavedOpen] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  const locationRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);

  const THEME_STORAGE_KEY = "skew-theme";
  const LOCATION_STORAGE_KEY = "skew-location";
  const SAVED_STORAGE_KEY = "skew-saved-posts";

  /**
   * Apply theme to document.
   */
  function applyTheme(selectedTheme: Theme): void {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (selectedTheme === "light") {
      root.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    root.classList.toggle("dark", prefersDark);
  }

  /**
   * Load saved theme and location.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "auto"
    ) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme("light");
      applyTheme("light");
    }

    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);

    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  /**
   * Update date.
   *
   * Desktop:
   * Wednesday, August 12, 2026
   *
   * Mobile:
   * Aug 12, 2026
   */
  useEffect(() => {
    function updateDate(): void {
      const isMobile = window.innerWidth < 640;

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: isMobile ? undefined : "long",
        month: isMobile ? "short" : "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date());

      setCurrentDate(formattedDate);
    }

    updateDate();

    const interval = window.setInterval(updateDate, 60 * 1000);

    window.addEventListener("resize", updateDate);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", updateDate);
    };
  }, []);

  /**
   * Theme change.
   */
  function handleThemeChange(selectedTheme: Theme): void {
    setTheme(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    applyTheme(selectedTheme);
    setThemeOpen(false);
  }

  /**
   * Load saved posts from localStorage.
   */
  function loadSavedPosts(): void {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);

      if (!raw) {
        setSavedPosts([]);
        return;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        setSavedPosts([]);
        return;
      }

      const validPosts: SavedPost[] = parsed.filter(
        (post: unknown): post is SavedPost => {
          if (!post || typeof post !== "object") return false;

          const item = post as Record<string, unknown>;

          return typeof item.id === "string";
        },
      );

      setSavedPosts(validPosts);
    } catch {
      setSavedPosts([]);
    }
  }

  /**
   * Load saved posts on mount.
   */
  useEffect(() => {
    loadSavedPosts();

    function handleSavedPostsChanged(): void {
      loadSavedPosts();
    }

    window.addEventListener(
      "skew-saved-posts-updated",
      handleSavedPostsChanged,
    );

    window.addEventListener(
      "storage",
      handleSavedPostsChanged,
    );

    /*
     * This small polling fallback makes the counter update even if
     * another component changes localStorage without dispatching
     * a custom event.
     */
    const interval = window.setInterval(
      loadSavedPosts,
      500,
    );

    return () => {
      window.removeEventListener(
        "skew-saved-posts-updated",
        handleSavedPostsChanged,
      );

      window.removeEventListener(
        "storage",
        handleSavedPostsChanged,
      );

      window.clearInterval(interval);
    };
  }, []);

  /**
   * Search arbitrary locations.
   *
   * Uses OpenStreetMap Nominatim so the user is not restricted
   * to a predefined list of cities.
   */
  useEffect(() => {
    if (!locationOpen) return;

    const query = locationQuery.trim();

    if (query.length < 2) {
      setLocationResults([]);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setLocationLoading(true);

        const url =
          "https://nominatim.openstreetmap.org/search?" +
          new URLSearchParams({
            q: query,
            format: "json",
            addressdetails: "1",
            limit: "6",
          }).toString();

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Location search failed");
        }

        const data: LocationResult[] = await response.json();

        setLocationResults(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setLocationResults([]);
        }
      } finally {
        setLocationLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [locationQuery, locationOpen]);

  /**
   * Select a location.
   */
  function handleLocationSelect(
    location: LocationResult,
  ): void {
    const city =
      location.address?.city ||
      location.address?.town ||
      location.address?.village ||
      location.address?.municipality ||
      location.display_name.split(",")[0];

    setSelectedLocation(city);

    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      city,
    );

    setLocationQuery("");
    setLocationResults([]);
    setLocationOpen(false);
  }

  /**
   * Close dropdowns when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent): void {
      const target = event.target as Node;

      if (
        locationRef.current &&
        !locationRef.current.contains(target)
      ) {
        setLocationOpen(false);
      }

      if (
        themeRef.current &&
        !themeRef.current.contains(target)
      ) {
        setThemeOpen(false);
      }

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

  const savedCount = savedPosts.length;

  return (
    <div className="w-full bg-topbar-bg text-text-secondary">
      <div className="mx-auto flex min-h-10 max-w-(--container-app) items-center justify-between gap-3 px-4 sm:px-6 text-caption">

        {/* ========================================================= */}
        {/* LEFT SIDE — THEME                                        */}
        {/* ========================================================= */}

        <div className="flex min-w-0 items-center">
          {/* Desktop theme */}
          <div
            ref={themeRef}
            className="relative hidden sm:flex items-center gap-2"
          >
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
          </div>

          {/* Mobile theme dropdown */}
          <div
            ref={themeRef}
            className="relative sm:hidden"
          >
            <button
              type="button"
              onClick={() =>
                setThemeOpen((open) => !open)
              }
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-white"
              aria-expanded={themeOpen}
            >
              <span>Theme:</span>

              <span className="font-semibold text-white">
                {theme === "light"
                  ? "Light"
                  : theme === "dark"
                    ? "Dark"
                    : "Auto"}
              </span>

              <ChevronDownIcon />
            </button>

            {themeOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-28 overflow-hidden rounded-lg border border-border bg-bg-primary shadow-xl">
                {(
                  ["light", "dark", "auto"] as Theme[]
                ).map((option: Theme) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleThemeChange(option)
                    }
                    className={`block w-full px-4 py-2 text-left capitalize hover:bg-surface ${
                      theme === option
                        ? "font-semibold text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE                                                */}
        {/* ========================================================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">

          {/* Date */}
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">
              {currentDate}
            </span>

            <span className="sm:hidden">
              {currentDate}
            </span>
          </span>

          <span className="text-border">
            |
          </span>

          {/* ===================================================== */}
          {/* LOCATION                                              */}
          {/* ===================================================== */}

          <div
            ref={locationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setLocationOpen((open) => !open)
              }
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-white"
              aria-expanded={locationOpen}
              aria-haspopup="listbox"
            >
              <span>
                {selectedLocation
                  ? selectedLocation
                  : "Set Location"}
              </span>

              <ChevronDownIcon />
            </button>

            {locationOpen && (
              <div className="fixed left-1/2 top-[58px] z-50 w-[calc(100vw-24px)] max-w-[360px] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-bg-primary shadow-2xl sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-3 sm:w-[360px] sm:max-w-none sm:translate-x-0">
                {/* Search input */}
                <div className="border-b border-border p-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                    <SearchIcon />

                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(event) =>
                        setLocationQuery(
                          event.target.value,
                        )
                      }
                      placeholder="Search location..."
                      autoFocus
                      className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
                    />

                    {locationQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationQuery("");
                          setLocationResults([]);
                        }}
                        className="text-text-secondary hover:text-text-primary"
                        aria-label="Clear location search"
                      >
                        <XIcon />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search results */}
                <div className="max-h-72 overflow-y-auto">
                  {locationLoading && (
                    <div className="px-4 py-4 text-sm text-text-secondary">
                      Searching locations...
                    </div>
                  )}

                  {!locationLoading &&
                    locationQuery.trim().length >= 2 &&
                    locationResults.length === 0 && (
                      <div className="px-4 py-4 text-sm text-text-secondary">
                        No locations found.
                      </div>
                    )}

                  {!locationLoading &&
                    locationResults.map(
                      (location: LocationResult) => {
                        const city =
                          location.address?.city ||
                          location.address?.town ||
                          location.address?.village ||
                          location.address
                            ?.municipality ||
                          location.display_name.split(
                            ",",
                          )[0];

                        return (
                          <button
                            key={location.place_id}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                location,
                              )
                            }
                            className="block w-full px-4 py-3 text-left transition hover:bg-surface"
                          >
                            <div className="text-sm font-medium text-text-primary">
                              {city}
                            </div>

                            <div className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
                              {location.display_name}
                            </div>
                          </button>
                        );
                      },
                    )}

                  {!locationQuery.trim() && (
                    <div className="px-4 py-4 text-xs text-text-secondary">
                      Search for any city, town, state,
                      country or place.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="text-border">
            |
          </span>

          {/* ===================================================== */}
          {/* SAVED POSTS                                           */}
          {/* ===================================================== */}

          <div
            ref={savedRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setSavedOpen((open) => !open)
              }
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-white"
              aria-expanded={savedOpen}
              aria-haspopup="dialog"
            >
              <BookmarkIcon />

              <span className="hidden sm:inline">
                Saved
              </span>

              <span className="sm:hidden">
                Saved
              </span>

              {/* IMPORTANT:
                  Number appears ONLY when there are saved posts. */}
              {savedCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-black">
                  {savedCount}
                </span>
              )}

              <ChevronDownIcon />
            </button>

            {savedOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-[290px] overflow-hidden rounded-xl border border-border bg-bg-primary shadow-2xl sm:w-[370px]">

                {/* Header */}
                <div className="border-b border-border px-4 py-3">
                  <h3 className="font-semibold text-text-primary">
                    Saved Posts
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    Articles you saved to read later.
                  </p>
                </div>

                {/* Empty state */}
                {savedPosts.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-text-secondary">
                      <BookmarkIcon />
                    </div>

                    <p className="text-sm font-medium text-text-primary">
                      No saved posts
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      Articles you bookmark will appear
                      here.
                    </p>
                  </div>
                )}

                {/* Saved posts */}
                {savedPosts.length > 0 && (
                  <div className="max-h-[360px] overflow-y-auto">
                    {savedPosts.map(
                      (post: SavedPost) => (
                        <Link
                          key={post.id}
                          href={`/news/${post.id}`}
                          onClick={() =>
                            setSavedOpen(false)
                          }
                          className="flex gap-3 border-b border-border p-3 transition last:border-b-0 hover:bg-surface"
                        >
                          {/* Image */}
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-surface">
                            {post.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
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
                            <p className="line-clamp-2 text-sm font-medium text-text-primary">
                              {post.title}
                            </p>

                            {(post.source ||
                              post.publishedDate) && (
                              <p className="mt-1 line-clamp-1 text-xs text-text-secondary">
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