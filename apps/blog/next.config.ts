import type { NextConfig } from "next";
import { config } from "dotenv";
import path from "path";

// Load .env from monorepo root so blog picks up shared env vars
config({ path: path.resolve(__dirname, "../../.env") });

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
