import { TopBar } from "@/components/layout/top-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const CONTACT_TOPICS = [
  {
    number: "01",
    title: "General Questions",
    description:
      "Questions about Skew, its features, or how the platform works.",
  },
  {
    number: "02",
    title: "Feedback",
    description:
      "Have an idea or suggestion that could make Skew better?",
  },
  {
    number: "03",
    title: "Corrections",
    description:
      "Found an inaccurate article, source, summary, or analysis?",
  },
];

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-4.1-.9L3 21l1.9-4.1A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />

                <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                  Contact Skew
                </p>
              </div>

              <h1 className="mt-5 text-h1 font-bold tracking-tight text-text-primary sm:max-w-2xl">
                Let&apos;s start a conversation.
              </h1>

              <p className="mt-5 max-w-2xl text-body-lg leading-8 text-text-secondary">
                Have a question, found something that needs correcting, or
                simply have an idea for Skew? We&apos;d like to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="bg-surface">
          <div className="mx-auto max-w-(--container-app) px-6 py-12 sm:py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
              {/* LEFT SIDE */}
              <div className="flex flex-col">
                {/* Contact intro card */}
                <div className="rounded-2xl border border-border bg-bg-primary p-7 sm:p-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MessageIcon />
                  </div>

                  <h2 className="mt-6 text-h3 font-semibold text-text-primary">
                    How can we help?
                  </h2>

                  <p className="mt-3 text-body-sm leading-6 text-text-secondary">
                    We&apos;re building Skew to make news easier to understand
                    from multiple perspectives. Your feedback helps us make it
                    better.
                  </p>

                  <div className="mt-7 space-y-4 border-t border-border pt-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-text-secondary">
                        <MailIcon />
                      </div>

                      <div>
                        <p className="text-body-sm font-medium text-text-primary">
                          Email
                        </p>

                        <p className="mt-1 text-body-sm text-text-secondary">
                          hello@skew.news
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-text-secondary">
                        <MessageIcon />
                      </div>

                      <div>
                        <p className="text-body-sm font-medium text-text-primary">
                          Response time
                        </p>

                        <p className="mt-1 text-body-sm text-text-secondary">
                          We&apos;ll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                <div className="mt-8">
                  <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                    What can you contact us about?
                  </p>

                  <div className="mt-5 space-y-3">
                    {CONTACT_TOPICS.map((topic) => (
                      <div
                        key={topic.number}
                        className="group rounded-xl border border-border bg-bg-primary p-5 transition-colors hover:border-accent/40"
                      >
                        <div className="flex gap-4">
                          <span className="text-caption font-semibold text-accent">
                            {topic.number}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-4">
                              <h3 className="text-body-md font-semibold text-text-primary">
                                {topic.title}
                              </h3>

                              <span className="text-text-secondary transition-transform group-hover:translate-x-1">
                                <ArrowIcon />
                              </span>
                            </div>

                            <p className="mt-1.5 text-body-sm leading-6 text-text-secondary">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE — FORM */}
              <div className="rounded-2xl border border-border bg-bg-primary p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="max-w-xl">
                  <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
                    Send a message
                  </p>

                  <h2 className="mt-3 text-h2 font-bold text-text-primary">
                    Tell us what&apos;s on your mind.
                  </h2>

                  <p className="mt-3 text-body-sm leading-6 text-text-secondary">
                    Fill in the details below and send us your message.
                  </p>
                </div>

                <form className="mt-8 space-y-6">
                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-body-sm font-medium text-text-primary"
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-body-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 focus:border-accent focus:ring-2 focus:ring-accent/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-body-sm font-medium text-text-primary"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-body-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 focus:border-accent focus:ring-2 focus:ring-accent/10"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="text-body-sm font-medium text-text-primary"
                    >
                      What can we help with?
                    </label>

                    <select
                      id="subject"
                      name="subject"
                      defaultValue=""
                      className="mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-body-sm text-text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="general">
                        General Question
                      </option>
                      <option value="feedback">Feedback</option>
                      <option value="correction">Report a Correction</option>
                      <option value="technical">
                        Technical Issue
                      </option>
                      <option value="other">Something Else</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="text-body-sm font-medium text-text-primary"
                      >
                        Message
                      </label>

                      <span className="text-caption text-text-secondary">
                        Required
                      </span>
                    </div>

                    <textarea
                      id="message"
                      name="message"
                      rows={7}
                      placeholder="Write your message here..."
                      className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-3 text-body-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-sm text-caption leading-5 text-text-secondary">
                      By sending this message, you agree to be contacted about
                      your request.
                    </p>

                    <button
                      type="submit"
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-text-primary px-6 text-body-sm font-semibold text-bg-primary transition-all hover:opacity-90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      Send Message
                      <ArrowIcon />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border bg-bg-primary">
          <div className="mx-auto max-w-(--container-app) px-6 py-16 text-center sm:py-20">
            <p className="text-caption font-semibold uppercase tracking-[0.18em] text-accent">
              Skew News
            </p>

            <h2 className="mt-3 text-h3 font-semibold text-text-primary">
              Better context starts with better questions.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-body-md leading-7 text-text-secondary">
              Whether you&apos;re questioning a story or suggesting a better
              way to understand it, we&apos;re listening.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}