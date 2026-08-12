"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Home", href: "/", active: true, dot: false },
  { label: "For You", href: "/", active: false, dot: true },
  { label: "Local", href: "/", active: false, dot: false },
  { label: "Blindspot", href: "/", active: false, dot: false },
];

/** Sticky site header: menu, wordmark, primary nav, auth actions. */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSignUpClick() {
    posthog.capture("sign_up_clicked");
  }

  function handleSignInClick() {
    posthog.capture("sign_in_clicked");
  }

  function handleMenuToggle() {
    setMenuOpen((current) => !current);
  }

  function handleMobileNavigation() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg-primary">
      <div className="relative mx-auto flex h-[72px] max-w-(--container-app) items-center gap-6 px-6">
        {/* Hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={handleMenuToggle}
          className="text-text-primary"
        >
          <MenuIcon />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-1.5"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-h2 font-bold text-text-primary">Skew</span>
          <span className="text-body-sm text-text-secondary">News</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-6 hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative text-body-md text-text-secondary hover:text-text-primary",
                item.active &&
                  "font-semibold text-text-primary after:absolute after:-bottom-[26px] after:left-0 after:h-0.5 after:w-full after:bg-text-primary",
              )}
            >
              {item.label}

              {item.dot && (
                <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="ml-auto flex items-center gap-3">
          <Show when="signed-out">
            <SignUpButton>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSignUpClick}
              >
                Subscribe
              </Button>
            </SignUpButton>

            <SignInButton>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignInClick}
              >
                Login
              </Button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="absolute left-4 right-4 top-full z-50 mt-2 rounded-xl border border-border bg-bg-primary p-2 shadow-2xl md:hidden">
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleMobileNavigation}
                  className={cn(
                    "flex items-center rounded-lg px-4 py-3 text-body-md text-text-secondary transition-colors hover:bg-surface hover:text-text-primary",
                    item.active &&
                      "font-semibold text-text-primary",
                  )}
                >
                  {item.label}

                  {item.dot && (
                    <span className="ml-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}