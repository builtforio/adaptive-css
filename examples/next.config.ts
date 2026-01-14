import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile adaptive-css for client-side use
  transpilePackages: ["adaptive-css"],
};

export default nextConfig;
