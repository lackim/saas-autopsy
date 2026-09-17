import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const env = { ...process.env, SHIPCLI_DISABLE_UPDATE_CHECK: "1" };

describe("saas-autopsy CLI", () => {
  it("shows root and config commands through ShipCLI", () => {
    const root = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts", "--help"], {
      cwd: projectRoot,
      encoding: "utf-8",
      env,
    });
    const config = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts", "config", "--help"], {
      cwd: projectRoot,
      encoding: "utf-8",
      env,
    });

    assert.equal(root.status, 0, root.stderr);
    assert.match(root.stdout, /--api-key-stdin/);
    assert.match(root.stdout, /config\s+Manage configuration/);
    assert.equal(config.status, 0, config.stderr);
    assert.match(config.stdout, /set-key/);
  });

  it("rejects an empty target before contacting TrustMRR", () => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
      cwd: projectRoot,
      encoding: "utf-8",
      env,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Please provide a startup slug or name/);
  });
});
