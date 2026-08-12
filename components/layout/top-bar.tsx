"use client";

import { useEffect, useRef, useState } from "react";

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
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function MapPinIcon() {
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
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

type Theme = "light" | "dark" | "auto";

type LocationOption = {
  city: string;
  country: string;
};

const LOCATIONS: LocationOption[] = [
  { city: "Kolkata", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Mumbai", country: "India" },
  { city: "Bengaluru", country: "India" },
  { city: "Chennai", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Pune", country: "India" },
  { city: "London", country: "United Kingdom" },
  { city: "New York", country: "United States" },
  { city: "Los Angeles", country: "United States" },
  { city: "Toronto", country: "Canada" },
  { city: "Sydney", country: "Australia" },
  { city: "Singapore", country: "Singapore" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Tokyo", country: "Japan" },
];

export function TopBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [currentDate, setCurrentDate] = useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const locationRef = useRef<HTMLDivElement>(null);

  /*
   * Apply selected theme.
   */
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

  /*
   * Load saved theme and location.
   */
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

    const savedLocation = localStorage.getItem("skew-location");

    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);

        if (
          parsedLocation &&
          typeof parsedLocation.city === "string" &&
          typeof parsedLocation.country === "string"
        ) {
          setSelectedLocation(parsedLocation);
        }
      } catch {
        localStorage.removeItem("skew-location");
      }
    }
  }, []);

  /*
   * Handle theme changes.
   */
  function handleThemeChange(selectedTheme: Theme) {
    setTheme(selectedTheme);
    localStorage.setItem("skew-theme", selectedTheme);
    applyTheme(selectedTheme);
  }

  /*
   * Dynamic date.
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

    const interval = setInterval(updateDate, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Close location dropdown when clicking outside.
   */
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
   * Select a location.
   */
  function handleLocationSelect(location: LocationOption) {
    setSelectedLocation(location);
    localStorage.setItem(
      "skew-location",
      JSON.stringify(location),
    );

    setLocationOpen(false);
    setLocationSearch("");
  }

  /*
   * Filter locations based on search.
   */
  const filteredLocations = LOCATIONS.filter((location) => {
    const search = locationSearch.trim().toLowerCase();

    if (!search) return true;

    return (
      location.city.toLowerCase().includes(search) ||
      location.country.toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full bg-topbar-bg text-text-secondary">
      <div className="mx-auto flex h-10 max-w-(--container-app) items-center justify-between px-6 text-caption">

        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-5">
          <span className="cursor-pointer hover:text-white">
            Browser Extension
          </span>

          {/* THEME */}
          <span className="hidden items-center gap-2 md:flex">
            <span>Theme:</span>

            <button
              type="button"
              onClick={() => handleThemeChange("light")}
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
              onClick={() => handleThemeChange("dark")}
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
              onClick={() => handleThemeChange("auto")}
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

        {/* RIGHT SIDE */}
        <div className="flex min-w-0 items-center gap-4">

          {/* DATE */}
          <span className="hidden lg:inline">
            {currentDate}
          </span>

          <span className="hidden text-border lg:inline">
            |
          </span>

          {/* LOCATION */}
          <div
            ref={locationRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() => setLocationOpen((open) => !open)}
              className="flex items-center gap-1.5 hover:text-white"
              aria-expanded={locationOpen}
              aria-haspopup="dialog"
            >
              <MapPinIcon />

              <span>
                {selectedLocation
                  ? selectedLocation.city
                  : "Set Location"}
              </span>

              <ChevronDownIcon />
            </button>

            {locationOpen && (
              <div className="absolute right-0 top-7 z-50 w-72 rounded-lg border border-border bg-bg-primary p-3 text-text-primary shadow-lg">

                {/* HEADER */}
                <div className="mb-3">
                  <p className="text-body-sm font-semibold">
                    Set your location
                  </p>

                  <p className="mt-1 text-caption text-text-secondary">
                    Choose a city for your news location.
                  </p>
                </div>

                {/* SEARCH */}
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                    <SearchIcon />
                  </span>

                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(event) =>
                      setLocationSearch(event.target.value)
                    }
                    placeholder="Search city or country..."
                    className="w-full rounded-md border border-border bg-bg-secondary py-2 pl-9 pr-3 text-body-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent"
                    autoFocus
                  />
                </div>

                {/* LOCATION LIST */}
                <div className="max-h-56 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => {
                      const isSelected =
                        selectedLocation?.city === location.city &&
                        selectedLocation?.country === location.country;

                      return (
                        <button
                          key={`${location.city}-${location.country}`}
                          type="button"
                          onClick={() =>
                            handleLocationSelect(location)
                          }
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                            isSelected
                              ? "bg-bg-secondary"
                              : "hover:bg-bg-secondary"
                          }`}
                        >
                          <MapPinIcon />

                          <span className="min-w-0">
                            <span className="block text-body-sm font-medium">
                              {location.city}
                            </span>

                            <span className="block text-caption text-text-secondary">
                              {location.country}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-3 py-4 text-center text-body-sm text-text-secondary">
                      No locations found.
                    </p>
                  )}
                </div>

                {/* CLEAR LOCATION */}
                {selectedLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocation(null);
                      localStorage.removeItem("skew-location");
                      setLocationOpen(false);
                      setLocationSearch("");
                    }}
                    className="mt-3 w-full border-t border-border pt-3 text-caption text-text-secondary hover:text-text-primary"
                  >
                    Clear location
                  </button>
                )}
              </div>
            )}
          </div>

          <span className="hidden text-border sm:inline">
            |
          </span>

          {/* EDITION */}
          <span className="flex shrink-0 items-center gap-1.5 hover:text-white">
            <GlobeIcon />

            <span className="hidden sm:inline">
              International Edition
            </span>

            <span className="sm:hidden">
              Edition
            </span>

            <ChevronDownIcon />
          </span>
        </div>
      </div>
    </div>
  );
}