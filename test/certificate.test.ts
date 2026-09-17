import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderCertificate } from "../src/lib/certificate.js";
import type { AnalysisReport } from "../src/lib/analyze.js";

// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function report(): AnalysisReport {
  return {
    name: "Test SaaS",
    slug: "test-saas",
    description: "A test product",
    category: "saas",
    country: "US",
    website: "https://example.com",
    foundedDate: "2024-01-01T00:00:00.000Z",
    ageInDays: 365,
    mrr: 425,
    revenue30d: 1234.56,
    revenueTotal: 98_000,
    customers: 5,
    activeSubs: 4,
    growth: -58,
    profitMargin: 20,
    onSale: false,
    askingPrice: null,
    multiple: null,
    paymentProvider: "stripe",
    techStack: [],
    cofounders: [],
    xHandle: null,
    signals: [{ signal: "Revenue collapsed 58% during the last thirty days", severity: "critical" }],
    score: 65,
    status: "healthy",
    causeOfDeath: "Minor symptoms — mostly healthy",
  };
}

describe("renderCertificate", () => {
  it("keeps wrapped certificate rows aligned and formats dollars", () => {
    const output = renderCertificate(report()).replace(ANSI_RE, "");
    const rows = output.split("\n").filter((line) => line.includes("║"));
    assert.ok(rows.length > 0);
    for (const line of rows) assert.equal(line.length, 58, `Misaligned row: ${line}`);
    assert.match(output, /MRR:\s+\$425/);
    assert.match(output, /Revenue \(30d\):\s+\$1,234\.56/);
  });
});
