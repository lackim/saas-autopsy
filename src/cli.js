#!/usr/bin/env node

import { createCLI } from "@shipcli/core/cli";
import { run } from "./commands/index.js";

var cli = createCLI({
  name: "saas-autopsy",
  description: "Post-mortem analysis of SaaS startups",
  version: "0.1.0",
  configDir: ".saas-autopsy",
});

cli
  .argument("[target]", "Startup slug or name to analyze")
  .option("--share", "Generate shareable death certificate image")
  .option("--api-key <key>", "TrustMRR API key (or set TRUSTMRR_API_KEY env var)")
  .action(run);

cli.run();
