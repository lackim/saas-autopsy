import { defineConfig } from "@shipcli/core";

export default defineConfig({
  name: "saas-autopsy",
  description: "Post-mortem analysis of SaaS startups",
  build: {
    entrypoint: "./src/cli.ts",
    outDir: "bin",
    targets: ["macos-arm64", "linux-x64", "windows-x64"],
  },
  publish: {
    access: "public",
    bump: "patch",
  },
  share: {
    enabled: true,
  },
  landing: {
    outDir: "web",
  },
});
