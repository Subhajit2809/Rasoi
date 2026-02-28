import { createRequire } from "module";
const require = createRequire(import.meta.url);

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
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

export default withPWA(nextConfig);
