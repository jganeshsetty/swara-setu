/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js / d3-geo ship as ESM client bundles; keep them out of the server bundle.
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "@google/genai"],
  },
  webpack(config) {
    return config;
  },
};

export default nextConfig;