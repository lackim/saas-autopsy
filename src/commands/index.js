import { phase, status, success, fatal, fmt } from "@shipcli/core/output";
import { spinner } from "@shipcli/core/spinner";
import { getApiKey, fetchStartup, searchStartup, parseTarget } from "../lib/trustmrr.js";
import { analyze } from "../lib/analyze.js";
import { renderCertificate } from "../lib/certificate.js";

export async function run(target, options) {
  if (!target) {
    fatal("Please provide a startup slug or name.", "Usage: saas-autopsy <slug>");
  }

  var apiKey = getApiKey(options);
  if (!apiKey) {
    fatal(
      "TrustMRR API key required.",
      "Set TRUSTMRR_API_KEY env var or pass --api-key <key>\n  Get your key at https://trustmrr.com"
    );
  }

  var slug = parseTarget(target);
  phase(`Performing autopsy on ${fmt.app(slug)}`);

  var s = spinner("Fetching startup data from TrustMRR...").start();
  var startup = await fetchStartup(slug, apiKey);

  if (!startup) {
    // Try search
    s.update({ text: `Searching for "${target}"...` });
    var results = await searchStartup(target, apiKey);
    if (results.length > 0) {
      startup = results[0];
      s.success({ text: `Found: ${startup.name} (${startup.slug})` });
    } else {
      s.error({ text: "Startup not found" });
      fatal(
        `Could not find "${target}" on TrustMRR.`,
        "Check the slug at https://trustmrr.com or try a different name."
      );
    }
  } else {
    s.success({ text: "Startup data fetched" });
  }

  var s2 = spinner("Analyzing vital signs...").start();
  var report = analyze(startup);
  s2.success({ text: `Analysis complete — ${report.signals.length} signals found` });

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(renderCertificate(report));

  if (options.share) {
    var s3 = spinner("Generating share image...").start();
    var { share } = await import("@shipcli/share");
    var { saasDeathCertificateTemplate } = await import("../share/card.js");
    await share(saasDeathCertificateTemplate, report, {
      toolName: "saas-autopsy",
      filename: `saas-autopsy-${report.slug}.png`,
    });
    s3.success({ text: "Share image generated" });
  }

  if (report.status === "thriving") {
    success("This startup is thriving!");
  } else if (report.status === "healthy") {
    success("This startup appears healthy.");
  } else if (report.status === "declining") {
    status(fmt.dim("Prognosis: declining health. Revenue intervention needed."));
  } else {
    status(fmt.dim("Rest in peace."));
  }
}
