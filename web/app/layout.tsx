import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "saas-autopsy — Post-mortem analysis of SaaS startups",
  description: "Diagnose SaaS health from verified TrustMRR revenue and growth data.",
  openGraph: {
    title: "saas-autopsy",
    description: "Diagnose SaaS health from verified TrustMRR revenue and growth data.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "saas-autopsy",
    description: "Diagnose SaaS health from verified TrustMRR revenue and growth data.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
