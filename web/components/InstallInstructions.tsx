"use client";

import { useState } from "react";

const METHODS = [
  { label: "npm", command: "npm install --global saas-autopsy" },
  { label: "npx", command: "npx saas-autopsy --help" },
];

export function InstallInstructions() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const method = METHODS[active];

  const copy = async () => {
    await navigator.clipboard.writeText(method.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-w-0 w-full max-w-md">
      <div className="mb-2 flex gap-1" aria-label="Installation method">
        {METHODS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setActive(index);
              setCopied(false);
            }}
            className={"rounded-md px-3 py-1 text-xs transition-colors " + (index === active ? "bg-neutral-800 text-white" : "text-neutral-600 hover:text-neutral-300")}
            aria-pressed={index === active}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={copy}
        className="command-copy group flex w-full items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3.5 text-left transition hover:border-neutral-500 hover:bg-neutral-800/80"
        aria-label={"Copy command: " + method.command}
      >
        <span className="select-none text-emerald-400">$</span>
        <code className="min-w-0 flex-1 truncate text-sm text-neutral-200">{method.command}</code>
        <span className="text-xs text-neutral-600 transition group-hover:text-neutral-400" aria-live="polite">
          {copied ? "copied ✓" : "copy"}
        </span>
      </button>
    </div>
  );
}
