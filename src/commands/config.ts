import { Config } from "@shipcli/core/config";
import { error, fmt, status, success } from "@shipcli/core/output";

export interface ApiKeyOptions {
  apiKey?: string;
  apiKeyStdin?: boolean;
}

interface ConfigReader {
  get(key: string): unknown;
}

function getConfig(): Config {
  return new Config("saas-autopsy").load();
}

export function configureKey(key: string): void {
  if (!key.startsWith("tmrr_")) {
    error("Invalid API key.", "TrustMRR keys start with tmrr_");
    process.exitCode = 1;
    return;
  }

  getConfig().set("apiKey", key).save();

  const masked = key.slice(0, 8) + "..." + key.slice(-4);
  success(`API key saved: ${fmt.dim(masked)}`);
  status(fmt.dim("Stored in ~/.saas-autopsy/config.json"));
}

export function showConfig(): void {
  const key = getConfig().get("apiKey");

  if (typeof key === "string" && key.length > 0) {
    const masked = key.slice(0, 8) + "..." + key.slice(-4);
    status(`API Key: ${fmt.val(masked)}`);
    return;
  }

  status("API Key: " + fmt.dim("not set"));
  status(fmt.dim("Run: saas-autopsy config set-key <your-key>"));
}

export function loadApiKey(
  options: ApiKeyOptions,
  config: ConfigReader = getConfig(),
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  if (options.apiKey) return options.apiKey;

  const saved = config.get("apiKey");
  if (typeof saved === "string" && saved.length > 0) return saved;

  return env.TRUSTMRR_API_KEY || null;
}
