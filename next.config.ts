import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // ❗ FIXED: moved out of `experimental`
  serverExternalPackages: ['@neondatabase/serverless'],

  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*'],
  },

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
