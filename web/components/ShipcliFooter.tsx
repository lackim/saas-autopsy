import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const PROJECT_LINKS = [
  { label: "TrustMRR API", href: "https://trustmrr.com/docs/api" },
  { label: "GitHub", href: "https://github.com/lackim/saas-autopsy" },
];

export function ShipcliFooter() {
  return (
    <footer className="mt-8 border-t border-neutral-900 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 text-sm text-neutral-600 sm:flex-row">
        <div>
          <span className="font-medium text-neutral-400">saas-autopsy</span>
          <span className="ml-3">Post-mortem analysis of SaaS startups</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-neutral-300"
            >
              {link.label}
            </Link>
          ))}
          {PROJECT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-neutral-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/lackim/shipcli"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-neutral-300"
        >
          Built with <span className="text-emerald-400">shipcli</span>
        </a>
      </div>
    </footer>
  );
}
