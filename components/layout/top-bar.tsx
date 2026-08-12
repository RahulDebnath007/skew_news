"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark" | "auto";

type SavedPost = {
  id: string;
  title: string;
  imageUrl: string;
  source: string;
  publishedDate: string;
};

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

const SAVED_POSTS_KEY = "skew-saved-posts";
const LOCATION_KEY = "skew-location";

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

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" />
    </svg>
  );
}

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

/**
 * Top utility bar.
 *
 * Desktop:
 * Theme: Light Dark Auto | Date | Set Location | Saved
 *
 * Mobile:
 * Theme | Date | Set Location | Saved
 */
export function TopBar() {
  /* -------------------------------------------------------------------------- */
  /* Theme                                                                       */
  /* -------------------------------------------------------------------------- */

  const [theme, setTheme] = useState<Theme>("light");
  const [themeOpen, setThemeOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* Date                                                                        */
  /* -------------------------------------------------------------------------- */

  const [currentDate, setCurrentDate] = useState("");

  /* -------------------------------------------------------------------------- */
  /* Location                                                                    */
  /* -------------------------------------------------------------------------- */

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationResults, setLocationResults] = useState<
    LocationResult[]
  >([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  /* -------------------------------------------------------------------------- */
  /* Saved posts                                                                 */
  /* -------------------------------------------------------------------------- */

  const [savedOpen, setSavedOpen] = useState(false);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  /* -------------------------------------------------------------------------- */
  /* Refs                                                                        */
  /* -------------------------------------------------------------------------- */

  const themeRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------------------------- */
  /* Theme                                                                       */
  /* -------------------------------------------------------------------------- */

  function applyTheme(selectedTheme: Theme) {
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

  function handleThemeChange(selectedTheme: Theme) {
    setTheme(selectedTheme);

    localStorage.setItem(
      "skew-theme",
      selectedTheme,
    );

    applyTheme(selectedTheme);
  }

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

  useEffect(() => {
    if (theme !== "auto") return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = () => {
      applyTheme("auto");
    };

    mediaQuery.addEventListener(
      "change",
      handleChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange,
      );
    };
  }, [theme]);

  /* -------------------------------------------------------------------------- */
  /* Date                                                                        */
  /* -------------------------------------------------------------------------- */

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

    const interval = window.setInterval(
      updateDate,
      60 * 1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const mobileDate = currentDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    : "";

  /* -------------------------------------------------------------------------- */
  /* Saved location                                                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const savedLocation =
      localStorage.getItem(LOCATION_KEY);

    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Saved posts                                                                 */
  /* -------------------------------------------------------------------------- */

  function loadSavedPosts() {
    try {
      const raw =
        localStorage.getItem(
          SAVED_POSTS_KEY,
        );

      if (!raw) {
        setSavedPosts([]);
        return;
      }

      const parsed: unknown =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        setSavedPosts([]);
        return;
      }

      setSavedPosts(
        parsed as SavedPost[],
      );
    } catch {
      setSavedPosts([]);
    }
  }

  useEffect(() => {
    loadSavedPosts();

    function handleStorageChange(
      event: StorageEvent,
    ) {
      if (
        event.key ===
        SAVED_POSTS_KEY
      ) {
        loadSavedPosts();
      }
    }

    function handleSavedPostsChanged() {
      loadSavedPosts();
    }

    window.addEventListener(
      "storage",
      handleStorageChange,
    );

    window.addEventListener(
      "skew-saved-posts-changed",
      handleSavedPostsChanged,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange,
      );

      window.removeEventListener(
        "skew-saved-posts-changed",
        handleSavedPostsChanged,
      );
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Location search                                                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!locationOpen) return;

    const query =
      locationSearch.trim();

    if (!query) {
      setLocationResults([]);
      return;
    }

    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(
        async () => {
          try {
            setLocationLoading(true);

            const response =
              await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&addressdetails=1&q=${encodeURIComponent(
                  query,
                )}`,
                {
                  signal:
                    controller.signal,
                  headers: {
                    Accept:
                      "application/json",
                  },
                },
              );

            if (!response.ok) {
              throw new Error(
                "Location search failed",
              );
            }

            const data =
              (await response.json()) as LocationResult[];

            setLocationResults(
              data,
            );
          } catch (error) {
            if (
              error instanceof Error &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            setLocationResults([]);
          } finally {
            setLocationLoading(
              false,
            );
          }
        },
        350,
      );

    return () => {
      window.clearTimeout(
        timeout,
      );

      controller.abort();
    };
  }, [
    locationSearch,
    locationOpen,
  ]);

  /* -------------------------------------------------------------------------- */
  /* Select location                                                             */
  /* -------------------------------------------------------------------------- */

  function handleLocationSelect(
    location: LocationResult,
  ) {
    const name =
      location.address?.city ||
      location.address?.town ||
      location.address?.village ||
      location.display_name.split(
        ",",
      )[0];

    setSelectedLocation(name);

    localStorage.setItem(
      LOCATION_KEY,
      name,
    );

    setLocationSearch("");
    setLocationResults([]);
    setLocationOpen(false);
  }

  /* -------------------------------------------------------------------------- */
  /* Outside click                                                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node;

      if (
        themeRef.current &&
        !themeRef.current.contains(
          target,
        )
      ) {
        setThemeOpen(false);
      }

      if (
        locationRef.current &&
        !locationRef.current.contains(
          target,
        )
      ) {
        setLocationOpen(false);
      }

      if (
        savedRef.current &&
        !savedRef.current.contains(
          target,
        )
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

  /* -------------------------------------------------------------------------- */
  /* Dropdown controls                                                           */
  /* -------------------------------------------------------------------------- */

  function toggleTheme() {
    setThemeOpen(
      (open) => !open,
    );

    setLocationOpen(false);
    setSavedOpen(false);
  }

  function toggleLocation() {
    setLocationOpen(
      (open) => !open,
    );

    setThemeOpen(false);
    setSavedOpen(false);

    if (!locationOpen) {
      setLocationSearch("");
      setLocationResults([]);
    }
  }

  function toggleSaved() {
    loadSavedPosts();

    setSavedOpen(
      (open) => !open,
    );

    setThemeOpen(false);
    setLocationOpen(false);
  }

  /* -------------------------------------------------------------------------- */
  /* Render                                                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="relative z-50 w-full bg-topbar-bg text-text-secondary">
      <div className="mx-auto flex min-h-10 max-w-(--container-app) items-center justify-between gap-3 px-4 sm:px-6">

        {/* ================================================================== */}
        {/* LEFT SIDE                                                           */}
        {/* ================================================================== */}

        <div className="flex min-w-0 items-center">

          {/* Desktop Theme */}
          <div className="hidden items-center gap-2 text-caption sm:flex">
            <span>Theme:</span>

            <button
              type="button"
              onClick={() =>
                handleThemeChange(
                  "light",
                )
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
                handleThemeChange(
                  "dark",
                )
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
                handleThemeChange(
                  "auto",
                )
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

          {/* Mobile Theme Dropdown */}
          <div
            ref={themeRef}
            className="relative sm:hidden"
          >
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1 whitespace-nowrap text-caption hover:text-white"
              aria-expanded={
                themeOpen
              }
              aria-haspopup="menu"
            >
              <span>Theme</span>
              <ChevronDownIcon />
            </button>

            {themeOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-md border border-border bg-bg-primary p-1 shadow-lg">
                {(
                  [
                    "light",
                    "dark",
                    "auto",
                  ] as Theme[]
                ).map(
                  (
                    selectedTheme,
                  ) => (
                    <button
                      key={
                        selectedTheme
                      }
                      type="button"
                      onClick={() => {
                        handleThemeChange(
                          selectedTheme,
                        );

                        setThemeOpen(
                          false,
                        );
                      }}
                      className={`block w-full rounded px-3 py-2 text-left text-caption capitalize transition ${
                        theme ===
                        selectedTheme
                          ? "bg-bg-secondary font-semibold text-text-primary"
                          : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                      }`}
                    >
                      {
                        selectedTheme
                      }
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* RIGHT SIDE                                                          */}
        {/* ================================================================== */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          {/* Desktop Date */}
          <span className="hidden whitespace-nowrap text-caption lg:inline">
            {currentDate}
          </span>

          {/* Mobile Date */}
          <span className="whitespace-nowrap text-caption sm:hidden">
            {mobileDate}
          </span>

          <span className="hidden text-border sm:inline">
            |
          </span>

          {/* ================================================================ */}
          {/* LOCATION                                                          */}
          {/* ================================================================ */}

          <div
            ref={locationRef}
            className="relative"
          >
            <button
              type="button"
              onClick={
                toggleLocation
              }
              className="flex items-center gap-1 whitespace-nowrap text-caption transition hover:text-white"
              aria-expanded={
                locationOpen
              }
              aria-haspopup="dialog"
            >
              <span>
                Set Location
              </span>

              <ChevronDownIcon />
            </button>

            {locationOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-lg border border-border bg-bg-primary shadow-lg sm:w-80">

                {/* Search */}
                <div className="border-b border-border p-3">
                  <div className="flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2">
                    <SearchIcon />

                    <input
                      type="text"
                      value={
                        locationSearch
                      }
                      onChange={(
                        event,
                      ) =>
                        setLocationSearch(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Search any location..."
                      autoFocus
                      className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-secondary"
                    />

                    {locationSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocationSearch(
                            "",
                          );

                          setLocationResults(
                            [],
                          );
                        }}
                        className="text-text-secondary hover:text-text-primary"
                        aria-label="Clear location search"
                      >
                        <CloseIcon />
                      </button>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto p-1">

                  {locationLoading && (
                    <div className="px-3 py-3 text-body-sm text-text-secondary">
                      Searching...
                    </div>
                  )}

                  {!locationLoading &&
                    locationSearch.trim() &&
                    locationResults.length ===
                      0 && (
                      <div className="px-3 py-3 text-body-sm text-text-secondary">
                        No locations
                        found.
                      </div>
                    )}

                  {!locationSearch.trim() && (
                    <div className="px-3 py-3 text-body-sm text-text-secondary">
                      Type a city,
                      state, country
                      or any place.
                    </div>
                  )}

                  {!locationLoading &&
                    locationResults.map(
                      (
                        location,
                        index,
                      ) => {
                        const name =
                          location
                            .address
                            ?.city ||
                          location
                            .address
                            ?.town ||
                          location
                            .address
                            ?.village ||
                          location.display_name.split(
                            ",",
                          )[0];

                        return (
                          <button
                            key={`${location.lat}-${location.lon}-${index}`}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                location,
                              )
                            }
                            className="block w-full rounded-md px-3 py-2 text-left transition hover:bg-bg-secondary"
                          >
                            <div className="text-body-sm font-medium text-text-primary">
                              {name}
                            </div>

                            <div className="mt-0.5 line-clamp-2 text-caption text-text-secondary">
                              {
                                location.display_name
                              }
                            </div>
                          </button>
                        );
                      },
                    )}
                </div>
              </div>
            )}
          </div>

          <span className="hidden text-border sm:inline">
            |
          </span>

          {/* ================================================================ */}
          {/* SAVED POSTS                                                       */}
          {/* ================================================================ */}

          <div
            ref={savedRef}
            className="relative"
          >
            <button
              type="button"
              onClick={
                toggleSaved
              }
              className="flex items-center gap-1.5 whitespace-nowrap text-caption transition hover:text-white"
              aria-expanded={
                savedOpen
              }
              aria-haspopup="dialog"
            >
              <BookmarkIcon
                filled={
                  savedPosts.length >
                  0
                }
              />

              <span className="hidden sm:inline">
                Saved
              </span>

              {savedPosts.length >
                0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-semibold text-black">
                  {
                    savedPosts.length
                  }
                </span>
              )}

              <ChevronDownIcon />
            </button>

            {savedOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-lg border border-border bg-bg-primary shadow-lg sm:w-96">

                {/* Header */}
                <div className="border-b border-border px-4 py-3">
                  <div className="text-body-md font-semibold text-text-primary">
                    Saved Posts
                  </div>

                  <div className="mt-1 text-caption text-text-secondary">
                    Articles you
                    saved to read
                    later.
                  </div>
                </div>

                {/* Empty state */}
                {savedPosts.length ===
                0 ? (
                  <div className="px-4 py-8 text-center text-body-sm text-text-secondary">
                    No saved posts
                    yet.
                    <br />
                    Bookmark an
                    article to save
                    it here.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {savedPosts.map(
                      (post) => (
                        <Link
                          key={
                            post.id
                          }
                          href={`/news/${post.id}`}
                          onClick={() =>
                            setSavedOpen(
                              false,
                            )
                          }
                          className="flex gap-3 border-b border-border p-3 transition last:border-b-0 hover:bg-bg-secondary"
                        >
                          {/* Image */}
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-surface">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                post.imageUrl
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="min-w-0">
                            <div className="line-clamp-2 text-body-sm font-semibold text-text-primary">
                              {
                                post.title
                              }
                            </div>

                            <div className="mt-1 text-caption text-text-secondary">
                              {
                                post.source
                              }

                              {post.publishedDate
                                ? ` · ${post.publishedDate}`
                                : ""}
                            </div>
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