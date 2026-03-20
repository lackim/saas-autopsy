import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseTarget, getApiKey } from "../src/lib/trustmrr.js";

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

describe("getApiKey", () => {
  it("returns apiKey from options", () => {
    assert.equal(getApiKey({ apiKey: "test-key" }), "test-key");
  });

  it("falls back to env var", () => {
    var prev = process.env.TRUSTMRR_API_KEY;
    process.env.TRUSTMRR_API_KEY = "env-key";
    assert.equal(getApiKey({}), "env-key");
    if (prev) process.env.TRUSTMRR_API_KEY = prev;
    else delete process.env.TRUSTMRR_API_KEY;
  });

  it("returns null when no key", () => {
    var prev = process.env.TRUSTMRR_API_KEY;
    delete process.env.TRUSTMRR_API_KEY;
    assert.equal(getApiKey({}), null);
    if (prev) process.env.TRUSTMRR_API_KEY = prev;
  });
});
