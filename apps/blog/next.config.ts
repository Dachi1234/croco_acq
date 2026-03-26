import type { NextConfig } from "next";

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
