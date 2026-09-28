import Link from "next/link";
import type { ReactNode } from "react";
import { ShipcliFooter } from "./ShipcliFooter";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-medium text-neutral-300 transition-colors hover:text-white">
            <span aria-hidden="true">←</span> saas-autopsy
          </Link>
          <span className="text-xs uppercase tracking-[0.16em] text-neutral-600">Legal</span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <div className="section-kicker">{eyebrow}</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">{intro}</p>
        <div className="legal-copy mt-14">{children}</div>
      </article>

      <ShipcliFooter />
    </main>
  );
}
