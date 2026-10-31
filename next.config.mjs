/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js / d3-geo ship as ESM client bundles; keep them out of the server bundle.
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "@google/genai"],
  },
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:8000";

    return [
      {
        source: "/ask",
        destination: `${backendUrl}/ask`,
      },
      {
        source: "/health",
        destination: `${backendUrl}/health`,
      },
    ];
  },
  webpack(config) {
    return config;
  },
};

export default nextConfig;
