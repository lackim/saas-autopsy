#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { configureKey, showConfig } from "./commands/config.js";
import { run } from "./commands/index.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(currentDir, "..", "package.json"), "utf-8")) as {
  name: string;
  version: string;
};

const cli = createCLI({
  name: "saas-autopsy",
  packageName: pkg.name,
  description: "Post-mortem analysis of SaaS startups",
  version: pkg.version,
});

cli
  .argument("[target]", "Startup slug or name to analyze")
  .option("--share", "Generate shareable death certificate image")
  .option("--api-key <key>", "TrustMRR API key")
  .option("--api-key-stdin", "Read API key from stdin")
  .action(run);

const configCommand = cli.command("config").description("Manage configuration");

configCommand
  .command("set-key <key>")
  .description("Save your TrustMRR API key securely")
  .action(configureKey);

configCommand
  .command("show")
  .description("Show current configuration")
  .action(showConfig);

await cli.run();
