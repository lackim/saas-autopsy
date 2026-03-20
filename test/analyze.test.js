import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../src/lib/analyze.js";

function makeStartup(overrides = {}) {
  return {
    name: "TestSaaS",
    slug: "testsaas",
    description: "A test SaaS product",
    category: "SaaS",
    country: "US",
    website: "https://testsaas.com",
    paymentProvider: "stripe",
    foundedDate: "2022-01-01",
    revenue: { mrr: 500, last30Days: 500, total: 10000, ...overrides.revenue },
    customers: overrides.customers ?? 50,
    activeSubscriptions: overrides.activeSubscriptions ?? 40,
    growth30d: overrides.growth30d ?? 5,
    profitMarginLast30Days: overrides.profitMarginLast30Days ?? 60,
    onSale: overrides.onSale ?? false,
    askingPrice: overrides.askingPrice ?? null,
    multiple: overrides.multiple ?? null,
    techStack: overrides.techStack ?? [],
    cofounders: overrides.cofounders ?? [],
    xHandle: overrides.xHandle ?? null,
    ...overrides,
  };
}

describe("analyze", () => {
  it("healthy startup scores 80+", () => {
    var report = analyze(makeStartup());
    assert.ok(report.score >= 80, `Expected score >= 80, got ${report.score}`);
    assert.equal(report.status, "thriving");
  });

  it("zero revenue = critical", () => {
    var report = analyze(makeStartup({ revenue: { mrr: 0, last30Days: 0, total: 0 }, customers: 0 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Zero lifetime revenue")));
    assert.equal(report.causeOfDeath, "Dead on arrival — never got traction");
  });

  it("MRR dropped to $0 with past revenue = critical", () => {
    var report = analyze(makeStartup({ revenue: { mrr: 0, last30Days: 0, total: 5000 } }));
    assert.ok(report.signals.some((s) => s.signal.includes("MRR dropped to $0")));
  });

  it("revenue collapse detected", () => {
    var report = analyze(makeStartup({ growth30d: -60 }));
    assert.ok(report.signals.some((s) => s.signal.includes("collapsed")));
    assert.equal(report.causeOfDeath, "Revenue collapse");
  });

  it("revenue decline detected", () => {
    var report = analyze(makeStartup({ growth30d: -30 }));
    assert.ok(report.signals.some((s) => s.signal.includes("declined")));
  });

  it("zero customers = critical", () => {
    var report = analyze(makeStartup({ customers: 0 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Zero customers")));
  });

  it("total churn detected", () => {
    var report = analyze(makeStartup({ activeSubscriptions: 0 }));
    assert.ok(report.signals.some((s) => s.signal.includes("all churned")));
  });

  it("on sale detected as warning", () => {
    var report = analyze(makeStartup({ onSale: true, askingPrice: 50000 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Listed for sale")));
  });

  it("fire sale detected", () => {
    var report = analyze(makeStartup({ onSale: true, askingPrice: 1000, multiple: 1.5 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Fire sale")));
  });

  it("negative profit margin = warning", () => {
    var report = analyze(makeStartup({ profitMarginLast30Days: -20 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Negative profit margin")));
  });

  it("burning cash = critical", () => {
    var report = analyze(makeStartup({ profitMarginLast30Days: -80 }));
    assert.ok(report.signals.some((s) => s.signal.includes("Burning cash")));
  });

  it("report contains expected fields", () => {
    var report = analyze(makeStartup());
    assert.ok("name" in report);
    assert.ok("slug" in report);
    assert.ok("score" in report);
    assert.ok("status" in report);
    assert.ok("causeOfDeath" in report);
    assert.ok("signals" in report);
    assert.ok("mrr" in report);
    assert.ok("customers" in report);
  });

  it("dead startup scores 0-20", () => {
    var report = analyze(makeStartup({
      revenue: { mrr: 0, last30Days: 0, total: 5000 },
      customers: 0,
      activeSubscriptions: 0,
      growth30d: -80,
      profitMarginLast30Days: -90,
    }));
    assert.ok(report.score <= 20, `Expected score <= 20, got ${report.score}`);
    assert.equal(report.status, "dead");
  });
});
