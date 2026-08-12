import Link from "next/link";

import { TopBar } from "@/components/layout/top-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Multiple Sources",
    description:
      "Coverage from different news sources is brought together around the same story.",
  },
  {
    number: "02",
    title: "Analysis",
    description:
      "Articles are analyzed for sentiment, framing, and other characteristics.",
  },
  {
    number: "03",
    title: "Compare Perspectives",
    description:
      "See how different sources present and frame the same story.",
  },
  {
    number: "04",
    title: "Understand the Story",
    description:
      "Get a concise summary with additional context to help you understand the bigger picture.",
  },
];

const FOCUS_AREAS = [
  {
    number: "01",
    title: "Multiple Perspectives",
    description:
      "Compare coverage from different sources instead of relying on a single viewpoint.",
  },
  {
    number: "02",
    title: "Bias & Framing",
    description:
      "Understand how wording, emphasis, and presentation can influence the way a story is perceived.",
  },
  {
    number: "03",
    title: "Clear Summaries",
    description:
      "Quickly understand the key points of a story without having to read every article first.",
  },
  {
    number: "04",
    title: "Transparency",
    description:
      "We provide context and analysis so you can make your own judgment about the news.",
  },
];

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar />
      <SiteHeader />

      <main className="flex-1">
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden border-b border-border bg-bg-primary">
          {/* Decorative background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute right-[5%] top-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-(--container-app) px-6 py-20 sm:py-28 lg:py-32">
            <div className="mx-auto max-w-5xl text-center">
              <div className="skew-animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-caption font-semibold uppercase tracking-[0.16em] text-accent shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  About Skew
                </span>
              </div>

              <h1 className="skew-animate-fade-up skew-delay-1 mt-7 text-[2.8rem] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[4rem] lg:text-[5.25rem]">
                News is more than
                <span className="block text-accent">
                  one perspective.
                </span>
              </h1>

              <p className="skew-animate-fade-up skew-delay-2 mx-auto mt-7 max-w-2xl text-body-lg leading-8 text-text-secondary">
                Skew helps you understand not only what happened, but how
                different sources tell the same story.
              </p>

              <div className="skew-animate-fade-up skew-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-5 py-3 text-body-sm font-semibold text-bg-primary transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
                >
                  Explore the News
                  <ArrowIcon />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-body-sm font-semibold text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-text-secondary"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Perspective visual */}
            <div className="skew-animate-scale skew-delay-4 relative mx-auto mt-16 max-w-5xl sm:mt-20">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:p-6">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-bg-primary p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold text-text-secondary">
                        SOURCE 01
                      </span>

                      <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
                        LEFT
                      </span>
                    </div>

                    <div className="mt-6 h-2 rounded-full bg-border">
                      <div className="h-2 w-[68%] rounded-full bg-accent" />
                    </div>

                    <div className="mt-4 h-2 w-4/5 rounded-full bg-border" />
                    <div className="mt-3 h-2 w-3/5 rounded-full bg-border" />
                  </div>

                  <div className="rounded-xl border border-accent/30 bg-bg-primary p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold text-text-secondary">
                        SOURCE 02
                      </span>

                      <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
                        CENTER
                      </span>
                    </div>

                    <div className="mt-6 h-2 rounded-full bg-border">
                      <div className="h-2 w-[45%] rounded-full bg-accent" />
                    </div>

                    <div className="mt-4 h-2 w-4/5 rounded-full bg-border" />
                    <div className="mt-3 h-2 w-2/3 rounded-full bg-border" />
                  </div>

                  <div className="rounded-xl border border-border bg-bg-primary p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-semibold text-text-secondary">
                        SOURCE 03
                      </span>

                      <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
                        RIGHT
                      </span>
                    </div>

                    <div className="mt-6 h-2 rounded-full bg-border">
                      <div className="h-2 w-[32%] rounded-full bg-accent" />
                    </div>

                    <div className="mt-4 h-2 w-3/4 rounded-full bg-border" />
                    <div className="mt-3 h-2 w-1/2 rounded-full bg-border" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-caption text-text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  One story. Multiple perspectives.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WHY SKEW
        ========================================================= */}
        <section className="bg-surface">
          <div className="mx-auto max-w-(--container-app) px-6 py-20 sm:py-24 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div className="skew-animate-fade-up">
                <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                  Why Skew?
                </p>

                <h2 className="mt-4 text-h2 font-bold leading-tight text-text-primary sm:text-[2.8rem]">
                  One event.
                  <br />
                  Different headlines.
                </h2>
              </div>

              <div className="skew-animate-fade-up skew-delay-2 space-y-6 text-body-md leading-7 text-text-secondary">
                <p className="text-body-lg text-text-primary">
                  The same event can produce very different stories.
                </p>

                <p>
                  Different publications may emphasize different facts, use
                  different language, or focus on different aspects of the
                  same event.
                </p>

                <p>
                  That doesn't necessarily mean one source is right and
                  another is wrong. It means context matters.
                </p>

                <p>
                  Skew brings that coverage together so you can see those
                  differences more clearly instead of relying on a single
                  viewpoint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}
        <section className="border-y border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-20 sm:py-24 lg:py-28">
            <div className="max-w-2xl">
              <p className="skew-animate-fade-up text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                How Skew Works
              </p>

              <h2 className="skew-animate-fade-up skew-delay-1 mt-4 text-h2 font-bold leading-tight text-text-primary sm:text-[2.8rem]">
                From multiple sources
                <br />
                to broader context.
              </h2>

              <p className="skew-animate-fade-up skew-delay-2 mt-5 text-body-md leading-7 text-text-secondary">
                We bring together coverage and analyze how different sources
                approach the same story.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item, index) => (
                <div
                  key={item.number}
                  className={`skew-animate-scale group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg ${
                    index === 0
                      ? "skew-delay-1"
                      : index === 1
                        ? "skew-delay-2"
                        : index === 2
                          ? "skew-delay-3"
                          : "skew-delay-4"
                  }`}
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-accent/5 transition-transform duration-500 group-hover:scale-150" />

                  <span className="relative text-caption font-bold text-accent">
                    {item.number}
                  </span>

                  <h3 className="relative mt-8 text-h4 font-semibold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="relative mt-3 text-body-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>

                  <div className="relative mt-8 h-px w-10 bg-accent transition-all duration-300 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            WHAT WE FOCUS ON
        ========================================================= */}
        <section className="bg-surface">
          <div className="mx-auto max-w-(--container-app) px-6 py-20 sm:py-24 lg:py-28">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="skew-animate-fade-up text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                  What We Focus On
                </p>

                <h2 className="skew-animate-fade-up skew-delay-1 mt-4 text-h2 font-bold leading-tight text-text-primary sm:text-[2.8rem]">
                  Context over
                  <br />
                  conclusions.
                </h2>
              </div>

              <p className="skew-animate-fade-up skew-delay-2 max-w-md text-body-md leading-7 text-text-secondary">
                Our goal isn't to tell you what to think. It's to make the
                differences in news coverage easier to understand.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {FOCUS_AREAS.map((item, index) => (
                <div
                  key={item.title}
                  className={`group rounded-2xl border border-border bg-bg-primary p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg ${
                    index % 2 === 0
                      ? "skew-animate-fade-up"
                      : "skew-animate-fade-up skew-delay-2"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-caption font-bold text-accent">
                      {item.number}
                    </span>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                      <CheckIcon />
                    </div>
                  </div>

                  <h3 className="mt-8 text-h4 font-semibold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-body-md leading-7 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            PHILOSOPHY
        ========================================================= */}
        <section className="relative overflow-hidden border-t border-border bg-bg-primary">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-(--container-app) px-6 py-24 sm:py-32">
            <div className="skew-animate-fade-in mx-auto max-w-4xl text-center">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                Our Philosophy
              </p>

              <blockquote className="mt-7 text-h2 font-semibold leading-tight text-text-primary sm:text-[3rem] lg:text-[3.75rem]">
                “Don&apos;t just read the news.
                <span className="block text-accent">
                  Understand how it&apos;s being told.”
                </span>
              </blockquote>

              <p className="mx-auto mt-8 max-w-2xl text-body-md leading-7 text-text-secondary">
                Skew is designed to encourage curiosity, critical thinking,
                and a broader understanding of current events.
              </p>

              <div className="mt-10">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-body-sm font-semibold text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  Start exploring
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}