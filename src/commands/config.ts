import { Config } from "@shipcli/core/config";
import { error, fmt, status, success } from "@shipcli/core/output";

export interface ApiKeyOptions {
  apiKey?: string;
  apiKeyStdin?: boolean;
}

export interface SetKeyOptions {
  stdin?: boolean;
}

interface ConfigReader {
  get(key: string): unknown;
}

interface ConfigWriter extends ConfigReader {
  set(key: string, value: unknown): unknown;
  save(): unknown;
}

function getConfig(): Config {
  return new Config("saas-autopsy").load();
}

export async function readApiKeyFromStdin(
  input: AsyncIterable<string | Uint8Array> = process.stdin,
): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of input) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString().trim();
}

export async function configureKey(
  positionalKey: string | undefined,
  options: SetKeyOptions = {},
  config: ConfigWriter = getConfig(),
  input: AsyncIterable<string | Uint8Array> = process.stdin,
): Promise<void> {
  if (positionalKey && options.stdin) {
    error("Choose one API key input method.", "Pass the key argument or use --stdin, not both.");
    process.exitCode = 1;
    return;
  }

  const key = options.stdin ? await readApiKeyFromStdin(input) : positionalKey?.trim();
  if (!key) {
    error(
      "API key required.",
      "Pipe it securely: printf '%s' \"$TRUSTMRR_API_KEY\" | saas-autopsy config set-key --stdin",
    );
    process.exitCode = 1;
    return;
  }

  // Header values cannot contain whitespace or controls; rejecting them also
  // keeps malformed secrets out of the local config file.
  // eslint-disable-next-line no-control-regex
  if (!/^tmrr_[^\s\u0000-\u001f\u007f]+$/.test(key)) {
    error("Invalid API key.", "TrustMRR keys start with tmrr_");
    process.exitCode = 1;
    return;
  }

  config.set("apiKey", key);
  config.save();

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
  status(fmt.dim("Run: saas-autopsy config set-key --stdin"));
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
