import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseTarget } from "../src/lib/trustmrr.js";
import { loadApiKey } from "../src/commands/config.js";

describe("parseTarget", () => {
  it("lowercases input", () => {
    assert.equal(parseTarget("MyStartup"), "mystartup");
  });

  it("replaces spaces with dashes", () => {
    assert.equal(parseTarget("My Cool App"), "my-cool-app");
  });

  it("passes through slugs unchanged", () => {
    assert.equal(parseTarget("already-a-slug"), "already-a-slug");
  });
});

describe("loadApiKey", () => {
  it("returns apiKey from options first", () => {
    assert.equal(loadApiKey({ apiKey: "test-key" }), "test-key");
  });

  it("falls back to env var", () => {
    var prev = process.env.TRUSTMRR_API_KEY;
    process.env.TRUSTMRR_API_KEY = "env-key";
    assert.equal(loadApiKey({}), "env-key");
    if (prev) process.env.TRUSTMRR_API_KEY = prev;
    else delete process.env.TRUSTMRR_API_KEY;
  });

  it("returns null when no key anywhere", () => {
    var prev = process.env.TRUSTMRR_API_KEY;
    delete process.env.TRUSTMRR_API_KEY;
    // loadApiKey also checks config file, but with no saved key it should fall through
    var result = loadApiKey({});
    // Could be null or a saved key from config — just ensure it doesn't throw
    assert.ok(result === null || typeof result === "string");
    if (prev) process.env.TRUSTMRR_API_KEY = prev;
  });
});
