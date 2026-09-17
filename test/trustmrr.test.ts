import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadApiKey } from "../src/commands/config.js";
import {
  fetchStartup,
  parseTarget,
  searchStartup,
  TrustMrrApiError,
  type TrustMrrStartup,
} from "../src/lib/trustmrr.js";

const startup: TrustMrrStartup = {
  name: "Test SaaS",
  slug: "test-saas",
  description: null,
  category: "saas",
  country: "US",
  website: null,
  foundedDate: null,
  paymentProvider: "stripe",
  revenue: { mrr: 10_000, last30Days: 10_000, total: 20_000 },
  customers: 2,
  activeSubscriptions: 2,
  growth30d: 0.1,
  profitMarginLast30Days: null,
  onSale: false,
  askingPrice: null,
  multiple: null,
  xHandle: null,
};

describe("parseTarget", () => {
  it("normalizes names and diacritics", () => {
    assert.equal(parseTarget("  Mój Cool App  "), "moj-cool-app");
  });

  it("extracts a slug from a TrustMRR URL", () => {
    assert.equal(parseTarget("https://trustmrr.com/startup/Test-SaaS"), "test-saas");
  });
});

describe("TrustMRR client", () => {
  it("unwraps startup responses", async () => {
    const fetchImpl: typeof fetch = async () => new Response(
      JSON.stringify({ data: startup }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
    assert.deepEqual(await fetchStartup("test-saas", "tmrr_test", fetchImpl), startup);
  });

  it("returns null only for a missing startup", async () => {
    const fetchImpl: typeof fetch = async () => new Response(null, { status: 404 });
    assert.equal(await fetchStartup("missing", "tmrr_test", fetchImpl), null);
  });

  it("preserves authentication failures", async () => {
    const fetchImpl: typeof fetch = async () => new Response(null, { status: 401 });
    await assert.rejects(
      fetchStartup("private", "tmrr_invalid", fetchImpl),
      (error: unknown) => error instanceof TrustMrrApiError && error.status === 401,
    );
  });

  it("encodes search input and unwraps list responses", async () => {
    let requestedUrl = "";
    const fetchImpl: typeof fetch = async (input) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify({ data: [startup] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };
    assert.deepEqual(await searchStartup("Test & SaaS", "tmrr_test", fetchImpl), [startup]);
    assert.equal(new URL(requestedUrl).searchParams.get("search"), "Test & SaaS");
  });
});

describe("loadApiKey", () => {
  const emptyConfig = { get: () => undefined };

  it("uses the explicit option first", () => {
    assert.equal(loadApiKey({ apiKey: "tmrr_flag" }, emptyConfig, {}), "tmrr_flag");
  });

  it("falls back to saved configuration and then environment", () => {
    assert.equal(loadApiKey({}, { get: () => "tmrr_saved" }, {}), "tmrr_saved");
    assert.equal(loadApiKey({}, emptyConfig, { TRUSTMRR_API_KEY: "tmrr_env" }), "tmrr_env");
  });

  it("returns null without credentials", () => {
    assert.equal(loadApiKey({}, emptyConfig, {}), null);
  });
});
