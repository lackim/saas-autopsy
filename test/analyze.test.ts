import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyze } from "../src/lib/analyze.js";
import type { TrustMrrStartup } from "../src/lib/trustmrr.js";

interface StartupOverrides extends Partial<Omit<TrustMrrStartup, "revenue">> {
  revenue?: Partial<TrustMrrStartup["revenue"]>;
}

function makeStartup(overrides: StartupOverrides = {}): TrustMrrStartup {
  const { revenue, ...startupOverrides } = overrides;
  return {
    name: "TestSaaS",
    slug: "testsaas",
    description: "A test SaaS product",
    category: "saas",
    country: "US",
    website: "https://testsaas.com",
    paymentProvider: "stripe",
    foundedDate: "2022-01-01",
    revenue: {
      mrr: revenue?.mrr ?? 50_000,
      last30Days: revenue?.last30Days ?? 50_000,
      total: revenue?.total ?? 1_000_000,
    },
    customers: 50,
    activeSubscriptions: 40,
    growth30d: 0.05,
    profitMarginLast30Days: 60,
    onSale: false,
    askingPrice: null,
    multiple: null,
    techStack: [],
    cofounders: [],
    xHandle: null,
    ...startupOverrides,
  };
}

describe("analyze", () => {
  it("converts TrustMRR cents and decimal growth to display units", () => {
    const report = analyze(makeStartup({
      revenue: { mrr: 42_500, last30Days: 123_456, total: 9_800_000 },
      growth30d: 0.12,
      askingPrice: 5_000_000,
    }));

    assert.equal(report.mrr, 425);
    assert.equal(report.revenue30d, 1234.56);
    assert.equal(report.revenueTotal, 98_000);
    assert.equal(report.growth, 12);
    assert.equal(report.askingPrice, 50_000);
  });

  it("healthy startup scores 80+", () => {
    const report = analyze(makeStartup());
    assert.ok(report.score >= 80, `Expected score >= 80, got ${report.score}`);
    assert.equal(report.status, "thriving");
  });

  it("zero revenue is critical", () => {
    const report = analyze(makeStartup({
      revenue: { mrr: 0, last30Days: 0, total: 0 },
      customers: 0,
    }));
    assert.ok(report.signals.some((signal) => signal.signal.includes("Zero lifetime revenue")));
    assert.equal(report.causeOfDeath, "Dead on arrival — never got traction");
  });

  it("detects a revenue collapse from decimal API growth", () => {
    const report = analyze(makeStartup({ growth30d: -0.6 }));
    assert.ok(report.signals.some((signal) => signal.signal.includes("collapsed")));
    assert.equal(report.causeOfDeath, "Revenue collapse");
  });

  it("detects total churn", () => {
    const report = analyze(makeStartup({ activeSubscriptions: 0 }));
    assert.ok(report.signals.some((signal) => signal.signal.includes("all churned")));
  });

  it("converts and reports a fire-sale asking price", () => {
    const report = analyze(makeStartup({ onSale: true, askingPrice: 100_000, multiple: 1.5 }));
    assert.equal(report.askingPrice, 1_000);
    assert.ok(report.signals.some((signal) => signal.signal.includes("Listed for sale ($1,000)")));
    assert.ok(report.signals.some((signal) => signal.signal.includes("Fire sale")));
  });

  it("detects negative and severely negative margins", () => {
    const warning = analyze(makeStartup({ profitMarginLast30Days: -20 }));
    const critical = analyze(makeStartup({ profitMarginLast30Days: -80 }));
    assert.ok(warning.signals.some((signal) => signal.signal.includes("Negative profit margin")));
    assert.ok(critical.signals.some((signal) => signal.signal.includes("Burning cash")));
  });

  it("dead startup scores 0-20", () => {
    const report = analyze(makeStartup({
      revenue: { mrr: 0, last30Days: 0, total: 500_000 },
      customers: 0,
      activeSubscriptions: 0,
      growth30d: -0.8,
      profitMarginLast30Days: -90,
    }));
    assert.ok(report.score <= 20, `Expected score <= 20, got ${report.score}`);
    assert.equal(report.status, "dead");
  });
});
