@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a0a0a;
  --card: #141414;
  --border: #262626;
  --text: #e5e5e5;
  --text-dim: #737373;
  --accent: #4ade80;
  --accent-dim: #15803d;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

::selection {
  background: rgba(74, 222, 128, 0.25);
  color: white;
}

.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
}

.hero-grid::after {
  position: absolute;
  z-index: 0;
  inset: 0;
  content: "";
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.12), var(--bg));
}

.hero-glow {
  position: absolute;
  z-index: 0;
  top: -12rem;
  left: 18%;
  width: 52rem;
  height: 34rem;
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.13), transparent 68%);
  filter: blur(24px);
}

.hero-grid > .relative {
  z-index: 1;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #262626;
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  background: rgba(23, 23, 23, 0.7);
  color: #a3a3a3;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.8);
}

.accent-text {
  background: linear-gradient(120deg, #fff 10%, #86efac 55%, #22d3ee 105%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.brand-mark {
  display: inline-grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid #404040;
  border-radius: 0.55rem;
  background: #171717;
  color: #4ade80;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.72rem;
}

.button-secondary,
.button-quiet {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 0.7rem;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: 160ms ease;
}

.button-secondary {
  border: 1px solid #404040;
  color: #e5e5e5;
}

.button-secondary:hover {
  border-color: #737373;
  background: #171717;
}

.button-quiet {
  color: #737373;
}

.button-quiet:hover {
  color: #d4d4d4;
}

.section-shell {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding: 6.5rem 1.5rem;
}

.section-kicker {
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.terminal {
  height: 22rem;
  overflow: hidden;
  border: 1px solid #333;
  border-radius: 16px;
  background: rgba(10, 10, 10, 0.94);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.65;
}

.terminal-header {
  display: flex;
  height: 46px;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  background: #141414;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-title {
  margin-left: 10px;
  overflow: hidden;
  color: #737373;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.terminal-live {
  display: flex;
  flex: none;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  color: #525252;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.terminal-live span {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #4ade80;
}

.terminal-body {
  height: calc(22rem - 46px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 22px;
  scrollbar-color: #404040 transparent;
  scrollbar-width: thin;
  white-space: pre-wrap;
}

.terminal-body::-webkit-scrollbar {
  width: 6px;
}

.terminal-body::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #404040;
}

.workflow-step {
  min-height: 18rem;
  transition: background 180ms ease;
}

.workflow-step:hover {
  background: #111;
}

.step-number {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid #333;
  border-radius: 999px;
  color: #737373;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.65rem;
}

.result-panel {
  background: linear-gradient(145deg, #111, #090909 65%);
}

.result-preview {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 28px 28px;
}

.output-card {
  overflow-x: auto;
  border: 1px solid #333;
  border-radius: 0.9rem;
  padding: 1.4rem;
  background: #090909;
  color: #86efac;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.82rem;
  line-height: 1.8;
}

.proof-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: #a3a3a3;
  font-size: 0.86rem;
}

.proof-item span {
  color: #4ade80;
}

.cta-card {
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(20, 83, 45, 0.16), rgba(10, 10, 10, 0.5) 55%);
}

@media (max-width: 640px) {
  .section-shell {
    padding-bottom: 5rem;
    padding-top: 5rem;
  }

  .terminal {
    height: 20rem;
    font-size: 11px;
  }

  .terminal-body {
    height: calc(20rem - 46px);
    padding: 16px;
  }

  .workflow-step {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
