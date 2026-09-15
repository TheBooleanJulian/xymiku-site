import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: this site is fully static (mock data, no API routes),
  // and deploys as prebuilt static files to Zeabur, same as the other
  // Vite/static sites in this pipeline (luxsync-v2, miku-bday).
  output: "export",
};

export default nextConfig;
