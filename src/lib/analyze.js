export function analyze(startup) {
  var signals = [];

  var mrr = startup.revenue?.mrr ?? 0;
  var revenue30d = startup.revenue?.last30Days ?? 0;
  var revenueTotal = startup.revenue?.total ?? 0;
  var customers = startup.customers ?? 0;
  var activeSubs = startup.activeSubscriptions ?? 0;
  var growth = startup.growth30d;
  var profitMargin = startup.profitMarginLast30Days;
  var onSale = startup.onSale ?? false;
  var askingPrice = startup.askingPrice ?? null;
  var multiple = startup.multiple ?? null;
  var category = startup.category ?? "Unknown";
  var country = startup.country ?? "Unknown";
  var foundedDate = startup.foundedDate ? new Date(startup.foundedDate) : null;
  var ageInDays = foundedDate ? Math.floor((Date.now() - foundedDate.getTime()) / (24 * 60 * 60 * 1000)) : null;

  // --- Revenue signals ---
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

  // --- Growth signals ---
  if (growth !== null && growth !== undefined) {
    if (growth <= -50) {
      signals.push({ signal: `Revenue collapsed ${growth}% in 30 days`, severity: "critical" });
    } else if (growth <= -25) {
      signals.push({ signal: `Revenue declined ${growth}% in 30 days`, severity: "warning" });
    } else if (growth < 0) {
      signals.push({ signal: `Revenue shrinking (${growth}% in 30 days)`, severity: "warning" });
    }
  }

  // --- Customer signals ---
  if (customers === 0) {
    signals.push({ signal: "Zero customers", severity: "critical" });
  } else if (customers < 5 && mrr > 0) {
    signals.push({ signal: `Only ${customers} customer${customers > 1 ? "s" : ""}`, severity: "warning" });
  }

  if (activeSubs === 0 && customers > 0) {
    signals.push({ signal: "No active subscriptions (all churned)", severity: "critical" });
  }

  // --- Profit signals ---
  if (profitMargin !== null && profitMargin !== undefined) {
    if (profitMargin < -50) {
      signals.push({ signal: `Burning cash: ${profitMargin}% profit margin`, severity: "critical" });
    } else if (profitMargin < 0) {
      signals.push({ signal: `Negative profit margin (${profitMargin}%)`, severity: "warning" });
    }
  }

  // --- Sale signals ---
  if (onSale) {
    signals.push({ signal: `Listed for sale${askingPrice ? ` ($${askingPrice.toLocaleString()})` : ""}`, severity: "warning" });
    if (multiple !== null && multiple < 2) {
      signals.push({ signal: `Fire sale: ${multiple}x multiple`, severity: "critical" });
    }
  }

  // --- Health score (0-100) ---
  var score = 100;
  for (var s of signals) {
    if (s.severity === "critical") score -= 25;
    if (s.severity === "warning") score -= 10;
  }

  // Bonus points for strong metrics
  if (mrr >= 1000) score += 10;
  if (growth > 20) score += 10;
  if (customers >= 50) score += 5;
  if (profitMargin !== null && profitMargin > 50) score += 5;

  score = Math.max(0, Math.min(100, score));

  // --- Cause of death ---
  var causeOfDeath = determineCause(signals, { mrr, onSale, growth, customers, score });

  // --- Status ---
  var status;
  if (score >= 80) status = "thriving";
  else if (score >= 60) status = "healthy";
  else if (score >= 40) status = "declining";
  else if (score >= 20) status = "on life support";
  else status = "dead";

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
    techStack: startup.techStack || [],
    cofounders: startup.cofounders || [],
    xHandle: startup.xHandle,
    signals,
    score,
    status,
    causeOfDeath,
  };
}

function determineCause(signals, { mrr, onSale, growth, customers, score }) {
  var criticals = signals.filter((s) => s.severity === "critical");

  if (mrr === 0 && customers === 0) return "Dead on arrival — never got traction";
  if (criticals.find((s) => s.signal.includes("collapsed"))) return "Revenue collapse";
  if (criticals.find((s) => s.signal.includes("all churned"))) return "Total customer churn";
  if (criticals.find((s) => s.signal.includes("dropped to $0"))) return "Revenue flatlined";
  if (onSale && criticals.find((s) => s.signal.includes("Fire sale"))) return "Founder giving up (fire sale)";
  if (onSale) return "Founder looking to exit";
  if (growth !== null && growth < -25) return "Accelerating decline";
  if (signals.length === 0) return "Alive and kicking";
  if (score >= 60) return "Minor symptoms — mostly healthy";

  return "Slow bleed";
}
