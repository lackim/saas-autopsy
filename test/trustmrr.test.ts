import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { configureKey, loadApiKey, readApiKeyFromStdin } from "../src/commands/config.js";
import {
  fetchStartup,
  parseTarget,
  searchStartup,
  TrustMrrApiError,
  TrustMrrResponseError,
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
  techStack: [],
  cofounders: [],
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
    let options: RequestInit | undefined;
    const fetchImpl: typeof fetch = async (_input, init) => {
      options = init;
      return new Response(
        JSON.stringify({ data: startup }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    };
    assert.deepEqual(await fetchStartup("test-saas", "tmrr_test", fetchImpl), startup);
    assert.equal(options?.redirect, "error");
    assert.ok(options?.signal instanceof AbortSignal);
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

  it("rejects malformed startup data instead of trusting TypeScript casts", async () => {
    const fetchImpl: typeof fetch = async () => new Response(
      JSON.stringify({ data: { name: "Missing slug" } }),
      { status: 200, headers: { "content-type": "application/json" } },
    );

    await assert.rejects(
      fetchStartup("broken", "tmrr_test", fetchImpl),
      (error: unknown) => error instanceof TrustMrrResponseError,
    );
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

describe("readApiKeyFromStdin", () => {
  it("trims a piped key without logging it", async () => {
    async function* input() {
      yield Buffer.from("tmrr_test_key\n");
    }

    assert.equal(await readApiKeyFromStdin(input()), "tmrr_test_key");
  });

  it("stores a piped key without requiring it as a process argument", async () => {
    let stored: unknown;
    const config = {
      get: () => undefined,
      set: (_key: string, value: unknown) => {
        stored = value;
      },
      save: () => undefined,
    };
    async function* input() {
      yield "tmrr_secure_test_key\n";
    }

    await configureKey(undefined, { stdin: true }, config, input());

    assert.equal(stored, "tmrr_secure_test_key");
  });
});
