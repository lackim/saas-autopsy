var BASE_URL = "https://trustmrr.com/api/v1";

export async function fetchStartup(slug, apiKey) {
  var res = await fetch(`${BASE_URL}/startups/${slug}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return null;
  var json = await res.json();
  return json.data || json;
}

export async function searchStartup(query, apiKey) {
  var res = await fetch(`${BASE_URL}/startups?search=${encodeURIComponent(query)}&limit=5`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return [];
  var json = await res.json();
  return json.data || [];
}

export function parseTarget(target) {
  // Could be a slug (lowercase-dashed) or a name
  return target.toLowerCase().replace(/\s+/g, "-");
}
