// TrustMRR metadata is untrusted terminal input. Remove C0/C1 controls,
// including ESC and OSC terminators, before it reaches the user's terminal.
const TERMINAL_CONTROL_RE = /[\u0000-\u001f\u007f-\u009f]/g;

export function safeTerminalText(value: string): string {
  return value.replace(TERMINAL_CONTROL_RE, " ").replace(/\s+/g, " ").trim();
}

export function safeFilenameSegment(value: string, fallback = "startup"): string {
  const segment = safeTerminalText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return segment || fallback;
}
