import type { Cofounder, TechStackItem, TrustMrrStartup } from "./trustmrr.js";

export type SignalSeverity = "warning" | "critical";
export type HealthStatus = "thriving" | "healthy" | "declining" | "on life support" | "dead";

export interface DeathSignal {
  signal: string;
  severity: SignalSeverity;
}

export interface AnalysisReport {
  name: string;
  slug: string;
  description: string | null;
  category: string;
  country: string;
  website: string | null;
  foundedDate: string | null;
  ageInDays: number | null;
  mrr: number;
  revenue30d: number;
  revenueTotal: number;
  customers: number;
  activeSubs: number;
  growth: number | null;
  profitMargin: number | null;
  onSale: boolean;
  askingPrice: number | null;
  multiple: number | null;
  paymentProvider: string;
  techStack: TechStackItem[];
  cofounders: Cofounder[];
  xHandle: string | null;
  signals: DeathSignal[];
  score: number;
  status: HealthStatus;
  causeOfDeath: string;
}

interface CauseMetrics {
  mrr: number;
  onSale: boolean;
  growth: number | null;
  customers: number;
  score: number;
}

function centsToDollars(value: number): number {
  return Math.round(value) / 100;
}

export function analyze(startup: TrustMrrStartup): AnalysisReport {
  const signals: DeathSignal[] = [];

  const mrr = centsToDollars(startup.revenue?.mrr ?? 0);
  const revenue30d = centsToDollars(startup.revenue?.last30Days ?? 0);
  const revenueTotal = centsToDollars(startup.revenue?.total ?? 0);
  const customers = startup.customers ?? 0;
  const activeSubs = startup.activeSubscriptions ?? 0;
  const growth = startup.growth30d == null ? null : startup.growth30d * 100;
  const profitMargin = startup.profitMarginLast30Days;
  const onSale = startup.onSale ?? false;
  const askingPrice = startup.askingPrice == null ? null : centsToDollars(startup.askingPrice);
  const multiple = startup.multiple ?? null;
  const category = startup.category ?? "Unknown";
  const country = startup.country ?? "Unknown";
  const foundedDate = startup.foundedDate ? new Date(startup.foundedDate) : null;
  const ageInDays = foundedDate
    ? Math.floor((Date.now() - foundedDate.getTime()) / (24 * 60 * 60 * 1000))
    : null;

  if (mrr === 0 && revenueTotal === 0) {
    signals.push({ signal: "Zero lifetime revenue", severity: "critical" });
  } else if (mrr === 0 && revenueTotal > 0) {
    signals.push({ signal: "MRR dropped to $0 (had past revenue)", severity: "critical" });
  } else if (mrr < 10) {
    signals.push({ signal: `MRR under $10 ($${mrr}/mo)`, severity: "warning" });
  }

  if (revenue30d === 0 && revenueTotal > 0) {
    signals.push({ signal: "No revenue in the last 30 days", severity: "critical" });
  }

  if (growth !== null) {
    if (growth <= -50) {
      signals.push({ signal: `Revenue collapsed ${growth}% in 30 days`, severity: "critical" });
    } else if (growth <= -25) {
      signals.push({ signal: `Revenue declined ${growth}% in 30 days`, severity: "warning" });
    } else if (growth < 0) {
      signals.push({ signal: `Revenue shrinking (${growth}% in 30 days)`, severity: "warning" });
    }
  }

  if (customers === 0) {
    signals.push({ signal: "Zero customers", severity: "critical" });
  } else if (customers < 5 && mrr > 0) {
    signals.push({ signal: `Only ${customers} customer${customers > 1 ? "s" : ""}`, severity: "warning" });
  }

  if (activeSubs === 0 && customers > 0) {
    signals.push({ signal: "No active subscriptions (all churned)", severity: "critical" });
  }

  if (profitMargin !== null) {
    if (profitMargin < -50) {
      signals.push({ signal: `Burning cash: ${profitMargin}% profit margin`, severity: "critical" });
    } else if (profitMargin < 0) {
      signals.push({ signal: `Negative profit margin (${profitMargin}%)`, severity: "warning" });
    }
  }

  if (onSale) {
    signals.push({
      signal: `Listed for sale${askingPrice ? ` ($${askingPrice.toLocaleString()})` : ""}`,
      severity: "warning",
    });
    if (multiple !== null && multiple < 2) {
      signals.push({ signal: `Fire sale: ${multiple}x multiple`, severity: "critical" });
    }
  }

  let score = 100;
  for (const signal of signals) {
    score -= signal.severity === "critical" ? 25 : 10;
  }

  if (mrr >= 1_000) score += 10;
  if (growth !== null && growth > 20) score += 10;
  if (customers >= 50) score += 5;
  if (profitMargin !== null && profitMargin > 50) score += 5;
  score = Math.max(0, Math.min(100, score));

  const causeOfDeath = determineCause(signals, { mrr, onSale, growth, customers, score });
  const status: HealthStatus = score >= 80
    ? "thriving"
    : score >= 60
      ? "healthy"
      : score >= 40
        ? "declining"
        : score >= 20
          ? "on life support"
          : "dead";

  return {
    name: startup.name,
    slug: startup.slug,
    description: startup.description,
    category,
    country,
    website: startup.website,
    foundedDate: foundedDate ? foundedDate.toISOString() : null,
    ageInDays,
    mrr,
    revenue30d,
    revenueTotal,
    customers,
    activeSubs,
    growth,
    profitMargin,
    onSale,
    askingPrice,
    multiple,
    paymentProvider: startup.paymentProvider,
    techStack: startup.techStack ?? [],
    cofounders: startup.cofounders ?? [],
    xHandle: startup.xHandle,
    signals,
    score,
    status,
    causeOfDeath,
  };
}

function determineCause(signals: DeathSignal[], metrics: CauseMetrics): string {
  const criticals = signals.filter((signal) => signal.severity === "critical");

  if (metrics.mrr === 0 && metrics.customers === 0) return "Dead on arrival — never got traction";
  if (criticals.some((signal) => signal.signal.includes("collapsed"))) return "Revenue collapse";
  if (criticals.some((signal) => signal.signal.includes("all churned"))) return "Total customer churn";
  if (criticals.some((signal) => signal.signal.includes("dropped to $0"))) return "Revenue flatlined";
  if (metrics.onSale && criticals.some((signal) => signal.signal.includes("Fire sale"))) {
    return "Founder giving up (fire sale)";
  }
  if (metrics.onSale) return "Founder looking to exit";
  if (metrics.growth !== null && metrics.growth < -25) return "Accelerating decline";
  if (signals.length === 0) return "Alive and kicking";
  if (metrics.score >= 60) return "Minor symptoms — mostly healthy";
  return "Slow bleed";
}
