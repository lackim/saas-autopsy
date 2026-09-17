const NAV_LINKS = [
  { label: "Workflow", href: "#workflow" },
  { label: "Output", href: "#output" },
  { label: "GitHub", href: "https://github.com/lackim/saas-autopsy" },
  { label: "Install", href: "#install" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex min-w-0 items-center gap-2.5 font-semibold text-neutral-100 transition-colors hover:text-white">
          <span className="brand-mark" aria-hidden="true">›_</span>
          <span className="max-w-44 truncate sm:max-w-72">saas-autopsy</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={(link.label !== "Install" ? "hidden sm:inline " : "") + "text-sm text-neutral-500 transition-colors hover:text-neutral-200"}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
