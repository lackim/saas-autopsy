import { fatal, fmt, phase, status, success } from "@shipcli/core/output";
import { loadShipcliConfig } from "@shipcli/core/project-config";
import { spinner } from "@shipcli/core/spinner";
import { analyze } from "../lib/analyze.js";
import { renderCertificate } from "../lib/certificate.js";
import {
  fetchStartup,
  parseTarget,
  searchStartup,
  TrustMrrApiError,
  TrustMrrResponseError,
} from "../lib/trustmrr.js";
import { safeFilenameSegment, safeTerminalText } from "../lib/terminal.js";
import { saasDeathCertificateTemplate } from "../share/card.js";
import { loadApiKey, readApiKeyFromStdin, type ApiKeyOptions } from "./config.js";

export interface RunOptions extends ApiKeyOptions {
  json?: boolean;
  share?: boolean;
}

function failForApiError(error: unknown): never {
  if (error instanceof TrustMrrApiError) {
    if (error.status === 401) {
      fatal("TrustMRR rejected the API key.", "Create or rotate it at https://trustmrr.com/developer");
    }
    if (error.status === 403) {
      fatal("TrustMRR API access is disabled for this key.", "Review the API Acceptable Use Policy.");
    }
    if (error.status === 429) {
      fatal("TrustMRR rate limit reached.", "Wait a minute and try again.");
    }
    fatal(`TrustMRR API request failed (${error.status}).`, "Try again later.");
  }
  if (error instanceof TrustMrrResponseError) {
    fatal("TrustMRR returned unexpected data.", "Try again later or report the API response change.");
  }
  fatal("Could not connect to TrustMRR.", "Check your network connection and try again.");
}

export async function run(target: string | undefined, options: RunOptions): Promise<void> {
  if (!target) {
    fatal("Please provide a startup slug or name.", "Usage: saas-autopsy <slug>");
  }

  if (options.apiKeyStdin) options.apiKey = await readApiKeyFromStdin();

  const apiKey = loadApiKey(options);
  if (!apiKey) {
    fatal(
      "TrustMRR API key required.",
      "Run: saas-autopsy config set-key --stdin\n  Get your key at https://trustmrr.com/developer",
    );
  }

  const slug = parseTarget(target);
  if (!slug) fatal("Invalid startup slug or name.");
  phase(`Performing autopsy on ${fmt.app(slug)}`);

  const fetchSpinner = spinner("Fetching startup data from TrustMRR...").start();
  let startup;
  try {
    startup = await fetchStartup(slug, apiKey);
    if (!startup) {
      fetchSpinner.update({ text: `Searching for "${safeTerminalText(target)}"...` });
      const results = await searchStartup(target, apiKey);
      startup = results[0] ?? null;
      if (startup) {
        fetchSpinner.success({
          text: `Found: ${safeTerminalText(startup.name)} (${safeTerminalText(startup.slug)})`,
        });
      }
    } else {
      fetchSpinner.success({ text: "Startup data fetched" });
    }
  } catch (error) {
    fetchSpinner.error({ text: "TrustMRR request failed" });
    failForApiError(error);
  }

  if (!startup) {
    fetchSpinner.error({ text: "Startup not found" });
    fatal(
      `Could not find "${safeTerminalText(target)}" on TrustMRR.`,
      "Check the slug at https://trustmrr.com or try a different name.",
    );
  }

  const analysisSpinner = spinner("Analyzing vital signs...").start();
  const report = analyze(startup);
  analysisSpinner.success({ text: `Analysis complete — ${report.signals.length} signals found` });

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(renderCertificate(report));

  if (options.share) {
    const config = await loadShipcliConfig();
    if (config.share?.enabled !== false) {
      const shareSpinner = spinner("Generating share image...").start();
      const { share } = await import("@shipcli/share");
      await share(saasDeathCertificateTemplate, report, {
        toolName: "saas-autopsy",
        filename: `saas-autopsy-${safeFilenameSegment(report.slug)}.png`,
      });
      shareSpinner.success({ text: "Share image generated" });
    }
  }

  if (report.status === "thriving") success("This startup is thriving!");
  else if (report.status === "healthy") success("This startup appears healthy.");
  else if (report.status === "declining") {
    status(fmt.dim("Prognosis: declining health. Revenue intervention needed."));
  } else status(fmt.dim("Rest in peace."));
}
