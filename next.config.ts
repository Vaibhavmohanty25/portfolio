import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The existing Vercel and GitHub Pages sites serve static files.
  output: "export",
  distDir: "out",
  assetPrefix: ".",
};

export default nextConfig;
