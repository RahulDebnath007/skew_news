"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/chip";

const CATEGORIES = [
  "World Cup",
  "IPL",
  "Social Media",
  "Business & Markets",
  "Health & Medicine",
  "Soccer",
  "Artificial Intelligence",
  "Arsenal FC",
  "Extreme Weather and Disasters",
];

function ChevronRightIcon() {
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
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function CategoryBar() {
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  function handleCategoryClick(category: string) {
    setSelectedCategory((current) =>
      current === category ? null : category,
    );
  }

  return (
    <div className="w-full border-b border-border bg-bg-primary">
      <div className="mx-auto flex max-w-(--container-app) items-center gap-2 px-6 py-3">
        <span className="shrink-0 text-text-secondary">
          +
        </span>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() =>
                handleCategoryClick(label)
              }
              className="shrink-0"
            >
              <Chip
                label={label}
                addable={!selectedCategory || selectedCategory !== label}
                className={
                  selectedCategory === label
                    ? "bg-accent text-white"
                    : ""
                }
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="shrink-0 text-text-secondary transition hover:text-text-primary"
          aria-label="Next categories"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}