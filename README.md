# saas-autopsy

Post-mortem analysis of SaaS startups. Find out if an indie SaaS is thriving, declining, or dead — powered by verified revenue data from [TrustMRR](https://trustmrr.com).

## Quick Start

```bash
npm install --global saas-autopsy
saas-autopsy config set-key tmrr_your_key_here
saas-autopsy <slug>
```

Requires Node.js 24 or newer.

## Installation

```bash
npm install -g saas-autopsy
```

## Setup

You need a TrustMRR API key. Create one in the [developer dashboard](https://trustmrr.com/developer).

```bash
# Save your key securely (stored in ~/.saas-autopsy/config.json)
saas-autopsy config set-key tmrr_your_key_here

# That's it — all commands will use the saved key automatically
saas-autopsy some-startup
```

Other options for CI/scripts:

```bash
# Pipe from file (key never appears in shell history or ps)
cat ~/.trustmrr-key | saas-autopsy some-startup --api-key-stdin

# Environment variable (recommended for CI)
TRUSTMRR_API_KEY=tmrr_... saas-autopsy some-startup
```

## Usage

```bash
# Analyze a startup by slug
saas-autopsy some-startup

# Search by name
saas-autopsy "Cool SaaS Tool"

# Generate a shareable death certificate image (PNG)
saas-autopsy some-startup --share

# Get raw JSON output
saas-autopsy some-startup --json

# Analyze a TrustMRR URL directly
saas-autopsy https://trustmrr.com/startup/some-startup
```

## What It Analyzes

saas-autopsy examines verified revenue data to determine startup health:

TrustMRR monetary values are returned in cents and converted to USD for terminal,
JSON, and share-card output. Decimal growth values are converted to percentages.

| Signal | Severity |
|--------|----------|
| Zero lifetime revenue | Critical |
| MRR dropped to $0 | Critical |
| Revenue collapsed 50%+ | Critical |
| Zero customers | Critical |
| All subscriptions churned | Critical |
| Burning cash (margin < -50%) | Critical |
| Fire sale (< 2x multiple) | Critical |
| MRR under $10 | Warning |
| Revenue declining 25%+ | Warning |
| Few customers (< 5) | Warning |
| Negative profit margin | Warning |
| Listed for sale | Warning |
| Revenue shrinking | Warning |

## Health Score

Each startup gets a health score from 0 to 100:

- **80-100** — Thriving
- **60-79** — Healthy
- **40-59** — Declining
- **20-39** — On life support
- **0-19** — Dead

## Cause of Death

- **Dead on arrival** — Never got traction (zero revenue + zero customers)
- **Revenue collapse** — MRR dropped 50%+ in 30 days
- **Total customer churn** — All subscribers left
- **Revenue flatlined** — Had revenue, now $0 MRR
- **Founder giving up** — Listed for sale at fire-sale multiple
- **Founder looking to exit** — Listed for sale
- **Accelerating decline** — Revenue dropping 25%+
- **Slow bleed** — Multiple warning signals
- **Alive and kicking** — No death signals

## Share

Use `--share` to generate a PNG death certificate card:

```bash
saas-autopsy some-startup --share
# → Saves saas-autopsy-some-startup.png
```

## Data Source

All revenue data is verified by [TrustMRR](https://trustmrr.com) — real numbers from payment providers (Stripe, Paddle, etc.), not self-reported.

## Built with

[shipcli 0.4](https://github.com/lackim/shipcli) — typed CLI framework,
packaging, landing-page scaffolding, and share-card generation.

## Development

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` runs TypeScript validation, tests, the CLI build, and the landing-page build.

## License

MIT
