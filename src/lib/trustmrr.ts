const BASE_URL = "https://trustmrr.com/api/v1";

export interface RevenueMetrics {
  mrr: number;
  last30Days: number;
  total: number;
}

export interface TechStackItem {
  slug: string;
  category: string;
}

export interface Cofounder {
  xHandle: string;
  xName: string | null;
}

export interface TrustMrrStartup {
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  country: string | null;
  website: string | null;
  foundedDate: string | null;
  paymentProvider: string;
  revenue: RevenueMetrics;
  customers: number;
  activeSubscriptions: number;
  growth30d: number | null;
  profitMarginLast30Days: number | null;
  onSale: boolean;
  askingPrice: number | null;
  multiple: number | null;
  techStack?: TechStackItem[];
  cofounders?: Cofounder[];
  xHandle: string | null;
}

interface ApiEnvelope<T> {
  data: T;
}

export class TrustMrrApiError extends Error {
  constructor(readonly status: number) {
    super(`TrustMRR API returned ${status}`);
    this.name = "TrustMrrApiError";
  }
}

async function readData<T>(response: Response): Promise<T> {
  if (!response.ok) throw new TrustMrrApiError(response.status);
  const payload = await response.json() as ApiEnvelope<T> | T;
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload as T;
}

export async function fetchStartup(
  slug: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TrustMrrStartup | null> {
  const response = await fetchImpl(`${BASE_URL}/startups/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (response.status === 404) return null;
  return readData<TrustMrrStartup>(response);
}

export async function searchStartup(
  query: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TrustMrrStartup[]> {
  const params = new URLSearchParams({ search: query, limit: "5" });
  const response = await fetchImpl(`${BASE_URL}/startups?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return readData<TrustMrrStartup[]>(response);
}

export function parseTarget(target: string): string {
  const trimmed = target.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.hostname === "trustmrr.com" || url.hostname === "www.trustmrr.com") {
        const match = /^\/startup\/([^/]+)\/?$/.exec(url.pathname);
        if (match) return decodeURIComponent(match[1]).toLowerCase();
      }
    } catch {}
  }

  return trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
