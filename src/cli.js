#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { run } from "./commands/index.js";
import { configureKey, showConfig } from "./commands/config.js";

var cli = createCLI({
  name: "saas-autopsy",
  description: "Post-mortem analysis of SaaS startups",
  version: "0.1.0",
  configDir: ".saas-autopsy",
});

cli
  .argument("[target]", "Startup slug or name to analyze")
  .option("--share", "Generate shareable death certificate image")
  .option("--api-key <key>", "TrustMRR API key")
  .option("--api-key-stdin", "Read API key from stdin")
  .action(run);

var configCmd = cli.command("config").description("Manage configuration");

configCmd
  .command("set-key <key>")
  .description("Save your TrustMRR API key securely")
  .action(configureKey);

configCmd
  .command("show")
  .description("Show current configuration")
  .action(showConfig);

cli.run();
