import { withSentryConfig } from "@sentry/nextjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  customWorkerDir: "worker",
  fallbacks: {
    // Served when navigating while offline
    document: "/offline",
  },
  // Cache SVG icons + manifest alongside generated assets
  publicExcludes: ["!icons/**/*", "!manifest.json"],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withSentryConfig(withPWA(nextConfig), {
  // Silently skip source map upload if no auth token is set
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
