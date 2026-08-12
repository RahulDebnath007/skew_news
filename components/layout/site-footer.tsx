import Link from "next/link";

const COLUMNS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const SOCIALS = [
  { label: "X", href: "#" },
  { label: "in", href: "#" },
  { label: "IG", href: "#" },
  { label: "YT", href: "#" },
];

/**
 * Theme-aware site footer.
 *
 * Uses the application's semantic color tokens instead of hardcoded
 * white/black colors so the footer works correctly in Light and Dark mode.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 w-full border-t border-border bg-bg-primary text-text-secondary">
      {/* Main footer */}
      <div className="mx-auto grid max-w-(--container-app) grid-cols-2 gap-x-8 gap-y-10 px-6 py-14 md:grid-cols-4 lg:py-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link
            href="/"
            className="inline-flex items-baseline gap-1.5"
          >
            <span className="text-h3 font-bold text-text-primary">
              Skew
            </span>

            <span className="text-body-sm text-text-secondary">
              News
            </span>
          </Link>

          <p className="mt-3 max-w-52 text-body-sm leading-6 text-text-secondary">
            Balanced news coverage powered by AI.
          </p>
        </div>

        {/* Footer columns */}
        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h4 className="text-body-sm font-semibold uppercase tracking-wide text-text-primary">
              {column.heading}
            </h4>

            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social / Connect */}
        <div>
          <h4 className="text-body-sm font-semibold uppercase tracking-wide text-text-primary">
            Connect
          </h4>

          <div className="mt-4 flex gap-2.5">
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-secondary text-caption font-medium text-text-secondary transition-colors hover:border-text-secondary hover:bg-bg-secondary hover:text-text-primary"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-(--container-app) items-center justify-between px-6 py-5">
          <p className="text-caption text-text-secondary">
            © 2026 Rahul Debnath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}