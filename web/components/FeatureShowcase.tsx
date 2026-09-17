const STEPS = [
  {
    number: "01",
    title: "Install",
    command: "npm i -g saas-autopsy",
    description: "Install the published CLI on Node.js 24 or newer.",
  },
  {
    number: "02",
    title: "Connect",
    command: "saas-autopsy config set-key tmrr_…",
    description: "Store your TrustMRR API key in a private local configuration file.",
  },
  {
    number: "03",
    title: "Analyze",
    command: "saas-autopsy startup-slug",
    description: "Fetch verified metrics and calculate health, cause, and visible risk signals.",
  },
  {
    number: "04",
    title: "Export",
    command: "saas-autopsy startup-slug --share",
    description: "Use JSON in automation or render a polished 1200×630 result card.",
  },
];

export function FeatureShowcase() {
  return (
    <div className="workflow-grid grid gap-px overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800 md:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step) => (
        <div key={step.title} className="workflow-step bg-neutral-950 p-6 sm:p-7">
          <div className="step-number">{step.number}</div>
          <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
          <code className="mt-3 block overflow-hidden text-ellipsis text-xs text-emerald-400">$ {step.command}</code>
          <p className="mt-4 text-sm leading-6 text-neutral-500">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
