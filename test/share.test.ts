import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it } from "node:test";
import { share } from "@shipcli/share";
import type { AnalysisReport } from "../src/lib/analyze.js";
import { saasDeathCertificateTemplate } from "../src/share/card.js";

const report: AnalysisReport = {
  name: "Example SaaS",
  slug: "example-saas",
  description: "A verified SaaS business",
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
  growth: -12,
  profitMargin: 20,
  onSale: false,
  askingPrice: null,
  multiple: null,
  paymentProvider: "stripe",
  techStack: [],
  cofounders: [],
  xHandle: null,
  signals: [{ signal: "Revenue shrinking (-12% in 30 days)", severity: "warning" }],
  score: 65,
  status: "healthy",
  causeOfDeath: "Minor symptoms — mostly healthy",
};

it("renders a shareable PNG through ShipCLI", async (context) => {
  const outDir = mkdtempSync(join(tmpdir(), "saas-autopsy-share-"));
  context.after(() => rmSync(outDir, { recursive: true, force: true }));

  const output = await share(saasDeathCertificateTemplate, report, {
    toolName: "saas-autopsy",
    filename: "result.png",
    outDir,
  });
  const png = readFileSync(output);

  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(png.length > 10_000);
});
