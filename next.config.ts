import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline the (small) stylesheet so first paint isn't blocked on a CSS request.
  experimental: { inlineCss: true },
  poweredByHeader: false,
};

export default nextConfig;
