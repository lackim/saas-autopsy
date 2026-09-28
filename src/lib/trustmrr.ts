const BASE_URL = "https://trustmrr.com/api/v1";
const REQUEST_TIMEOUT_MS = 15_000;

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

export class TrustMrrApiError extends Error {
  constructor(readonly status: number) {
    super(`TrustMRR API returned ${status}`);
    this.name = "TrustMrrApiError";
  }
}

export class TrustMrrResponseError extends Error {
  constructor(message = "TrustMRR returned an invalid response") {
    super(message);
    this.name = "TrustMrrResponseError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2_000) {
    throw new TrustMrrResponseError(`Invalid ${field}`);
  }
  return value;
}

function optionalString(value: unknown, field: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string" || value.length > 2_000) {
    throw new TrustMrrResponseError(`Invalid ${field}`);
  }
  return value;
}

function finiteNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function optionalFiniteNumber(value: unknown): number | null {
  return value == null ? null : typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseTechStack(value: unknown): TechStackItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap((item) => {
    if (!isRecord(item) || typeof item.slug !== "string" || typeof item.category !== "string") return [];
    return [{ slug: item.slug.slice(0, 200), category: item.category.slice(0, 200) }];
  });
}

function parseCofounders(value: unknown): Cofounder[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap((item) => {
    if (!isRecord(item) || typeof item.xHandle !== "string") return [];
    return [{
      xHandle: item.xHandle.slice(0, 200),
      xName: typeof item.xName === "string" ? item.xName.slice(0, 200) : null,
    }];
  });
}

function parseStartup(value: unknown): TrustMrrStartup {
  if (!isRecord(value)) throw new TrustMrrResponseError();
  const revenue = isRecord(value.revenue) ? value.revenue : {};
  const foundedDate = optionalString(value.foundedDate, "startup founded date");

  return {
    name: requiredString(value.name, "startup name"),
    slug: requiredString(value.slug, "startup slug"),
    description: optionalString(value.description, "startup description"),
    category: optionalString(value.category, "startup category"),
    country: optionalString(value.country, "startup country"),
    website: optionalString(value.website, "startup website"),
    foundedDate: foundedDate && Number.isFinite(Date.parse(foundedDate)) ? foundedDate : null,
    paymentProvider: typeof value.paymentProvider === "string" ? value.paymentProvider.slice(0, 200) : "unknown",
    revenue: {
      mrr: finiteNumber(revenue.mrr),
      last30Days: finiteNumber(revenue.last30Days),
      total: finiteNumber(revenue.total),
    },
    customers: finiteNumber(value.customers),
    activeSubscriptions: finiteNumber(value.activeSubscriptions),
    growth30d: optionalFiniteNumber(value.growth30d),
    profitMarginLast30Days: optionalFiniteNumber(value.profitMarginLast30Days),
    onSale: value.onSale === true,
    askingPrice: optionalFiniteNumber(value.askingPrice),
    multiple: optionalFiniteNumber(value.multiple),
    techStack: parseTechStack(value.techStack),
    cofounders: parseCofounders(value.cofounders),
    xHandle: optionalString(value.xHandle, "startup X handle"),
  };
}

function requestOptions(apiKey: string): RequestInit {
  return {
    headers: { Authorization: `Bearer ${apiKey}` },
    redirect: "error",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  };
}

async function readData<T>(response: Response, parse: (value: unknown) => T): Promise<T> {
  if (!response.ok) throw new TrustMrrApiError(response.status);
  const payload: unknown = await response.json();
  const data = isRecord(payload) && "data" in payload ? payload.data : payload;
  return parse(data);
}

export async function fetchStartup(
  slug: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TrustMrrStartup | null> {
  const response = await fetchImpl(
    `${BASE_URL}/startups/${encodeURIComponent(slug)}`,
    requestOptions(apiKey),
  );
  if (response.status === 404) return null;
  return readData(response, parseStartup);
}

export async function searchStartup(
  query: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<TrustMrrStartup[]> {
  const params = new URLSearchParams({ search: query, limit: "5" });
  const response = await fetchImpl(`${BASE_URL}/startups?${params}`, requestOptions(apiKey));
  return readData(response, (value) => {
    if (!Array.isArray(value)) throw new TrustMrrResponseError("Invalid startup list");
    return value.map(parseStartup);
  });
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
