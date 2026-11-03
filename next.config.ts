import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: this site is fully static (mock data, no API routes),
  // and deploys as static files to Cloudflare Workers assets (wrangler.jsonc),
  // same as the other Vite/static sites in the fleet.
  output: "export",
};

export default nextConfig;
