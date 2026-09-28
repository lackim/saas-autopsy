import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeFilenameSegment, safeTerminalText } from "../src/lib/terminal.js";

describe("terminal safety", () => {
  it("collapses control characters and whitespace", () => {
    assert.equal(safeTerminalText("  alpha\n\u001b]0;title\u0007 beta  "), "alpha ]0;title beta");
  });

  it("creates a portable filename segment from untrusted slugs", () => {
    assert.equal(safeFilenameSegment("../Mój\u001b[31m SaaS"), "moj-31m-saas");
    assert.equal(safeFilenameSegment("\u0000\n"), "startup");
  });
});
