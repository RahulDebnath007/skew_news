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
    title: "Multiple Perspectives",
    description:
      "Compare coverage from different sources instead of relying on a single viewpoint.",
  },
  {
    title: "Bias & Framing",
    description:
      "Understand how wording, emphasis, and presentation can influence the way a story is perceived.",
  },
  {
    title: "Clear Summaries",
    description:
      "Quickly understand the key points of a story without having to read every article first.",
  },
  {
    title: "Transparency",
    description:
      "We provide context and analysis so you can make your own judgment about the news.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-20 sm:py-24 lg:py-28">
           <div className="mx-auto max-w-4xl text-center skew-animate-fade-up">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                About Skew
              </p>

              <h1 className="mt-5 text-h1 font-bold tracking-tight text-text-primary sm:text-[3.5rem] sm:leading-[1.05]">
                See the news from more than one angle.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-8 text-text-secondary">
                Skew News helps you understand not just what happened, but
                how different sources present the same story.
              </p>
            </div>
          </div>
        </section>

        {/* Why Skew */}
        <section className="bg-surface">
          <div className="mx-auto max-w-(--container-app) px-6 py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                  Why Skew?
                </p>

                <h2 className="mt-3 text-h2 font-bold text-text-primary">
                  One event. Different headlines.
                </h2>
              </div>

              <div className="space-y-5 text-body-md leading-7 text-text-secondary">
                <p>
                  The same event can produce very different headlines.
                </p>

                <p>
                  Different publications may emphasize different facts, use
                  different language, or focus on different aspects of the same
                  event.
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

        {/* How Skew Works */}
        <section className="border-y border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                How Skew Works
              </p>

              <h2 className="mt-3 text-h2 font-bold text-text-primary">
                From multiple sources to broader context.
              </h2>

              <p className="mt-4 text-body-md leading-7 text-text-secondary">
                Skew brings together coverage and analyzes how different
                sources approach the same story.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item) => (
                <div
                  key={item.number}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <span className="text-caption font-semibold text-accent">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-h4 font-semibold text-text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-body-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Focus On */}
        <section className="bg-surface">
          <div className="mx-auto max-w-(--container-app) px-6 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                What We Focus On
              </p>

              <h2 className="mt-3 text-h2 font-bold text-text-primary">
                Context over conclusions.
              </h2>

              <p className="mt-4 text-body-md leading-7 text-text-secondary">
                Our goal is not to tell you what to think. It is to make the
                differences in news coverage easier to understand.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {FOCUS_AREAS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-bg-primary p-7"
                >
                  <h3 className="text-h4 font-semibold text-text-primary">
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

        {/* Philosophy */}
        <section className="border-t border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-20 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                Our Philosophy
              </p>

              <blockquote className="mt-6 text-h2 font-semibold leading-tight text-text-primary sm:text-[2.5rem]">
                “Don&apos;t just read the news. Understand how it&apos;s being
                told.”
              </blockquote>

              <p className="mx-auto mt-6 max-w-2xl text-body-md leading-7 text-text-secondary">
                Skew is designed to encourage curiosity, critical thinking,
                and a broader understanding of current events.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}