import type { SatoriElement } from "@shipcli/share";
import type { AnalysisReport } from "../lib/analyze.js";

function h(type: string, props: Record<string, unknown>, ...children: unknown[]): SatoriElement {
  return {
    type,
    props: { ...props, children: children.length === 1 ? children[0] : children },
  };
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function saasDeathCertificateTemplate(report: AnalysisReport): SatoriElement {
  const statusColor = report.score >= 80 ? "#22c55e" : report.score >= 50 ? "#eab308" : "#ef4444";
  const textDim = "#888";
  const textMain = "#e5e5e5";
  const growthText = report.growth === null
    ? "N/A"
    : report.growth > 0
      ? `+${report.growth}%`
      : `${report.growth}%`;
  const growthColor = report.growth === null
    ? textDim
    : report.growth > 0
      ? "#22c55e"
      : report.growth < 0
        ? "#ef4444"
        : textDim;

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "#0f0f0f",
      padding: "48px",
      fontFamily: "Inter, sans-serif",
      color: textMain,
    },
  },
  h("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  },
  h("div", { style: { display: "flex", flexDirection: "column" } },
    h("div", {
      style: { fontSize: "16px", color: textDim, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" },
    }, "SAAS DEATH CERTIFICATE"),
    h("div", { style: { fontSize: "42px", fontWeight: 700, color: "#fff" } }, report.name),
    h("div", { style: { fontSize: "16px", color: textDim, marginTop: "4px" } }, `${report.category} · ${report.country}`),
  ),
  h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#1a1a1a",
      border: `2px solid ${statusColor}`,
      borderRadius: "16px",
      padding: "16px 24px",
    },
  },
  h("div", { style: { fontSize: "48px", fontWeight: 700, color: statusColor } }, String(report.score)),
  h("div", { style: { fontSize: "14px", color: textDim } }, "/ 100"))),
  h("div", {
    style: {
      display: "flex",
      flex: 1,
      backgroundColor: "#1a1a1a",
      borderRadius: "16px",
      border: "1px solid #333",
      padding: "32px",
      gap: "32px",
    },
  },
  h("div", { style: { display: "flex", flexDirection: "column", flex: 1, gap: "16px" } },
    infoRow("Cause of Death", report.causeOfDeath, "#ef4444"),
    infoRow("Status", report.status.toUpperCase(), statusColor),
    infoRow("MRR", money(report.mrr), report.mrr > 0 ? "#22c55e" : "#ef4444"),
    infoRow("Revenue (30d)", money(report.revenue30d), textMain),
    infoRow("Total Revenue", money(report.revenueTotal), textMain)),
  h("div", { style: { display: "flex", flexDirection: "column", flex: 1, gap: "16px" } },
    infoRow("Customers", String(report.customers), textMain),
    infoRow("Active Subs", String(report.activeSubs), report.activeSubs > 0 ? textMain : "#ef4444"),
    infoRow("Growth (30d)", growthText, growthColor),
    infoRow("Profit Margin", report.profitMargin === null ? "N/A" : `${report.profitMargin}%`, report.profitMargin !== null && report.profitMargin >= 0 ? "#22c55e" : "#ef4444"),
    infoRow("For Sale", report.onSale ? report.askingPrice ? money(report.askingPrice) : "Yes" : "No", report.onSale ? "#eab308" : textDim))),
  h("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" },
  },
  h("div", { style: { fontSize: "14px", color: textDim } }, report.description ? `"${report.description}"` : ""),
  h("div", { style: { fontSize: "14px", color: textDim } }, "saas-autopsy · Built with shipcli")));
}

function infoRow(label: string, value: string, color: string): SatoriElement {
  return h("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  },
  h("div", { style: { fontSize: "16px", color: "#888" } }, label),
  h("div", { style: { fontSize: "16px", fontWeight: 700, color } }, value));
}
