import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Pour Docker avec .next/standalone
  turbopack: {
    root: __dirname, // Fix: specify the workspace root directory
  },
};

export default nextConfig;
