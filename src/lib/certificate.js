import { fmt } from "@shipcli/core/output";
import kleur from "kleur";

export function renderCertificate(report) {
  var lines = [];

  lines.push("");
  lines.push(kleur.dim("  ╔══════════════════════════════════════════════════════╗"));
  lines.push(kleur.dim("  ║") + kleur.bold("         SAAS DEATH CERTIFICATE              ") + kleur.dim("       ║"));
  lines.push(kleur.dim("  ╠══════════════════════════════════════════════════════╣"));
  lines.push(kleur.dim("  ║") + pad(`  Name:       ${fmt.bold(report.name)}`, 59) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Category:   ${report.category}`, 55) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Country:    ${report.country}`, 55) + kleur.dim("║"));
  if (report.foundedDate) {
    lines.push(kleur.dim("  ║") + pad(`  Founded:    ${formatDate(report.foundedDate)}`, 55) + kleur.dim("║"));
  }
  if (report.ageInDays) {
    lines.push(kleur.dim("  ║") + pad(`  Age:        ${formatAge(report.ageInDays)}`, 55) + kleur.dim("║"));
  }
  lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Cause:      ${kleur.red(report.causeOfDeath)}`, 59 + 4) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Status:     ${statusBadge(report.status)}`, 59 + 4) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Score:      ${scoreBadge(report.score)}/100`, 59 + 4) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
  lines.push(kleur.dim("  ╠══════════════════════════════════════════════════════╣"));
  lines.push(kleur.dim("  ║") + kleur.bold("  Financials") + pad("", 43) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  MRR:            ${fmt.val("$" + report.mrr.toLocaleString())}`, 59) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Revenue (30d):  ${fmt.val("$" + report.revenue30d.toLocaleString())}`, 59) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Total Revenue:  ${fmt.val("$" + report.revenueTotal.toLocaleString())}`, 59) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Customers:      ${fmt.val(String(report.customers))}`, 59) + kleur.dim("║"));
  lines.push(kleur.dim("  ║") + pad(`  Active Subs:    ${fmt.val(String(report.activeSubs))}`, 59) + kleur.dim("║"));

  if (report.growth !== null && report.growth !== undefined) {
    var g = Math.round(report.growth * 10) / 10;
    var growthStr = g > 0 ? `+${g}%` : `${g}%`;
    var growthColor = report.growth > 0 ? kleur.green(growthStr) : report.growth < 0 ? kleur.red(growthStr) : kleur.yellow(growthStr);
    lines.push(kleur.dim("  ║") + pad(`  Growth (30d):   ${growthColor}`, 59 + 4) + kleur.dim("║"));
  }

  if (report.profitMargin !== null && report.profitMargin !== undefined) {
    var marginColor = report.profitMargin >= 0 ? kleur.green(`${report.profitMargin}%`) : kleur.red(`${report.profitMargin}%`);
    lines.push(kleur.dim("  ║") + pad(`  Profit Margin:  ${marginColor}`, 59 + 4) + kleur.dim("║"));
  }

  if (report.onSale) {
    lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
    var saleStr = report.askingPrice ? `FOR SALE — $${report.askingPrice.toLocaleString()}` : "FOR SALE";
    if (report.multiple) saleStr += ` (${report.multiple}x)`;
    lines.push(kleur.dim("  ║") + pad(`  ${kleur.bgRed().white(` ${saleStr} `)}`, 59 + 14) + kleur.dim("║"));
  }

  lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));

  // Death signals
  if (report.signals.length > 0) {
    lines.push(kleur.dim("  ╠══════════════════════════════════════════════════════╣"));
    lines.push(kleur.dim("  ║") + kleur.bold("  Death Signals") + pad("", 40) + kleur.dim("║"));
    lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
    for (var signal of report.signals) {
      var icon = signal.severity === "critical" ? kleur.red("✖") : kleur.yellow("⚠");
      lines.push(kleur.dim("  ║") + pad(`  ${icon} ${signal.signal}`, 59 + 4) + kleur.dim("║"));
    }
    lines.push(kleur.dim("  ║") + pad("", 55) + kleur.dim("║"));
  }

  lines.push(kleur.dim("  ╚══════════════════════════════════════════════════════╝"));
  lines.push("");

  if (report.description) {
    lines.push(kleur.dim(`  "${report.description}"`));
    lines.push("");
  }

  if (report.website) {
    lines.push(kleur.dim(`  ${report.website}`));
    lines.push("");
  }

  return lines.join("\n");
}

function stripAnsi(str) {
  return String(str).replace(/\x1B\[[0-9;]*m/g, "");
}

function pad(str, len) {
  var visible = stripAnsi(str).length;
  return str + " ".repeat(Math.max(0, len - visible));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAge(days) {
  var years = Math.floor(days / 365);
  var months = Math.floor((days % 365) / 30);
  if (years > 0) return `${years}y ${months}m`;
  return `${months}m`;
}

function statusBadge(status) {
  var colors = {
    thriving: kleur.green,
    healthy: kleur.green,
    declining: kleur.yellow,
    "on life support": kleur.red,
    dead: (t) => kleur.bgRed().white(` ${t} `),
  };
  return (colors[status] || kleur.white)(status.toUpperCase());
}

function scoreBadge(score) {
  if (score >= 80) return kleur.green(String(score));
  if (score >= 50) return kleur.yellow(String(score));
  return kleur.red(String(score));
}
