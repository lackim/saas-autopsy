import { fmt } from "@shipcli/core/output";
import kleur from "kleur";
import type { AnalysisReport, HealthStatus } from "./analyze.js";

const WIDTH = 54;
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function visibleLength(value: string): number {
  return value.replace(ANSI_RE, "").length;
}

function truncate(value: string, width: number): string {
  return value.length <= width ? value : value.slice(0, Math.max(0, width - 1)) + "…";
}

function row(value: string): string {
  const padding = Math.max(0, WIDTH - visibleLength(value));
  return kleur.dim("  ║") + value + " ".repeat(padding) + kleur.dim("║");
}

function wrapText(value: string, width: number): string[] {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= width) current = candidate;
    else {
      if (current) lines.push(current);
      current = truncate(word, width);
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function renderCertificate(report: AnalysisReport): string {
  const border = "═".repeat(WIDTH);
  const lines: string[] = [
    "",
    kleur.dim(`  ╔${border}╗`),
    row(kleur.bold("         SAAS DEATH CERTIFICATE")),
    kleur.dim(`  ╠${border}╣`),
    row(`  Name:       ${fmt.bold(truncate(report.name, WIDTH - 14))}`),
    row(`  Category:   ${truncate(report.category, WIDTH - 14)}`),
    row(`  Country:    ${truncate(report.country, WIDTH - 14)}`),
  ];

  if (report.foundedDate) rowPush(lines, `  Founded:    ${formatDate(report.foundedDate)}`);
  if (report.ageInDays !== null) rowPush(lines, `  Age:        ${formatAge(report.ageInDays)}`);
  lines.push(row(""));
  lines.push(row(`  Cause:      ${kleur.red(truncate(report.causeOfDeath, WIDTH - 14))}`));
  lines.push(row(`  Status:     ${statusBadge(report.status)}`));
  lines.push(row(`  Score:      ${scoreBadge(report.score)}/100`));
  lines.push(row(""));
  lines.push(kleur.dim(`  ╠${border}╣`));
  lines.push(row(kleur.bold("  Financials")));
  lines.push(row(""));
  lines.push(row(`  MRR:            ${fmt.val(money(report.mrr))}`));
  lines.push(row(`  Revenue (30d):  ${fmt.val(money(report.revenue30d))}`));
  lines.push(row(`  Total Revenue:  ${fmt.val(money(report.revenueTotal))}`));
  lines.push(row(`  Customers:      ${fmt.val(report.customers)}`));
  lines.push(row(`  Active Subs:    ${fmt.val(report.activeSubs)}`));

  if (report.growth !== null) {
    const rounded = Math.round(report.growth * 10) / 10;
    const text = rounded > 0 ? `+${rounded}%` : `${rounded}%`;
    const colored = rounded > 0 ? kleur.green(text) : rounded < 0 ? kleur.red(text) : kleur.yellow(text);
    lines.push(row(`  Growth (30d):   ${colored}`));
  }

  if (report.profitMargin !== null) {
    const text = `${report.profitMargin}%`;
    const colored = report.profitMargin >= 0 ? kleur.green(text) : kleur.red(text);
    lines.push(row(`  Profit Margin:  ${colored}`));
  }

  if (report.onSale) {
    lines.push(row(""));
    let sale = report.askingPrice ? `FOR SALE — ${money(report.askingPrice)}` : "FOR SALE";
    if (report.multiple) sale += ` (${report.multiple}x)`;
    lines.push(row(`  ${kleur.bgRed().white(` ${truncate(sale, WIDTH - 6)} `)}`));
  }

  lines.push(row(""));
  if (report.signals.length > 0) {
    lines.push(kleur.dim(`  ╠${border}╣`));
    lines.push(row(kleur.bold("  Death Signals")));
    lines.push(row(""));
    for (const signal of report.signals) {
      const icon = signal.severity === "critical" ? kleur.red("✖") : kleur.yellow("⚠");
      const wrapped = wrapText(signal.signal, WIDTH - 4);
      lines.push(row(`  ${icon} ${wrapped[0]}`));
      for (const continuation of wrapped.slice(1)) lines.push(row(`    ${continuation}`));
    }
    lines.push(row(""));
  }

  lines.push(kleur.dim(`  ╚${border}╝`), "");
  if (report.description) lines.push(kleur.dim(`  "${report.description}"`), "");
  if (report.website) lines.push(kleur.dim(`  ${report.website}`), "");
  return lines.join("\n");
}

function rowPush(lines: string[], value: string): void {
  lines.push(row(value));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAge(days: number): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return years > 0 ? `${years}y ${months}m` : `${months}m`;
}

function statusBadge(status: HealthStatus): string {
  const colors: Record<HealthStatus, (text: string) => string> = {
    thriving: kleur.green,
    healthy: kleur.green,
    declining: kleur.yellow,
    "on life support": kleur.red,
    dead: (text) => kleur.bgRed().white(` ${text} `),
  };
  return colors[status](status.toUpperCase());
}

function scoreBadge(score: number): string {
  if (score >= 80) return kleur.green(String(score));
  if (score >= 50) return kleur.yellow(String(score));
  return kleur.red(String(score));
}
