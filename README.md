# saas-autopsy

Post-mortem analysis of SaaS startups. Find out if an indie SaaS is thriving, declining, or dead — powered by verified revenue data from [TrustMRR](https://trustmrr.com).

## Quick Start

```bash
npx saas-autopsy <slug> --api-key <your-trustmrr-key>
```

## Installation

```bash
npm install -g saas-autopsy
```

## Setup

You need a TrustMRR API key. Get one at [trustmrr.com](https://trustmrr.com).

```bash
# Option 1: Environment variable
export TRUSTMRR_API_KEY=tmrr_your_key_here

# Option 2: Pass directly
saas-autopsy <slug> --api-key tmrr_your_key_here
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
```

## What It Analyzes

saas-autopsy examines verified revenue data to determine startup health:

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

[shipcli](https://github.com/lackim/shipcli) — CLI-as-a-Product toolkit

## License

MIT
