function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

export function saasDeathCertificateTemplate(report) {
  var statusColor = report.score >= 80 ? "#22c55e" : report.score >= 50 ? "#eab308" : "#ef4444";
  var bgColor = "#0f0f0f";
  var cardBg = "#1a1a1a";
  var border = "#333";
  var textDim = "#888";
  var textMain = "#e5e5e5";

  var growthStr = report.growth !== null && report.growth !== undefined
    ? (report.growth > 0 ? `+${report.growth}%` : `${report.growth}%`)
    : "N/A";
  var growthColor = report.growth > 0 ? "#22c55e" : report.growth < 0 ? "#ef4444" : textDim;

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: bgColor,
      padding: "48px",
      fontFamily: "Inter, sans-serif",
      color: textMain,
    },
  },
    // Header
    h("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
      },
    },
      h("div", {
        style: { display: "flex", flexDirection: "column" },
      },
        h("div", {
          style: {
            fontSize: "16px",
            color: textDim,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "8px",
          },
        }, "SAAS DEATH CERTIFICATE"),
        h("div", {
          style: { fontSize: "42px", fontWeight: 700, color: "#fff" },
        }, report.name),
        h("div", {
          style: { fontSize: "16px", color: textDim, marginTop: "4px" },
        }, `${report.category} · ${report.country}`),
      ),
      // Score badge
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: cardBg,
          border: `2px solid ${statusColor}`,
          borderRadius: "16px",
          padding: "16px 24px",
        },
      },
        h("div", {
          style: { fontSize: "48px", fontWeight: 700, color: statusColor },
        }, String(report.score)),
        h("div", {
          style: { fontSize: "14px", color: textDim },
        }, "/ 100"),
      ),
    ),

    // Main card
    h("div", {
      style: {
        display: "flex",
        flex: 1,
        backgroundColor: cardBg,
        borderRadius: "16px",
        border: `1px solid ${border}`,
        padding: "32px",
        gap: "32px",
      },
    },
      // Left column
      h("div", {
        style: { display: "flex", flexDirection: "column", flex: 1, gap: "16px" },
      },
        infoRow("Cause of Death", report.causeOfDeath, "#ef4444"),
        infoRow("Status", report.status.toUpperCase(), statusColor),
        infoRow("MRR", `$${report.mrr.toLocaleString()}`, report.mrr > 0 ? "#22c55e" : "#ef4444"),
        infoRow("Revenue (30d)", `$${report.revenue30d.toLocaleString()}`, textMain),
        infoRow("Total Revenue", `$${report.revenueTotal.toLocaleString()}`, textMain),
      ),
      // Right column
      h("div", {
        style: { display: "flex", flexDirection: "column", flex: 1, gap: "16px" },
      },
        infoRow("Customers", String(report.customers), textMain),
        infoRow("Active Subs", String(report.activeSubs), report.activeSubs > 0 ? textMain : "#ef4444"),
        infoRow("Growth (30d)", growthStr, growthColor),
        report.profitMargin !== null && report.profitMargin !== undefined
          ? infoRow("Profit Margin", `${report.profitMargin}%`, report.profitMargin >= 0 ? "#22c55e" : "#ef4444")
          : infoRow("Profit Margin", "N/A", textDim),
        report.onSale
          ? infoRow("For Sale", report.askingPrice ? `$${report.askingPrice.toLocaleString()}` : "Yes", "#eab308")
          : infoRow("For Sale", "No", textDim),
      ),
    ),

    // Footer
    h("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "24px",
      },
    },
      h("div", {
        style: { fontSize: "14px", color: textDim },
      }, report.description ? `"${report.description}"` : ""),
      h("div", {
        style: { fontSize: "14px", color: textDim },
      }, "saas-autopsy · Built with shipcli"),
    ),
  );
}

function infoRow(label, value, valueColor) {
  return h("div", {
    style: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  },
    h("div", { style: { fontSize: "16px", color: "#888" } }, label),
    h("div", { style: { fontSize: "16px", fontWeight: 700, color: valueColor } }, value),
  );
}
