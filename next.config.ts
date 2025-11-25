import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // For Neon (server-side only, not bundled)
  serverExternalPackages: ['@neondatabase/serverless'],

  async redirects() {
    return [
      {
        source: "/",
        destination: "/predict",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
