import { Config } from "@shipcli/core/config";
import { success, error, status, fmt } from "@shipcli/core/output";

function getConfig() {
  return new Config("saas-autopsy").load();
}

export function configureKey(key) {
  if (!key || !key.startsWith("tmrr_")) {
    error("Invalid API key.", "TrustMRR keys start with tmrr_");
    return;
  }

  var config = getConfig();
  config.set("apiKey", key);
  config.save();

  var masked = key.slice(0, 8) + "..." + key.slice(-4);
  success(`API key saved: ${fmt.dim(masked)}`);
  status(fmt.dim(`Stored in ~/.saas-autopsy/config.json`));
}

export function showConfig() {
  var config = getConfig();
  var key = config.get("apiKey");

  if (key) {
    var masked = key.slice(0, 8) + "..." + key.slice(-4);
    status(`API Key: ${fmt.val(masked)}`);
  } else {
    status("API Key: " + fmt.dim("not set"));
    status(fmt.dim("Run: saas-autopsy config set-key <your-key>"));
  }
}

export function loadApiKey(options) {
  // Priority: --api-key flag > config file > env var
  if (options.apiKey) return options.apiKey;

  var config = getConfig();
  var saved = config.get("apiKey");
  if (saved) return saved;

  return process.env.TRUSTMRR_API_KEY || null;
}
